'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaRocket, 
  FaUpload, 
  FaPalette, 
  FaEye, 
  FaCheck, 
  FaSpinner, 
  FaGlobe,
  FaTrash,
  FaPlus,
  FaBolt,
  FaFire,
  FaUser,
  FaCoins,
  FaCreditCard,
  FaChevronRight,
  FaDownload,
  FaEdit,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaStar,
  FaHeart,
  FaShare,
  FaTimes,
  FaArrowRight,
  FaCalendar,
  FaFilter,
  FaSearch,
  FaLock,
  FaLockOpen,
  FaCog
} from 'react-icons/fa';
import CreatePortfolioModal from '@/components/AIPortfolioDashboard/CreatePortfolioModal';
import CreditRechargeModal from '@/components/editor/CreditRechargeModal ';
import useReduxStore from '@/hooks/useReduxStore';
import { setPopupConfig } from '@/redux/slices/messagePopSlice';
import { fetchPortfolioCreditInfo, getPortfolioCreditInfo } from '@/redux/slices/usageSlice';
import { deletePortfolio, fetchPortfolioStats, getUserPortfolios, selectPortfolioError, selectPortfolioLoading, selectPortfolios, selectPortfolioStats } from '@/redux/slices/portfolioSlice';
import PortfolioList from '@/components/AIPortfolioDashboard/PortfolioList';


// Main Dashboard Component
const AIPortfolioDashboard = () => {
  const dispatch = useDispatch();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const portfolioCreditInfo = useSelector(getPortfolioCreditInfo);
  const credits = portfolioCreditInfo?.remainingCredits || 0;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const stats = useSelector(selectPortfolioStats)
  const loading = useSelector(selectPortfolioLoading);
  const error= useSelector(selectPortfolioError);

  // Fetch portfolios on component mount
  useEffect(() => {
    dispatch(getUserPortfolios());
    dispatch(fetchPortfolioStats())
    dispatch(fetchPortfolioCreditInfo());
  }, []);


  const handleCreditPurchaseSuccess = () => {
    setShowCreditModal(false);
    // Refresh credits
    dispatch(fetchPortfolioCreditInfo());
    // Show success message
    dispatch(setPopupConfig({
      message: "Credits purchased successfully!",
      imageUrl: "/favicon_io/android-chrome-192x192.png",
      duration: 3000,
    }));
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <FaTimesCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={()=>dispatch(getUserPortfolios())}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AI Portfolio Generator</h1>
              <p className="text-gray-400 mt-1">Create stunning portfolios with AI</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2">
                <FaCoins className="text-yellow-400" />
                <span className="text-white font-medium">{credits}</span>
                <span className="text-gray-400 text-sm">credits</span>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="cursor-pointer ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-xs font-medium"
                >
                  <FaPlus className="inline mr-1" />
                  Buy
                </button>
              </div>
              
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center font-medium"
              >
                <FaPlus className="mr-2" />
                Create New Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Portfolios</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <FaUser className="text-purple-400 h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-2xl font-bold text-white">{stats.published}</p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-lg">
                <FaGlobe className="text-green-400 h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Private</p>
                <p className="text-2xl font-bold text-white">{stats.private}</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <FaLock className="text-orange-400 h-6 w-6" />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Expired</p>
                <p className="text-2xl font-bold text-white">{stats.expired}</p>
              </div>
              <div className="bg-red-500/20 p-3 rounded-lg">
                <FaTimesCircle className="text-red-400 h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search portfolios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Portfolios</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <p className="text-gray-400">
            Showing {stats.total} of {stats.total} portfolios
          </p>
        </div>

        {/* Portfolio Grid */}
        <PortfolioList searchTerm={searchTerm} filterType={filterType}/>
      </div>

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Credit Recharge Modal */}
      <CreditRechargeModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onSuccess={handleCreditPurchaseSuccess}
        currentCredits={credits}
      />
    </div>
  );
};

export default useReduxStore(AIPortfolioDashboard);