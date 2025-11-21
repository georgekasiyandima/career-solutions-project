import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.time) newErrors.time = 'Please select a time';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitStatus('submitting');
    console.log('Submitting booking form data:', formData);

    try {
      const response = await fetch(`${API_URL}/api/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit booking');
      }
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
        message: ''
      });
      setErrors({});
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setSubmitStatus('error');
      console.error('Booking error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brandDarkTeal to-[#2E7D32] py-12 px-4 pt-16" style={{ background: 'linear-gradient(to bottom right, #1A3C34, #2E7D32)' }}>
      <div className="container mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold text-white font-poppins mb-4">Book a Consultation</h2>
        <p className="text-white font-poppins mb-8">
          Schedule a personalized session to advance your career with Career Solutions.
        </p>
        {submitStatus === 'success' && (
          <p className="bg-green-100 text-green-800 p-4 rounded-md mb-6 font-poppins">
            Booking submitted successfully! We'll get back to you soon.
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="bg-red-100 text-red-800 p-4 rounded-md mb-6 font-poppins">
            An error occurred. Please try again.
          </p>
        )}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#1A3C34] to-[#2E7D32] p-6 rounded-lg shadow-soft text-white" style={{ background: 'linear-gradient(to bottom right, #1A3C34, #2E7D32)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="firstName" className="block text-white font-poppins mb-2">
                First Name <span className="text-brandGreen-default">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.firstName ? 'true' : 'false'}
              />
              {errors.firstName && <span className="text-red-200 text-sm font-poppins">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="block text-white font-poppins mb-2">
                Last Name <span className="text-brandGreen-default">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.lastName ? 'true' : 'false'}
              />
              {errors.lastName && <span className="text-red-200 text-sm font-poppins">{errors.lastName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="block text-white font-poppins mb-2">
                Email Address <span className="text-brandGreen-default">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && <span className="text-red-200 text-sm font-poppins">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="block text-white font-poppins mb-2">
                Phone Number <span className="text-brandGreen-default">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
              {errors.phone && <span className="text-red-200 text-sm font-poppins">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="service" className="block text-white font-poppins mb-2">
                Service Type <span className="text-brandGreen-default">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.service ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.service ? 'true' : 'false'}
              >
                <option value="">Select a service</option>
                <option value="Career Consultation">Career Consultation</option>
                <option value="Resume Review">Resume Review</option>
                <option value="Visa Application Assistance">Visa Application Assistance</option>
                <option value="Cruise Ship Job Guidance">Cruise Ship Job Guidance</option>
                <option value="Overseas Land Job Guidance">Overseas Land Job Guidance</option>
              </select>
              {errors.service && <span className="text-red-200 text-sm font-poppins">{errors.service}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="date" className="block text-white font-poppins mb-2">
                Preferred Date <span className="text-brandGreen-default">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.date ? 'true' : 'false'}
              />
              {errors.date && <span className="text-red-200 text-sm font-poppins">{errors.date}</span>}
            </div>
            <div className="form-group md:col-span-2">
              <label htmlFor="time" className="block text-white font-poppins mb-2">
                Preferred Time <span className="text-brandGreen-default">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800`}
                aria-invalid={errors.time ? 'true' : 'false'}
              />
              {errors.time && <span className="text-red-200 text-sm font-poppins">{errors.time}</span>}
            </div>
            <div className="form-group md:col-span-2">
              <label htmlFor="message" className="block text-white font-poppins mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="E.g., specific needs or questions"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandDarkTeal font-poppins bg-white text-gray-800"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-brandGreen-default text-white px-6 py-3 rounded-md hover:bg-brandGreen-hover transition-colors font-poppins disabled:opacity-50"
            disabled={submitStatus === 'submitting'}
          >
            {submitStatus === 'submitting' ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                Submitting...
              </>
            ) : (
              'Book Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;