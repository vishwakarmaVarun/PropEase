import React from "react";

const Search = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="left p-7 border-gray-300 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Types:</label>
            <div className="flex gap-1">
                <input type="checkbox" id="all" className="w-5" />
                <span>Rent & Sell</span>
            </div>
            <div className="flex gap-1">
                <input type="checkbox" id="rent" className="w-5" />
                <span>Rent</span>
            </div>
            <div className="flex gap-1">
                <input type="checkbox" id="sell" className="w-5" />
                <span>Sell</span>
            </div>
            <div className="flex gap-1">
                <input type="checkbox" id="offer" className="w-5" />
                <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-1">
                <input type="checkbox" id="parking" className="w-5" />
                <span>Parking</span>
            </div>
            <div className="flex gap-1">
                <input type="checkbox" id="furnished" className="w-5" />
                <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order" className="border rounded-lg p-3">
                <option>Price high to low</option>
                <option>Price low to high</option>
                <option>Latest</option>
                <option>Oldest</option>
            </select>
          </div>
          <button type="submit" className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-600 transition-all duration-150 ease-in">Search</button>
        </form>
      </div>
      <div className="right p-3">
        <h1 className="text-2xl font-semibold border-b-2 border-slate-400 p-2 text-slate-700">Listing Results:</h1>
      </div>
    </div>
  );
};

export default Search;
