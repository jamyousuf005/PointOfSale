import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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


const TransactionsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7)); // August 2025

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const today = new Date(2025, 7, 5); 
  const isToday = (day) => {
    return currentDate.getMonth() === today.getMonth() && 
             currentDate.getFullYear() === today.getFullYear() && 
             day === today.getDate();
  };

  return (
    // Apply the container variants to the outermost div
    <motion.div 
      className='p-6'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Apply the uniform variants to the main content div */}
      <motion.div 
        className="mx-auto p-6 bg-white rounded-lg shadow-sm"
        variants={uniformVariants}
      >
        {/* Header */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          My Transactions
        </h1>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigateMonth(-1)}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          <h2 className="text-xl font-medium text-gray-700">
            {monthYear}
          </h2>

          <button 
            onClick={() => navigateMonth(1)}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-50">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-4 text-center font-medium text-gray-600 border-b border-gray-200">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  h-20 border-b border-r border-gray-200 p-2
                  ${day ? 'hover:bg-gray-50 cursor-pointer' : ''}
                  ${index % 7 === 6 ? 'border-r-0' : ''}
                  ${Math.floor(index / 7) === Math.floor((days.length - 1) / 7) ? 'border-b-0' : ''}
                `}
              >
                {day && (
                  <div className={`
                    text-sm font-medium
                    ${isToday(day) 
                      ? 'text-red-600 font-bold' 
                      : 'text-gray-700'
                    }
                  `}>
                    {day}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionsCalendar;