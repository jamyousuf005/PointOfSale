import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Define the animation variants for the outer container.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Define animation variants for the inner content.
const uniformVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(2px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};


export default function Profile() {
  const [profileData, setProfileData] = useState({
    userName: 'Admin',
    email: 'admin@orasoft.pk',
    phoneNumber: '03453785306',
    companyName: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = () => {
    // Reset form after submission
    setProfileData({
      userName: '',
      email: '',
      phoneNumber: '',
      companyName: ''
    });
  };

  const handlePasswordSubmit = () => {
    // Reset password form after submission
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  return (
    // Apply the container variants to the outermost div
    <motion.div 
      className="p-7"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Apply the uniform variants to the main content div */}
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={uniformVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Update User Profile Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Update User Profile</h2>
            
            <p className="text-sm text-gray-500 mb-6 italic">
              The field labels marked with <span className="text-red-500">*</span> are required input fields.
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  UserName <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={profileData.userName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <motion.div className="flex justify-start mt-6" variants={uniformVariants}>
                <motion.button
                  type="button"
                  onClick={handleProfileSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <motion.div className="flex justify-start mt-6" variants={uniformVariants}>
                <motion.button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}