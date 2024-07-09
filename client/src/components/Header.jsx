import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.png";
import { FaSearch } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleClick = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className="bg-gray-800">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Link to={"/"}>
          <img className="w-20 sm:w-24" src={logo} alt="app logo" />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-2 rounded-lg md:flex items-center hidden"
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-20 sm:w-32 bg-transparent placeholder:text-slate-300 border-none outline-none text-slate-200"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button type="submit">
            <FaSearch className="text-slate-300" />
          </button>
        </form>
        <div
          onClick={handleClick}
          className="p-3 bg-gray-600 rounded-lg md:hidden cursor-pointer"
        >
          <FaSearch color="white" />
        </div>
        <div
          className="p-2 bg-gray-600 rounded-lg cursor-pointer"
          title="Create Listing"
        >
          <Link to={"/createlisting"}>
            <IoAddOutline
              color="white"
              size={23}
              style={{ fontWeight: "bolder" }}
            />
          </Link>
        </div>
        <ul className="sm:flex hidden items-center gap-4">
          <Link to={"/"}>
            <li className="text-slate-200 hover:text-teal-500 font-medium transition-all ease-linear duration-200">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="text-slate-200 hover:text-teal-500 font-medium transition-all ease-linear duration-200">
              About
            </li>
          </Link>
        </ul>
        <div className="relative">
          <div className="cursor-pointer">
            {currentUser ? (
              <img
                onClick={handleProfileClick}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                src={currentUser.avatar}
                alt="profile icon"
              />
            ) : (
              <Link to={'/signin'} className="text-white bg-teal-600 hover:bg-transparent hover:text-teal-600 rounded-lg py-1 px-3 border-2 border-teal-600 font-medium transition-all hover:scale-105 ease-linear duration-200">
                Sign In
              </Link>
            )}
          </div>
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownVisible(false)}
              >
                Profile
              </Link>
              <Link
                to="/yourlistings"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownVisible(false)}
              >
                Your Listings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
