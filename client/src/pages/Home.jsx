import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/bundle'
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [sellListing, setSellListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data.listings);
        fetchRentListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListing(data.listings);
        fetchSaleListings();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sell&limit=4");
        const data = await res.json();
        setSellListing(data.listings);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto p-28 px-3">
        <h1 className="text-slate-700 font-bold text-3xl md:text-4xl lg:text-6xl">
          Find you next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </h1>
        <div className="text-gray-400 text-sm">
          PropEase estate is the best place to find your next perfect place to
          live. <br className="sm:flex hidden" /> We have a wide range of properties for you to choose
          from.
        </div>
        <Link
          to={"/search"}
          className="text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation={true} modules={[Navigation]}>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageURLs}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listings results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {offerListing && offerListing.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-700">Recent Offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>
                  Show more Offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListing.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )}
          {rentListing && rentListing.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-700">Recent place for Rent</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=rent'}>
                  Show more places for Rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListing.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )}
          {sellListing && sellListing.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-700">Recent List for Sell</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>
                  Show more list for Sell
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {sellListing.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Home;
