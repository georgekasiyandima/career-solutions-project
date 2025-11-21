import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-gradient-to-br from-brandDarkTeal to-[#4CAF50] p-6 rounded-lg shadow-soft max-w-lg w-full mx-4"
        style={{ background: 'linear-gradient(to bottom right, #1A3C34, #4CAF50)' }}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white font-poppins">{content.title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-brandGreen-default focus:outline-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="font-poppins">
          <h4 className="text-lg font-semibold text-white mb-2">What We Offer</h4>
          <p className="text-white mb-4">{content.details.description}</p>

          <h4 className="text-lg font-semibold text-white mb-2">Benefits</h4>
          <p className="text-white mb-4">{content.details.benefits}</p>

          <h4 className="text-lg font-semibold text-white mb-2">Our Process</h4>
          <ul className="list-disc pl-5 mb-4">
            {content.details.process.map((step, index) => (
              <li key={index} className="text-white">{step}</li>
            ))}
          </ul>

          {content.details.testimonial && (
            <>
              <h4 className="text-lg font-semibold text-white mb-2">What Our Clients Say</h4>
              <p className="italic text-white mb-4">
                "{content.details.testimonial.text}" — {content.details.testimonial.name}
              </p>
            </>
          )}
        </div>
        <div className="text-center">
          <a
            href="/booking"
            className="bg-white text-brandDarkTeal px-4 py-2 rounded-full hover:bg-gray-200 transition-colors font-poppins"
          >
            Book Now
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;