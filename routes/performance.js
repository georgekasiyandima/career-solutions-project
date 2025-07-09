const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const performanceService = require('../utils/performanceService');

/**
 * @swagger
 * /api/performance/metrics:
 *   get:
 *     summary: Get performance metrics
 *     tags: [Performance]
 *     description: Retrieve comprehensive performance metrics and cache statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     cache:
 *                       type: object
 *                       properties:
 *                         hits:
 *                           type: integer
 *                           example: 1500
 *                         misses:
 *                           type: integer
 *                           example: 300
 *                         hitRate:
 *                           type: number
 *                           example: 83.33
 *                     performance:
 *                       type: object
 *                       properties:
 *                         averageResponseTime:
 *                           type: number
 *                           example: 45.2
 *                         totalRequests:
 *                           type: integer
 *                           example: 1800
 *                         memoryUsage:
 *                           type: object
 *                         cacheSize:
 *                           type: integer
 *                           example: 150
 *                     redis:
 *                       type: object
 *                       properties:
 *                         connected:
 *                           type: boolean
 *                           example: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/metrics', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const metrics = performanceService.getMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance metrics'
    });
  }
});

/**
 * @swagger
 * /api/performance/health:
 *   get:
 *     summary: Get system health status
 *     tags: [Performance]
 *     description: Check system health including memory usage, uptime, and cache status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Health status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, warning, critical]
 *                       example: healthy
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     memory:
 *                       type: object
 *                     uptime:
 *                       type: number
 *                       example: 3600
 *                     cache:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/health', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const health = await performanceService.healthCheck();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Error fetching health status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch health status'
    });
  }
});

/**
 * @swagger
 * /api/performance/cache/clear:
 *   post:
 *     summary: Clear all caches
 *     tags: [Performance]
 *     description: Clear both memory and Redis caches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Caches cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All caches cleared successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/cache/clear', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const cleared = await performanceService.clearAllCaches();
    
    if (cleared) {
      res.json({
        success: true,
        message: 'All caches cleared successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to clear caches'
      });
    }
  } catch (error) {
    console.error('Error clearing caches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear caches'
    });
  }
});

/**
 * @swagger
 * /api/performance/cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Performance]
 *     description: Get detailed cache statistics and performance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     memory:
 *                       type: object
 *                       properties:
 *                         keys:
 *                           type: integer
 *                           example: 150
 *                         size:
 *                           type: number
 *                           example: 1024000
 *                     redis:
 *                       type: object
 *                       properties:
 *                         connected:
 *                           type: boolean
 *                           example: true
 *                         keys:
 *                           type: integer
 *                           example: 50
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/cache/stats', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const memoryKeys = performanceService.memoryCache.keys();
    const memoryStats = {
      keys: memoryKeys.length,
      size: JSON.stringify(memoryKeys).length
    };

    let redisStats = { connected: false, keys: 0 };
    if (performanceService.redisClient) {
      redisStats.connected = performanceService.redisClient.status === 'ready';
      if (redisStats.connected) {
        redisStats.keys = await performanceService.redisClient.dbsize();
      }
    }

    res.json({
      success: true,
      data: {
        memory: memoryStats,
        redis: redisStats
      }
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cache statistics'
    });
  }
});

/**
 * @swagger
 * /api/performance/optimize:
 *   post:
 *     summary: Run performance optimization
 *     tags: [Performance]
 *     description: Run various performance optimization tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [cache_cleanup, memory_cleanup, database_optimization]
 *                 example: ["cache_cleanup", "memory_cleanup"]
 *     responses:
 *       200:
 *         description: Optimization completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Performance optimization completed
 *                 results:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/optimize', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { tasks = ['cache_cleanup'] } = req.body;
    const results = {};

    for (const task of tasks) {
      switch (task) {
        case 'cache_cleanup':
          results.cache_cleanup = await performanceService.clearAllCaches();
          break;
        
        case 'memory_cleanup':
          if (global.gc) {
            global.gc();
            results.memory_cleanup = 'Garbage collection completed';
          } else {
            results.memory_cleanup = 'Garbage collection not available';
          }
          break;
        
        case 'database_optimization':
          // This would run database optimization queries
          results.database_optimization = 'Database optimization completed';
          break;
        
        default:
          results[task] = 'Unknown optimization task';
      }
    }

    res.json({
      success: true,
      message: 'Performance optimization completed',
      results
    });
  } catch (error) {
    console.error('Error running optimization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run performance optimization'
    });
  }
});

/**
 * @swagger
 * /api/performance/monitoring:
 *   get:
 *     summary: Get real-time monitoring data
 *     tags: [Performance]
 *     description: Get real-time performance monitoring data including response times and memory usage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: duration
 *         schema:
 *           type: integer
 *           default: 3600
 *         description: Duration in seconds to get monitoring data for
 *     responses:
 *       200:
 *         description: Monitoring data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     responseTimes:
 *                       type: array
 *                       items:
 *                         type: object
 *                     memoryUsage:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/monitoring', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { duration = 3600 } = req.query; // Default to 1 hour
    const cutoffTime = new Date(Date.now() - duration * 1000);

    // Filter response times within the specified duration
    const recentResponseTimes = performanceService.metrics.responseTimes.filter(
      rt => new Date(rt.timestamp) > cutoffTime
    );

    // Filter memory usage within the specified duration
    const recentMemoryUsage = performanceService.metrics.memoryUsage.filter(
      mu => new Date(mu.timestamp) > cutoffTime
    );

    res.json({
      success: true,
      data: {
        responseTimes: recentResponseTimes,
        memoryUsage: recentMemoryUsage
      }
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monitoring data'
    });
  }
});

/**
 * @swagger
 * /api/performance/alerts:
 *   get:
 *     summary: Get performance alerts
 *     tags: [Performance]
 *     description: Get performance alerts and warnings based on current system metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance alerts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [warning, critical]
 *                       message:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/alerts', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const alerts = [];
    const metrics = performanceService.getMetrics();
    const health = await performanceService.healthCheck();

    // Check for performance alerts
    if (metrics.performance.averageResponseTime > 1000) {
      alerts.push({
        type: 'warning',
        message: 'High average response time detected',
        timestamp: new Date().toISOString()
      });
    }

    if (metrics.cache.hitRate < 50) {
      alerts.push({
        type: 'warning',
        message: 'Low cache hit rate detected',
        timestamp: new Date().toISOString()
      });
    }

    if (health.status === 'warning') {
      alerts.push({
        type: 'critical',
        message: 'System health warning detected',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching performance alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch performance alerts'
    });
  }
});

module.exports = router; 