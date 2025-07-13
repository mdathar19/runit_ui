"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Code, 
  Palette, 
  Terminal, 
  Sparkles, 
  User,
  Mail,
  LogOut,
  Key,
  Settings,
  ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import GlobalDropdown, { DropdownItem, DropdownDivider, DropdownHeader } from '../global/DropDown';
import Login from '../Login';
import ChangePasswordModal from '../ChangePasswordModal';
import useReduxStore from '@/hooks/useReduxStore';
import { landingNnavigationItems } from '@/utils/landing';
import { logout } from '@/redux/slices/authSlice';
const Navigation = () => {
    const dispatch = useDispatch();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  // Get auth state from Redux (assuming you have this set up)
  const { isAuthenticated, user, token } = useSelector(state => state.auth || {
    isAuthenticated: false,
    user: null,
    token: null
  });

  // Mock user data for demo (remove this when integrating with real Redux)
  const [mockUser, setMockUser] = useState(null);
  const isUserLoggedIn = isAuthenticated || mockUser;
  const currentUser = user || mockUser;


  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    window.open(href, '_blank');
    setIsMobileMenuOpen(false);
  };
  

  const handleLoginSuccess = (token, userData) => {
    // Mock login success for demo
    setMockUser({
      email: 'user@example.com',
      name: 'John Doe',
      avatar: null
    });
    setIsLoginOpen(false);
    console.log('Login successful:', { token, userData });
  };

  const handleLogout = () => {
    // In a real app, dispatch logout action
    dispatch(logout());
    setMockUser(null);
    console.log('User logged out');
  };

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  /* const handleSettings = () => {
    console.log('Settings clicked');
    // Navigate to settings page
  }; */

  // User Avatar Component
  const UserAvatar = ({ user, size = 'sm' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    if (user?.avatar) {
      return (
        <Image
          src={user.avatar}
          alt={user.name || user.email}
          width={32}
          height={32}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      );
    }

    // Generate initials from name or email
    const initials = user?.name 
      ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : user?.email?.[0]?.toUpperCase() || 'U';

    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center font-semibold text-white`}>
        {initials}
      </div>
    );
  };

  // User Dropdown Trigger
  const UserDropdownTrigger = () => (
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
      <UserAvatar user={currentUser} />
      <div className="hidden md:block text-left">
        <div className="text-sm font-medium text-white truncate max-w-32">
          {currentUser?.name || currentUser?.email?.split('@')[0]}
        </div>
        <div className="text-xs text-gray-400 truncate max-w-32">
          {currentUser?.email}
        </div>
      </div>
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </div>
  );

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-md border-b border-gray-800/50' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
                className="flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={() => handleNavClick('/')}
                >
                <div className="flex items-end space-x-1">
                    <Image 
                    src="/favicon_io/android-chrome-512x512.png" 
                    alt="RunIt Logo" 
                    width={46} 
                    height={46} 
                    />
                    <span className="text-xl font-bold text-white font-luxury">.It</span>
                </div>
            </motion.div>



            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {landingNnavigationItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <div className={`p-1 rounded bg-gradient-to-r ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {item.icon}
                    </div>
                    <span className="text-gray-300 group-hover:text-white font-medium">
                      {item.name}
                    </span>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-xs text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {item.description}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center">
              {!isUserLoggedIn ? (
                <motion.button
                  className="cursor-pointer flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsLoginOpen(true)}
                >
                  Get Started Free
                </motion.button>
              ) : (
                <GlobalDropdown
                  trigger={<UserDropdownTrigger />}
                  theme="dark"
                  position="bottom-right"
                >
                  <DropdownHeader theme="dark">Account</DropdownHeader>
                  
                  <DropdownItem
                    icon={<Mail className="h-4 w-4" />}
                    theme="dark"
                    disabled
                  >
                    {currentUser?.email}
                  </DropdownItem>
                  
                  <DropdownDivider theme="dark" />
                  
                  {/* <DropdownItem
                    icon={<Settings className="h-4 w-4" />}
                    onClick={handleSettings}
                    theme="dark"
                  >
                    Account Settings
                  </DropdownItem> */}
                  
                  <DropdownItem
                    icon={<Key className="h-4 w-4" />}
                    onClick={handleChangePassword}
                    theme="dark"
                  >
                    Change Password
                  </DropdownItem>
                  
                  <DropdownDivider theme="dark" />
                  
                  <DropdownItem
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={handleLogout}
                    theme="dark"
                    danger
                  >
                    Sign Out
                  </DropdownItem>
                </GlobalDropdown>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800/50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="container mx-auto px-4 py-4">
                  <div className="space-y-2">
                    {landingNnavigationItems.map((item, index) => (
                      <motion.button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient}`}>
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-sm text-gray-400">{item.description}</div>
                        </div>
                      </motion.button>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-800">
                      {!isUserLoggedIn ? (
                        <motion.button
                          className="cursor-pointer  w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300"
                          onClick={() => {
                            setIsLoginOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Get Started Free
                        </motion.button>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/30 rounded-lg">
                            <UserAvatar user={currentUser} />
                            <div className="flex-1 text-left">
                              <div className="text-white font-medium text-sm">
                                {currentUser?.name || currentUser?.email?.split('@')[0]}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {currentUser?.email}
                              </div>
                            </div>
                          </div>
                          
                          {/* <button
                            onClick={() => {
                              handleSettings();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Account Settings</span>
                          </button> */}
                          
                          <button
                            onClick={() => {
                              handleChangePassword();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                          >
                            <Key className="h-4 w-4" />
                            <span>Change Password</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Login Modal */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        nextAction="RunIt Platform"
      />
      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userEmail={currentUser?.email || ''}
      />
    </>
  );
};

export default useReduxStore(Navigation);