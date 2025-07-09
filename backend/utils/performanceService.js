const NodeCache = require('node-cache');
const compression = require('compression');
const Redis = require('ioredis');

class PerformanceService {
  constructor() {
    // Initialize memory cache
    this.memoryCache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false,
      deleteOnExpire: true
    });

    // Initialize Redis cache (optional)
    this.redisClient = null;
    this.initializeRedis();

    // Performance metrics
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      responseTimes: [],
      memoryUsage: [],
      cpuUsage: []
    };

    // Start performance monitoring
    this.startMonitoring();
  }

  // Initialize Redis connection
  initializeRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redisClient = new Redis(process.env.REDIS_URL);
        console.log('Redis cache initialized');
      } else {
        console.log('Redis not configured, using memory cache only');
      }
    } catch (error) {
      console.error('Redis initialization failed:', error);
    }
  }

  // Memory cache operations
  async getFromCache(key) {
    try {
      const value = this.memoryCache.get(key);
      if (value !== undefined) {
        this.metrics.cacheHits++;
        return value;
      }
      this.metrics.cacheMisses++;
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setInCache(key, value, ttl = 300) {
    try {
      this.memoryCache.set(key, value, ttl);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async deleteFromCache(key) {
    try {
      this.memoryCache.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Redis cache operations
  async getFromRedis(key) {
    if (!this.redisClient) return null;
    
    try {
      const value = await this.redisClient.get(key);
      if (value) {
        this.metrics.cacheHits++;
        return JSON.parse(value);
      }
      this.metrics.cacheMisses++;
      return null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async setInRedis(key, value, ttl = 300) {
    if (!this.redisClient) return false;
    
    try {
      await this.redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async deleteFromRedis(key) {
    if (!this.redisClient) return false;
    
    try {
      await this.redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  // Combined cache operations
  async get(key, useRedis = false) {
    // Try memory cache first
    let value = await this.getFromCache(key);
    
    if (value === null && useRedis) {
      // Try Redis cache
      value = await this.getFromRedis(key);
      
      // If found in Redis, also store in memory cache
      if (value !== null) {
        await this.setInCache(key, value, 60); // 1 minute in memory
      }
    }
    
    return value;
  }

  async set(key, value, ttl = 300, useRedis = false) {
    // Set in memory cache
    await this.setInCache(key, value, ttl);
    
    // Set in Redis if enabled
    if (useRedis) {
      await this.setInRedis(key, value, ttl);
    }
  }

  async delete(key, useRedis = false) {
    await this.deleteFromCache(key);
    
    if (useRedis) {
      await this.deleteFromRedis(key);
    }
  }

  // Cache middleware
  cacheMiddleware(ttl = 300, useRedis = false) {
    return async (req, res, next) => {
      const key = `cache:${req.method}:${req.originalUrl}`;
      
      try {
        const cachedResponse = await this.get(key, useRedis);
        
        if (cachedResponse) {
          return res.json(cachedResponse);
        }
        
        // Store original send method
        const originalSend = res.json;
        
        // Override send method to cache response
        res.json = function(data) {
          this.set(key, data, ttl, useRedis);
          return originalSend.call(this, data);
        };
        
        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    };
  }

  // Response compression middleware
  compressionMiddleware() {
    return compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      }
    });
  }

  // Response time monitoring middleware
  responseTimeMiddleware() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        this.metrics.responseTimes.push({
          url: req.originalUrl,
          method: req.method,
          statusCode: res.statusCode,
          duration,
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 1000 response times
        if (this.metrics.responseTimes.length > 1000) {
          this.metrics.responseTimes = this.metrics.responseTimes.slice(-1000);
        }
      });
      
      next();
    };
  }

  // Memory usage monitoring
  startMonitoring() {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 memory readings
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-100);
      }
    }, 30000); // Every 30 seconds
  }

  // Get performance metrics
  getMetrics() {
    const responseTimes = this.metrics.responseTimes;
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, rt) => sum + rt.duration, 0) / responseTimes.length 
      : 0;
    
    const memoryUsage = this.metrics.memoryUsage;
    const currentMemory = memoryUsage.length > 0 ? memoryUsage[memoryUsage.length - 1] : null;
    
    return {
      cache: {
        hits: this.metrics.cacheHits,
        misses: this.metrics.cacheMisses,
        hitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100
      },
      performance: {
        averageResponseTime: avgResponseTime,
        totalRequests: responseTimes.length,
        memoryUsage: currentMemory,
        cacheSize: this.memoryCache.keys().length
      },
      redis: {
        connected: this.redisClient ? this.redisClient.status === 'ready' : false
      }
    };
  }

  // Clear all caches
  async clearAllCaches() {
    try {
      this.memoryCache.flushAll();
      
      if (this.redisClient) {
        await this.redisClient.flushall();
      }
      
      console.log('All caches cleared');
      return true;
    } catch (error) {
      console.error('Error clearing caches:', error);
      return false;
    }
  }

  // Health check
  async healthCheck() {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cache: {
        memory: this.memoryCache.keys().length,
        redis: this.redisClient ? this.redisClient.status === 'ready' : false
      }
    };

    // Check if memory usage is too high
    const memUsage = process.memoryUsage();
    if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
      health.status = 'warning';
      health.warnings = ['High memory usage detected'];
    }

    return health;
  }
}

// Create singleton instance
const performanceService = new PerformanceService();

module.exports = performanceService;
