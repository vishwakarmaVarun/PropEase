import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const YourListings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser) return;
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listing/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };

    fetchListings();
  }, [currentUser]);

  return (
    <div className="p-3 max-w-4xl mx-auto">
      {showListingsError && (
        <p className="text-red-500">Error fetching your listings. Please try again later.</p>
      )}
      {userListings.length > 0 ? (
        <div>
          <h1 className=" text-center text-3xl my-4 mb-8">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border-2 border-slate-300 rounded-lg p-3 flex justify-between items-center gap-3"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-16 w-16 object-contain"
                  src={listing.imageURLs[0]}
                  alt="listing"
                />
              </Link>
              <Link className="flex-1" to={`/listing/${listing._id}`}>
                <p className="text-slate-700 font-semibold hover:underline transition-all duration-75 ease-in truncate">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <button className="text-red-500 text-sm font-semibold uppercase cursor-pointer">
                  Delete
                </button>
                <button className="text-green-600 text-sm font-semibold uppercase cursor-pointer">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-700">You have no listings yet.</p>
      )}
    </div>
  );
};

export default YourListings;
