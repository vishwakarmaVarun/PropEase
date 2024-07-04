import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const [listing, setListing] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    all: true,
    rent: false,
    sell: false,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [sortOrder, setSortOrder] = useState("reguralPrice_desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        queryParams.append("searchTerm", searchTerm);
        queryParams.append("sortOrder", sortOrder);

        // Include only selected type in query params
        const selectedType = Object.keys(filters).find(
          (key) => filters[key] && key !== "all" && key !== "offer"
        );
        if (selectedType) {
          queryParams.append("type", selectedType);
        }

        // Handle offer filter
        if (filters.offer) {
          queryParams.append("offer", true);
        }

        Object.keys(filters).forEach((key) => {
          if (
            filters[key] &&
            key !== "all" &&
            key !== selectedType &&
            key !== "offer"
          ) {
            queryParams.append(key, filters[key]);
          }
        });

        const response = await fetch(
          `/api/listing/get?${queryParams.toString()}`
        );
        if (!response.ok) {
          setLoading(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListing(data.listings);
        setLoading(false);
      } catch (error) {
        // Handle error
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filters, sortOrder]);

  const handleInputChange = (event) => {
    const { id, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [id]: checked,
      }));

      // Handle type checkboxes to ensure only one is selected
      if (id === "rent" || id === "sell" || id === "offer") {
        setFilters((prev) => ({
          ...prev,
          all: false,
          rent: id === "rent" ? true : false,
          sell: id === "sell" ? true : false,
          offer: id === "offer" ? true : false,
        }));
      }
    } else if (id === "searchTerm") {
      setSearchTerm(value);
    } else if (id === "sort_order") {
      setSortOrder(value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="left p-7 border-gray-300 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Types:</label>
            {["all", "rent", "sell", "offer"].map((type) => (
              <div key={type} className="flex gap-1">
                <input
                  type="checkbox"
                  id={type}
                  checked={filters[type]}
                  onChange={handleInputChange}
                  className="w-5"
                />
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            {["parking", "furnished"].map((amenity) => (
              <div key={amenity} className="flex gap-1">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={filters[amenity]}
                  onChange={handleInputChange}
                  className="w-5"
                />
                <span>
                  {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort_order" className="font-semibold">
              Sort:
            </label>
            <select
              id="sort_order"
              value={sortOrder}
              onChange={handleInputChange}
              className="border rounded-lg p-3"
            >
              <option value="reguralPrice_desc">Price high to low</option>
              <option value="reguralPrice_asc">Price low to high</option>
              <option value="created_at_desc">Latest</option>
              <option value="created_at_asc">Oldest</option>
            </select>
          </div>
        </form>
      </div>
      <div className="right p-3 flex-1">
        <h1 className="text-2xl font-semibold border-b-2 border-slate-400 p-2 text-slate-700">
          Listing Results:
        </h1>
        <div className="p-4 flex flex-wrap gap-4">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-center text-slate-700">
              No Listing Found
            </p>
          )}
          {loading && (
            <div className="flex justify-center items-center">
              <ThreeDots
                visible={true}
                height="50"
                width="50"
                color="#4fa94d"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
