import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo2.png";
import { FaSearch } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';

const Header = () => {

  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-gray-800">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link to={"/"}>
          <img className="w-20 sm:w-24" src={logo} alt="app logo" />
        </Link>
        <form className="bg-gray-700 p-2 rounded-lg md:flex items-center hidden">
          <input
            type="text"
            placeholder="Search..."
            className="w-20 sm:w-32 bg-transparent placeholder:text-slate-300 border-none outline-none text-slate-200"
          />
          <FaSearch className="text-slate-300" />
        </form>
        <div className="p-3 bg-gray-600 rounded-lg md:hidden">
          <FaSearch color="white" />
        </div>
        <div className="p-2 bg-gray-600 rounded-lg cursor-pointer" title="Create Listing">
          <Link to={'/createlisting'}>
            <IoAddOutline color="white" size={23} style={{fontWeight: "bolder"}} />
          </Link>
        </div>
        <ul className="sm:flex hidden items-center gap-4">
          <Link to={'/'}>
            <li className="text-slate-200 hover:text-teal-500 font-medium transition-all ease-linear duration-200">
              Home
            </li>
          </Link>
          <Link to={'/about'}>
            <li className="text-slate-200 hover:text-teal-500 font-medium transition-all ease-linear duration-200">
              About
            </li>
          </Link>
        </ul>
        <Link to='/profile'>
          {currentUser ? (
            <img className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" src={currentUser.avatar} alt="logo icon" />
          ) : (
            <button className="text-white bg-teal-600 hover:bg-transparent hover:text-teal-600 rounded-lg py-1 px-3 border-2 border-teal-600 font-medium transition-all hover:scale-105 ease-linear duration-200">
              Sign In
            </button>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
