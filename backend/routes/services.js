const express = require('express');
const router = express.Router();

const servicesData = [
  {
    id: 1,
    title: 'Resume Creation',
    icon: 'FaFileAlt',
    description: 'Professional resume crafting to make you stand out',
    packages: [
      {
        name: 'Resume Only',
        price: 'R350',
        description: 'Get a professionally crafted resume tailored to your career goals.',
        features: ['Customized resume creation', 'ATS Compliant Resume', '3 rounds of revisions'],
        popular: false
      },
      {
        name: 'Full Comprehensive Package',
        price: 'R1000',
        description: 'Complete job application support package for maximum success.',
        features: [
          'Customized resume creation',
          'Professional email guidance',
          'Job website navigation tips',
          'Hiring company contacts',
          'Interview preparation',
          'Ongoing application support'
        ],
        popular: true
      }
    ],
    benefits: '90% of clients reported increased interview callbacks within 30 days',
    process: [
      'Schedule consultation with career expert',
      'Provide work history and career goals',
      'Receive tailored resume within 3 days',
      'Collaborate on up to three revisions'
    ]
  },
  {
    id: 2,
    title: 'Cover Letter Creation',
    icon: 'FaClipboardList',
    description: 'Tailored cover letters that complement your resume',
    packages: [
      {
        name: 'Cover Letter Creation',
        price: 'R250',
        description: 'A tailored cover letter to match your resume and experience.',
        features: ['Personalized content', 'Industry-specific language', '2 rounds of revisions'],
        popular: false
      }
    ],
    benefits: '70% increase in application responses with our cover letters',
    process: [
      'Submit resume and job target',
      'Receive custom draft within 2 days',
      'Review and request revisions'
    ]
  },
  {
    id: 3,
    title: 'Visa Applications',
    icon: 'FaCertificate',
    description: 'Expert guidance for international visa applications',
    packages: [
      {
        name: 'Visa Application Assistance',
        price: 'R1000',
        description: 'Professional assistance with your visa application process.',
        features: [
          'Step-by-step guidance',
          'Documentation support',
          'Consultation session',
          'USA C1/D, Schengen, Irish visas'
        ],
        popular: false
      }
    ],
    benefits: '95% success rate in visa applications',
    process: [
      'Book consultation for visa needs',
      'Submit documents for review',
      'Receive personalized support'
    ]
  },
  {
    id: 4,
    title: 'Cruise Ship Jobs',
    icon: 'FaAnchor',
    description: 'Complete application management for cruise ship positions',
    packages: [
      {
        name: 'Cruise Ship Application Package',
        price: 'R5000',
        description: 'We handle your entire cruise ship job application process.',
        features: [
          'Resume creation (if needed)',
          'Cover letter (if needed)',
          'Application submission',
          'Interview coaching',
          'R2500 upfront, R2500 after interview'
        ],
        popular: true
      }
    ],
    benefits: 'Over 80% of clients secured interviews',
    process: [
      'Pay R2500 upfront fee',
      'Receive resume/cover letter support',
      'We submit applications',
      'Pay remaining R2500 after interview'
    ]
  },
  {
    id: 5,
    title: 'Overseas Land Jobs',
    icon: 'FaPlane',
    description: 'International job placement and application support',
    packages: [
      {
        name: 'Overseas Land Jobs Package',
        price: 'R2500 + $2000',
        description: 'Complete overseas job application management.',
        features: [
          'Resume creation (R500)',
          'Reference letters (R1000)',
          'Resume submission to recruiters',
          'Interview preparation',
          'R2500 upfront, $2000 after interview'
        ],
        popular: false
      }
    ],
    benefits: '70% of clients secured job offers',
    process: [
      'Pay R2500 upfront',
      'Receive reference letter support',
      'We submit to recruiters',
      'Pay $2000 after interview'
    ]
  },
  {
    id: 6,
    title: 'CTRAC Application',
    icon: 'FaSearch',
    description: 'Royal Caribbean CTRAC online application assistance',
    packages: [
      {
        name: 'CTRAC Online Application',
        price: 'R350',
        description: 'Assistance for completing Royal Caribbean CTRAC applications.',
        features: [
          'Hands-on application support',
          'Ideal for non-tech-savvy users',
          'Complete form submission',
          'Technical guidance'
        ],
        popular: false
      }
    ],
    benefits: '100% successful application submissions',
    process: [
      'Schedule assistance session',
      'Provide application details',
      'We complete CTRAC form'
    ]
  },
  {
    id: 7,
    title: 'Interview Preparation',
    icon: 'FaUserTie',
    description: 'Comprehensive interview coaching and preparation',
    packages: [
      {
        name: 'Interview Coaching Session',
        price: 'R500',
        description: 'One-on-one interview preparation and coaching.',
        features: [
          'Mock interview sessions',
          'Common questions practice',
          'Body language guidance',
          'Follow-up strategies'
        ],
        popular: false
      }
    ],
    benefits: '85% of clients feel more confident after coaching',
    process: [
      'Schedule coaching session',
      'Practice mock interviews',
      'Receive personalized feedback',
      'Get follow-up strategies'
    ]
  },
  {
    id: 8,
    title: 'Career Guidance',
    icon: 'FaGraduationCap',
    description: 'Professional career planning and guidance services',
    packages: [
      {
        name: 'Career Planning Session',
        price: 'R800',
        description: 'Comprehensive career guidance and planning.',
        features: [
          'Career assessment',
          'Goal setting',
          'Industry insights',
          'Action plan creation'
        ],
        popular: false
      }
    ],
    benefits: '90% of clients report clearer career direction',
    process: [
      'Complete career assessment',
      'Discuss goals and aspirations',
      'Receive personalized plan',
      'Follow-up support'
    ]
  }
];

// GET /api/services
router.get('/', (req, res) => {
  res.status(200).json(servicesData);
});

module.exports = router; 