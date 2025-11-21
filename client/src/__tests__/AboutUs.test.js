import React from 'react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="py-12 px-4 pt-16">
      {/* Hero Section */}
      <section className="bg-brandDarkTeal text-brandWhite py-16 mb-12 rounded-lg shadow-deep">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
            THE STORY OF CAREER SOLUTIONS
          </h1>
          <p className="text-lg md:text-xl font-poppins max-w-2xl mx-auto">
            Discover how we came to be and what drives us to connect talent with opportunities in the cruise and overseas job market.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center font-poppins mb-12">
          Our Story
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-brandDarkTeal p-6 rounded-lg shadow-soft hover:shadow-[0_0_15px_rgba(26,60,52,0.5)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-gray-200 font-poppins mb-6">
              In the wake of COVID-19, George Kasiyandima and Getrude Bunga faced unprecedented challenges. George had enrolled in a Full Stack Web Development bootcamp in San Francisco, driven by a passion to build a better future. But as the pandemic’s effects lingered, financial hardships began to mount for their family, making it difficult to make ends meet.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="flex items-center">
                <img
                  src="/images/George.jpg"
                  alt="George Kasiyandima"
                  className="w-32 h-32 object-cover rounded-full mr-4"
                />
                <div>
                  <p className="text-xl font-semibold text-white font-poppins">George Kasiyandima</p>
                  <p className="text-gray-400 font-poppins">Co-Founder</p>
                  <div className="flex space-x-4 mt-2">
                    <a
                      href="https://linkedin.com/in/george-kasiyandima"
                      className="text-brandGreen-default hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="George Kasiyandima's LinkedIn"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a
                      href="https://twitter.com/george-kasiyandima"
                      className="text-brandGreen-default hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="George Kasiyandima's X"
                    >
                      <FaTwitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src="/images/Getty.jpg"
                  alt="Getrude Bunga"
                  className="w-32 h-32 object-cover rounded-full mr-4"
                />
                <div>
                  <p className="text-xl font-semibold text-white font-poppins">Getrude Bunga</p>
                  <p className="text-gray-400 font-poppins">Co-Founder</p>
                  <div className="flex space-x-4 mt-2">
                    <a
                      href="https://linkedin.com/in/getrude-bunga"
                      className="text-brandGreen-default hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Getrude Bunga's LinkedIn"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a
                      href="https://twitter.com/getrude-bunga"
                      className="text-brandGreen-default hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Getrude Bunga's X"
                    >
                      <FaTwitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-200 font-poppins mb-6">
              Amid these struggles, George and Getrude noticed a growing demand in the job market. Companies in the cruise and overseas industries were eager to hire new staff to meet the post-COVID business boom. They saw an opportunity to help potential candidates by curating compelling resumes, assisting with mock interviews, and providing the support needed to land these coveted roles. This vision gave birth to Getty—a platform dedicated to bridging the gap between talent and opportunity.
            </p>
            <p className="text-gray-200 font-poppins">
              During this time, George also completed his bootcamp, a testament to their resilience and determination against all odds. Since founding Career Solutions in 2021, George and Getrude have worked tirelessly to build a platform that empowers candidates to achieve their dreams, offering personalized support to navigate the competitive job market. Their mission is clear: to give small businesses and candidates a proper online presence, ensuring everyone has the chance to thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-brandDarkTeal text-brandWhite py-12 text-center">
        <div className="container mx-auto px-4">
          <p className="text-lg md:text-xl font-poppins max-w-2xl mx-auto mb-6">
            Having a little extra help in your career should be an affordable luxury for everyone who wants it. Extra help equals extra time to live your life doing exactly what you want to do. We believe that seamless support trumps last-minute, on-demand requests. We believe that everyone deserves to come home happy.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="/join"
              className="bg-brandGreen-default text-brandWhite px-6 py-3 rounded-md hover:bg-brandGreen-hover transition-colors font-poppins"
            >
              Join Our Talent Network
            </a>
            <a
              href="/opportunities"
              className="bg-brandGreen-default text-brandWhite px-6 py-3 rounded-md hover:bg-brandGreen-hover transition-colors font-poppins"
            >
              Explore Opportunities
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;