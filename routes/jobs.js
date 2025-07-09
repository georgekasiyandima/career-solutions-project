const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     description: Retrieve a list of all available jobs with optional filtering and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of jobs per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, filled]
 *         description: Filter by job status
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by job location
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in job title, description, or requirements
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
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
 *                     $ref: '#/components/schemas/Job'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     pages:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, location, company, search } = req.query;

    // Mock data - replace with database query
    let jobs = [
      {
        id: 1,
        title: "Software Engineer",
        company: "Tech Corp",
        location: "New York, NY",
        description: "We are looking for a skilled software engineer...",
        requirements: "5+ years experience, React, Node.js",
        salary_range: "$80,000 - $120,000",
        status: "active",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: "Data Scientist",
        company: "Data Inc",
        location: "San Francisco, CA",
        description: "Join our data science team...",
        requirements: "PhD in Statistics, Python, ML",
        salary_range: "$100,000 - $150,000",
        status: "active",
        created_at: new Date().toISOString()
      }
    ];

    // Apply filters
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }
    if (location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (company) {
      jobs = jobs.filter(job => job.company.toLowerCase().includes(company.toLowerCase()));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.requirements.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedJobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: jobs.length,
        pages: Math.ceil(jobs.length / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch jobs"
    });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     description: Retrieve a specific job by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Job not found
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Mock data - replace with database query
    const job = {
      id: parseInt(id),
      title: "Software Engineer",
      company: "Tech Corp",
      location: "New York, NY",
      description: "We are looking for a skilled software engineer...",
      requirements: "5+ years experience, React, Node.js",
      salary_range: "$80,000 - $120,000",
      status: "active",
      created_at: new Date().toISOString()
    };

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found"
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch job"
    });
  }
});

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create new job
 *     tags: [Jobs]
 *     description: Create a new job posting (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - company
 *               - location
 *               - description
 *               - requirements
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *                 example: Senior Software Engineer
 *               company:
 *                 type: string
 *                 description: Company name
 *                 example: Tech Corp
 *               location:
 *                 type: string
 *                 description: Job location
 *                 example: New York, NY
 *               description:
 *                 type: string
 *                 description: Job description
 *                 example: We are looking for a senior software engineer...
 *               requirements:
 *                 type: string
 *                 description: Job requirements
 *                 example: 7+ years experience, React, Node.js, AWS
 *               salary_range:
 *                 type: string
 *                 description: Salary range
 *                 example: $100,000 - $150,000
 *               status:
 *                 type: string
 *                 enum: [active, inactive, filled]
 *                 default: active
 *                 description: Job status
 *     responses:
 *       201:
 *         description: Job created successfully
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
 *                   example: Job created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/", authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary_range, status = 'active' } = req.body;

    // Validate required fields
    if (!title || !company || !location || !description || !requirements) {
      return res.status(400).json({
        success: false,
        error: "Title, company, location, description, and requirements are required"
      });
    }

    // Mock job creation - replace with database insert
    const newJob = {
      id: Date.now(),
      title,
      company,
      location,
      description,
      requirements,
      salary_range,
      status,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create job"
    });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update job
 *     tags: [Jobs]
 *     description: Update an existing job posting (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *               company:
 *                 type: string
 *                 description: Company name
 *               location:
 *                 type: string
 *                 description: Job location
 *               description:
 *                 type: string
 *                 description: Job description
 *               requirements:
 *                 type: string
 *                 description: Job requirements
 *               salary_range:
 *                 type: string
 *                 description: Salary range
 *               status:
 *                 type: string
 *                 enum: [active, inactive, filled]
 *                 description: Job status
 *     responses:
 *       200:
 *         description: Job updated successfully
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
 *                   example: Job updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put("/:id", authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Mock job update - replace with database update
    const updatedJob = {
      id: parseInt(id),
      ...updateData,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update job"
    });
  }
});

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     tags: [Jobs]
 *     description: Delete a job posting (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
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
 *                   example: Job deleted successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id", authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Mock job deletion - replace with database delete
    res.json({
      success: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete job"
    });
  }
});

/**
 * @swagger
 * /api/jobs/featured:
 *   get:
 *     summary: Get featured jobs
 *     tags: [Jobs]
 *     description: Retrieve a list of featured/promoted jobs
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 5
 *         description: Number of featured jobs to return
 *     responses:
 *       200:
 *         description: Featured jobs retrieved successfully
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
 *                     $ref: '#/components/schemas/Job'
 */
router.get("/featured", async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Mock featured jobs - replace with database query
    const featuredJobs = [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "New York, NY",
        description: "We are looking for a senior software engineer...",
        requirements: "7+ years experience, React, Node.js",
        salary_range: "$120,000 - $180,000",
        status: "active",
        created_at: new Date().toISOString()
      }
    ].slice(0, parseInt(limit));

    res.json({
      success: true,
      data: featuredJobs
    });
  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured jobs"
    });
  }
});

/**
 * @swagger
 * /api/jobs/stats:
 *   get:
 *     summary: Get job statistics
 *     tags: [Jobs]
 *     description: Retrieve job statistics and analytics (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job statistics retrieved successfully
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
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     active:
 *                       type: integer
 *                       example: 120
 *                     filled:
 *                       type: integer
 *                       example: 25
 *                     inactive:
 *                       type: integer
 *                       example: 5
 *                     topCompanies:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           company:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     topLocations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           location:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/stats", authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    // Mock statistics - replace with database queries
    const stats = {
      total: 150,
      active: 120,
      filled: 25,
      inactive: 5,
      topCompanies: [
        { company: "Tech Corp", count: 15 },
        { company: "Data Inc", count: 12 },
        { company: "Startup XYZ", count: 8 }
      ],
      topLocations: [
        { location: "New York, NY", count: 25 },
        { location: "San Francisco, CA", count: 20 },
        { location: "Austin, TX", count: 15 }
      ]
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching job stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch job statistics"
    });
  }
});

module.exports = router; 