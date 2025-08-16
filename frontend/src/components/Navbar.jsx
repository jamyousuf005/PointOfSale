import React, { useState, useRef, useEffect } from 'react';
import { IoPersonOutline, IoEarth } from "react-icons/io5";
import { IoIosNotifications, IoIosMenu } from "react-icons/io";
import { MdOutlineShoppingBag } from "react-icons/md";
import { CiBoxes } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="flex items-center justify-between
         px-6 py-3 bg-purple-200 
         text-gray-700 w-full shadow-md fixed top-0 z-56">
            <div onClick={onMenuClick} className="md:hidden text-2xl hover:text-purple-700 cursor-pointer">
                <IoIosMenu className='text-purple-500' />
            </div>

            <div className='flex items-center text-xl cursor-pointer gap-1'>
                <CiBoxes className='text-3xl text-purple-500' />
                <span className="font-medium">Traders</span>
            </div>

            <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
                <li onClick={() => navigate('/POS')}>
                    <button className="flex items-center gap-1 text-base font-medium cursor-pointer hover:text-purple-700 transition">
                        <MdOutlineShoppingBag className="text-2xl" />
                        <span>POS</span>
                    </button>
                </li>
                <li>
                    <IoIosNotifications className="text-2xl hover:text-purple-700 cursor-pointer transition" />
                </li>
                <li className='flex items-center pl-1 hover:text-purple-700 cursor-pointer transition gap-1'>
                    <IoEarth className="text-2xl hover:text-purple-700 cursor-pointer transition" />
                    <span>Language</span>
                </li>

                {/* Admin with Dropdown */}
                <li className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='flex items-center pl-1 hover:text-purple-700 cursor-pointer transition select-none gap-1'
                    >
                        <IoPersonOutline className="text-2xl" />
                        <span>Admin</span>
                    </div>

                    {dropdownOpen && (
                        <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                            <li
                                onClick={() => {
                                    navigate('/Profile');
                                    setDropdownOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-purple-100 cursor-pointer transition"
                            >
                                Profile
                            </li>
                            <li
                                onClick={() => {
                                    navigate('/settings/general');
                                    setDropdownOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-purple-100 cursor-pointer transition"
                            >
                                Settings
                            </li>
                            <li
                                onClick={() => {
                                    navigate('/mytransactions');
                                    setDropdownOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-purple-100 cursor-pointer transition"
                            >
                                My Transactions
                            </li>
                            <li
                                onClick={() => {
                                    navigate('/Logout');
                                    setDropdownOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-red-600 transition"
                            >
                                Logout
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
