import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not Found."));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings."));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been Deleted.");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not Found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listing."));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not Found."));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getlistings = async (req, res, next) => {
  try {
    // Destructure query parameters from req.query
    const {
      searchTerm,
      type,
      rent,
      sell,
      offer,
      parking,
      furnished,
      sortOrder,
      limit
    } = req.query;

    // Initialize the base query
    let query = {};

    // Handle search term if provided
    if (searchTerm) {
      query = { ...query, name: { $regex: new RegExp(searchTerm, "i") } };
    }

    // Handle type filter
    if (type && type !== "all") {
      query = { ...query, type };
    }

    // Handle offer filter
    if (offer === 'true') {
      query = { ...query, offer: true };
    }

    // Handle amenities filters
    if (parking === "true") {
      query = { ...query, parking: true };
    }

    if (furnished === "true") {
      query = { ...query, furnished: true };
    }

    // Handle sorting based on sortOrder
    let sortOption = {};
    if (sortOrder === "reguralPrice_desc") {
      sortOption = { regularPrice: -1 };
    } else if (sortOrder === "reguralPrice_asc") {
      sortOption = { regularPrice: 1 };
    } else if (sortOrder === "created_at_desc") {
      sortOption = { createdAt: -1 };
    } else if (sortOrder === "created_at_asc") {
      sortOption = { createdAt: 1 };
    }

    const limitNum = parseInt(limit) || 9;

    // Fetch listings using Mongoose
    const listings = await Listing.find(query).sort(sortOption).limit(limitNum);

    res.status(200).json({ listings });
  } catch (error) {
    next(error)
  }
};
