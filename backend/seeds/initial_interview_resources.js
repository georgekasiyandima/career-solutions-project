exports.seed = function(knex) {
  return knex('interview_resources').del()
    .then(function () {
      return knex('interview_resources').insert([
        {
          title: 'Master the STAR Method: Behavioral Interview Guide',
          type: 'document',
          category: 'interviews',
          tags: 'interview,behavioral,star,method',
          content: 'Learn how to structure your responses using the STAR method (Situation, Task, Action, Result) to ace behavioral interview questions. This comprehensive guide includes examples, practice questions, and tips for crafting compelling stories.',
          is_published: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Cruise Ship Interview Preparation: Complete Guide',
          type: 'video',
          category: 'cruise',
          tags: 'cruise,interview,preparation,maritime',
          content: 'Everything you need to know about cruise ship interviews. This video covers common questions, what to wear, how to present yourself, and what cruise lines are looking for in candidates.',
          is_published: true,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Resume Writing Masterclass: From Good to Great',
          type: 'document',
          category: 'resume',
          tags: 'resume,writing,cv,application',
          content: 'Transform your resume from good to great with our comprehensive writing guide. Learn how to quantify achievements, use action verbs, and create a compelling professional summary that gets you noticed.',
          is_published: true,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Visa Application Process: Step-by-Step Guide',
          type: 'document',
          category: 'visa',
          tags: 'visa,application,immigration,documentation',
          content: 'Complete guide to visa applications for various countries. Includes document requirements, application timelines, common mistakes to avoid, and tips for successful approval.',
          is_published: true,
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Cultural Preparation for International Jobs',
          type: 'video',
          category: 'cultural',
          tags: 'culture,international,adaptation,workplace',
          content: 'Prepare for working in different cultures with this comprehensive guide. Learn about workplace etiquette, communication styles, and cultural norms in various countries.',
          is_published: true,
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Salary Negotiation Strategies',
          type: 'document',
          category: 'negotiation',
          tags: 'salary,negotiation,compensation,benefits',
          content: 'Master the art of salary negotiation with proven strategies and techniques. Learn how to research market rates, present your value, and negotiate benefits beyond just salary.',
          is_published: true,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'LinkedIn Profile Optimization',
          type: 'video',
          category: 'networking',
          tags: 'linkedin,networking,profile,optimization',
          content: 'Learn how to create a compelling LinkedIn profile that attracts recruiters and networking opportunities. Includes tips for headlines, summaries, and content strategy.',
          is_published: true,
          created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Job Search Strategy: Finding Opportunities Abroad',
          type: 'document',
          category: 'job-search',
          tags: 'job-search,international,strategy,opportunities',
          content: 'Comprehensive guide to finding international job opportunities. Learn about job boards, networking strategies, and how to identify companies that sponsor international candidates.',
          is_published: true,
          created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Mock Interview Practice Sessions',
          type: 'video',
          category: 'interviews',
          tags: 'mock-interview,practice,feedback,preparation',
          content: 'Practice your interview skills with our mock interview sessions. Includes common questions, feedback on responses, and tips for improvement.',
          is_published: true,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Cover Letter Writing Guide',
          type: 'document',
          category: 'resume',
          tags: 'cover-letter,writing,application,personalization',
          content: 'Learn how to write compelling cover letters that complement your resume and increase your chances of getting interviews. Includes templates and examples.',
          is_published: true,
          created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Reference Letter Templates',
          type: 'document',
          category: 'references',
          tags: 'references,letters,templates,recommendations',
          content: 'Professional reference letter templates for various industries and positions. Learn what makes a strong reference letter and how to request one effectively.',
          is_published: true,
          created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Follow-up Email Templates',
          type: 'document',
          category: 'communication',
          tags: 'follow-up,email,templates,networking',
          content: 'Professional follow-up email templates for after interviews, networking events, and job applications. Learn the right timing and tone for effective follow-up communication.',
          is_published: true,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    });
}; 