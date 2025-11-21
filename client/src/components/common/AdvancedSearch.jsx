import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaBriefcase, FaFileAlt, FaRss, FaUsers, FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/constants';

const AdvancedSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    tables: ['jobs', 'content', 'feed_posts', 'interview_resources'],
    category: '',
    type: '',
    location: ''
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/suggestions`, {
        params: {
          q: query,
          table: 'jobs',
          field: 'title',
          limit: 5
        }
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  }, [query]);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]);

  const performSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          q: query,
          tables: filters.tables.join(','),
          limit: 20
        }
      });
      setSearchResults(response.data.results || {});
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    // Auto-search when suggestion is clicked
    setTimeout(() => performSearch(), 100);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults({});
    setSuggestions([]);
    setIsSearchOpen(false);
  };

  const getTableIcon = (table) => {
    switch (table) {
      case 'jobs':
        return <FaBriefcase className="text-blue-400" />;
      case 'content':
        return <FaFileAlt className="text-green-400" />;
      case 'feed_posts':
        return <FaRss className="text-purple-400" />;
      case 'interview_resources':
        return <FaGlobe className="text-yellow-400" />;
      case 'clients':
        return <FaUsers className="text-pink-400" />;
      default:
        return <FaSearch className="text-gray-400" />;
    }
  };

  const getTableName = (table) => {
    switch (table) {
      case 'jobs':
        return 'Jobs';
      case 'content':
        return 'Content';
      case 'feed_posts':
        return 'Feed Posts';
      case 'interview_resources':
        return 'Interview Resources';
      case 'clients':
        return 'Clients';
      default:
        return table;
    }
  };

  const SearchResultCard = ({ item, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200 cursor-pointer"
      onClick={() => {
        // Navigate to the appropriate page based on type
        switch (type) {
          case 'jobs':
            window.location.href = `/jobs/${item.id}`;
            break;
          case 'content':
            window.location.href = `/admin/content/${item.id}`;
            break;
          case 'feed_posts':
            window.location.href = `/admin/feed/${item.id}`;
            break;
          default:
            break;
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-white/10">
          {getTableIcon(type)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-poppins font-semibold text-sm mb-1 line-clamp-1">
            {item.title || item.name || item.company || 'Untitled'}
          </h4>
          <p className="text-white/70 font-poppins text-xs line-clamp-2">
            {item.description || item.content || item.body || 'No description available'}
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-white/50 font-poppins text-xs">
              {getTableName(type)}
            </span>
            {item.created_at && (
              <span className="text-white/50 font-poppins text-xs">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search jobs, content, posts..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 font-poppins focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`ml-2 p-3 rounded-xl transition-all duration-200 ${
              isFilterOpen
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/20'
            }`}
          >
            <FaFilter className="text-sm" />
          </button>
        </form>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {isSearchOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-50"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="flex items-center space-x-3">
                  <FaSearch className="text-white/50 text-sm" />
                  <span className="text-white font-poppins text-sm">{suggestion}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-50 p-4"
          >
            <h3 className="text-white font-poppins font-semibold mb-4">Search Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/70 font-poppins text-sm mb-2 block">Search in:</label>
                {['jobs', 'content', 'feed_posts', 'interview_resources', 'clients'].map((table) => (
                  <label key={table} className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={filters.tables.includes(table)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters(prev => ({
                            ...prev,
                            tables: [...prev.tables, table]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            tables: prev.tables.filter(t => t !== table)
                          }));
                        }
                      }}
                      className="rounded border-white/30 bg-white/10 text-blue-400 focus:ring-blue-400"
                    />
                    <span className="text-white font-poppins text-sm">{getTableName(table)}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-white/70 font-poppins text-sm mb-2 block">Category:</label>
                <input
                  type="text"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Filter by category"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div>
                <label className="text-white/70 font-poppins text-sm mb-2 block">Location:</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Filter by location"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {isSearchOpen && Object.keys(searchResults).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-poppins font-semibold">Search Results</h3>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white/70 hover:text-white transition-colors duration-200"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-white/60 font-poppins">Searching...</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(searchResults).map(([table, items]) => (
                    items.length > 0 && (
                      <div key={table}>
                        <h4 className="text-white/70 font-poppins text-sm mb-2 flex items-center space-x-2">
                          {getTableIcon(table)}
                          <span>{getTableName(table)} ({items.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {items.slice(0, 3).map((item, index) => (
                            <SearchResultCard key={index} item={item} type={table} />
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch; 