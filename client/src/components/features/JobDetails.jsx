import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaClock, FaBriefcase, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import trackEvent from '../../services/trackEvent';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        if (!data) {
          throw new Error('Job not found');
        }
        setJob(data);
        trackEvent('job_view', { job_id: id, title: data.title });
      } catch (err) {
        setError('An error occurred while fetching job details. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, API_URL]);

  const getJobTypeColor = (jobType) => {
    switch (jobType) {
      case 'Full-time':
        return 'bg-green-500';
      case 'Part-time':
        return 'bg-blue-500';
      case 'Contract':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Cruise Jobs':
        return 'bg-blue-500';
      case 'Land Jobs':
        return 'bg-green-500';
      case 'IT':
        return 'bg-purple-500';
      case 'Marketing':
        return 'bg-pink-500';
      case 'Data Science':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brandDarkTeal to-brandGreen-default flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white font-poppins mt-4">Loading job details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brandDarkTeal to-brandGreen-default flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8">
            <p className="text-red-200 font-poppins">{error}</p>
            <Link 
              to="/jobs"
              className="inline-block mt-4 bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors font-poppins"
            >
              Back to Jobs
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brandDarkTeal to-brandGreen-default flex items-center justify-center px-4">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <FaBriefcase className="text-6xl text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-poppins mb-2">Job not found</h3>
            <p className="text-white/80 font-poppins mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/jobs"
              className="inline-block bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors font-poppins"
            >
              Back to Jobs
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brandDarkTeal to-brandGreen-default py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Back Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/jobs"
            className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-poppins"
          >
            <FaArrowLeft />
            <span>Back to Jobs</span>
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div 
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brandGreen-default to-brandDarkTeal rounded-2xl flex items-center justify-center">
                <FaBriefcase className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-poppins mb-2">
                  {job.title}
                </h1>
                <p className="text-white/80 font-poppins text-lg">{job.company}</p>
              </div>
            </div>
          </div>

          {/* Job Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`${getJobTypeColor(job.job_type)} text-white px-4 py-2 rounded-full text-sm font-poppins font-semibold`}>
              {job.job_type}
            </span>
            <span className={`${getCategoryColor(job.category)} text-white px-4 py-2 rounded-full text-sm font-poppins font-semibold`}>
              {job.category}
            </span>
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-white/80 font-poppins">
                <FaBuilding className="mr-3 text-brandGreen-default text-lg" />
                <div>
                  <p className="font-semibold">Company</p>
                  <p>{job.company}</p>
                </div>
              </div>
              <div className="flex items-center text-white/80 font-poppins">
                <FaMapMarkerAlt className="mr-3 text-brandGreen-default text-lg" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{job.location}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-white/80 font-poppins">
                <FaClock className="mr-3 text-brandGreen-default text-lg" />
                <div>
                  <p className="font-semibold">Job Type</p>
                  <p>{job.job_type}</p>
                </div>
              </div>
              <div className="flex items-center text-white/80 font-poppins">
                <FaCalendarAlt className="mr-3 text-brandGreen-default text-lg" />
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{job.category}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div 
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white font-poppins mb-6">Job Description</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/90 font-poppins leading-relaxed text-lg whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-r from-brandDarkTeal to-brandGreen-default rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white font-poppins mb-4 text-center">
            Interested in this position?
          </h3>
          <p className="text-white/80 font-poppins text-center mb-8 max-w-2xl mx-auto">
            Get in touch with us to learn more about this opportunity and how we can help you secure this position.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/enquiry"
              className="bg-white text-brandDarkTeal px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-poppins font-semibold text-center flex items-center justify-center space-x-2"
            >
              <FaEnvelope />
              <span>Enquire About This Job</span>
            </Link>
            <Link 
              to="/booking"
              className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl hover:bg-white/20 transition-colors font-poppins font-semibold text-center flex items-center justify-center space-x-2"
            >
              <FaCalendarAlt />
              <span>Book a Consultation</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetails;