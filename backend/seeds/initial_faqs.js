exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('faqs').del()
    .then(function () {
      // Inserts seed entries
      return knex('faqs').insert([
        {
          question: "What services does Career Solutions offer",
          answer: "We offer comprehensive career services including professional resume creation, cover letter writing, visa application assistance, cruise ship job applications, overseas land job placements, and CTRAC online application support. Each service is tailored to maximize your chances of success in the international job market."
        },
        {
          question: "How much do your services cost",
          answer: "Our pricing varies by service: Resume Creation starts at R350, Cover Letters at R250, Visa Applications at R1000, Cruise Ship packages at R5000, Overseas Land Jobs at R2500 + $2000, and CTRAC applications at R350. We offer flexible payment plans for larger packages."
        },
        {
          question: "What is your success rate for job placements",
          answer: "We maintain an impressive 80%+ interview success rate for cruise ship jobs, 70% job placement success for overseas positions, and 95% visa application success rate. Our track record speaks to our commitment to quality and personalized service."
        },
        {
          question: "How long does the application process take",
          answer: "Timelines vary by service: Resume creation takes 3-5 days, visa applications 2-4 weeks, cruise ship applications 2-6 weeks, and overseas job placements 1-3 months. We provide regular updates throughout the process."
        },
        {
          question: "Do you guarantee job placement",
          answer: "While we cannot guarantee job placement due to factors beyond our control, we guarantee our service quality. We provide comprehensive support, professional documentation, and ongoing assistance to maximize your chances of success."
        },
        {
          question: "What makes your resumes stand out",
          answer: "Our resumes are ATS-compliant, professionally crafted, and tailored to specific industries. We use industry-specific keywords, highlight relevant achievements, and ensure your experience is presented in the most compelling way possible."
        },
        {
          question: "Can you help with visa applications for any country",
          answer: "We specialize in USA C1/D visas, Schengen visas, Irish visas, and other common work visas. Our team stays updated on visa requirements and provides step-by-step guidance to ensure successful applications."
        },
        {
          question: "What is the payment structure for cruise ship jobs",
          answer: "For cruise ship applications, we require R2500 upfront and R2500 after you receive an interview. This structure ensures we're invested in your success and only get paid when you achieve results."
        },
        {
          question: "Do you provide interview coaching",
          answer: "Yes! Interview coaching is included in our comprehensive packages. We provide mock interviews, common question preparation, industry-specific guidance, and confidence-building techniques to help you succeed."
        },
        {
          question: "What if I'm not tech-savvy for online applications",
          answer: "No problem! Our CTRAC application service is specifically designed for those who need hands-on assistance with online applications. We'll guide you through every step or complete the application for you."
        },
        {
          question: "How do you stay updated on job market trends",
          answer: "We maintain strong relationships with international recruiters, regularly monitor job market trends, and stay connected with industry professionals. This ensures our services remain relevant and effective."
        },
        {
          question: "Can you help with reference letters",
          answer: "Absolutely! Reference letters are crucial for overseas applications. We help craft professional, compelling reference letters that highlight your strengths and suitability for international positions."
        },
        {
          question: "What documents do I need to get started",
          answer: "Basic requirements include your current resume, work history, educational background, and career goals. For specific services, we'll provide a detailed checklist during our initial consultation."
        },
        {
          question: "Do you offer ongoing support after placement",
          answer: "Yes, we provide post-placement support including relocation guidance, cultural adaptation tips, and ongoing career advice. We're committed to your long-term success."
        },
        {
          question: "How do I know which service is right for me",
          answer: "We offer a free consultation to assess your needs and recommend the best service package. Our guided purchase flow also helps you understand each option and make an informed decision."
        },
        {
          question: "What makes Career Solutions different from other agencies",
          answer: "Our personal approach, proven track record, transparent pricing, and commitment to service excellence set us apart. We treat every client like family and are genuinely invested in your success."
        },
        {
          question: "Can you help with career changes or industry transitions",
          answer: "Yes! We specialize in helping professionals transition to new industries or roles. Our resume and interview services are designed to highlight transferable skills and position you effectively for new opportunities."
        },
        {
          question: "What if I'm not satisfied with the service",
          answer: "We offer revisions and adjustments to ensure your complete satisfaction. Our goal is your success, and we work closely with you to achieve the best possible results."
        },
        {
          question: "How do I get started with Career Solutions",
          answer: "Simply contact us through our enquiry form, schedule a consultation, or try our guided purchase flow. We'll assess your needs and create a personalized plan to help you achieve your career goals."
        },
        {
          question: "Do you work with clients from all backgrounds",
          answer: "Absolutely! We believe everyone deserves the best tools and support to succeed. We work with clients from all backgrounds and experience levels, providing personalized service to maximize your chances of success."
        }
      ]);
    });
}; 