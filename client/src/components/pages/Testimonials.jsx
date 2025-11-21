import React, { useState, useEffect } from 'react';
import { getTestimonials } from '../../services/testimonialService';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="py-12 px-4 bg-brandLightGray">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-brandGray font-poppins mb-4">Our Wall of Love</h1>
          <p className="text-gray-600 font-poppins">Hear from our talented community members about their success with Career Solutions.</p>
        </div>
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-brandGray font-poppins mb-4 text-center">Success Story: Daniel’s Journey to Becoming a HGV Driver in Ireland</h2>
          <div className="relative w-full max-w-4xl mx-auto">
            <video
              className="w-full rounded-lg"
              poster="/images/thildah-poster.jpg"
              controls
              muted
              playsInline
              aria-label="Video testimonial from Thildah, a successful hire as a Deck Officer"
            >
              <source src="./Testimonials.mp4" type="video/mp4" />
              <track
                src="./Testimonials.mp4"
                kind="captions"
                srcLang="en"
                label="English Captions"
                default
              />
              <p>Your browser does not support the video tag. Read the transcript below:</p>
              <p>
                Daniel shares: "I was skeptical at first, but GB Career Solutions delivered. I’m now a Truck driver in Ireland, living my dream!"
              </p>
            </video>
          </div>
        </div>
        
        {loading && <p className="text-center">Loading testimonials...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-brandWhite p-4 rounded-lg shadow-soft">
                <p className="text-brandGray font-poppins mb-4 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name}, ${testimonial.role}`}
                    className="w-12 h-12 rounded-full mr-4"
                    loading="lazy"
                  />
                  <div>
                    <span className="block text-brandGray font-poppins">{testimonial.name}</span>
                    <span className="text-gray-600 font-poppins">{testimonial.role} at {testimonial.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;