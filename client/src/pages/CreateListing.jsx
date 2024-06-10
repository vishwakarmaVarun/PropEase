import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
  })
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUploading, setShowUploading] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmitImage = (e) => {

    // Check file size before uploading
    const oversizedFiles = Array.from(file).filter(f => f.size > 2 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setImageUploadError("One or more images exceed the 2MB size limit.");
      return;
    }

    if (file.length > 0 && file.length + formData.imageURLs.length < 7) {
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < file.length; i++) {
        promises.push(storeImage(file[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLs: formData.imageURLs.concat(urls),
          });
          setImageUploadError(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2mb per page)");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing.");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setShowUploading(Math.floor(progress));
          setSuccess(false);
          if (Math.floor(progress) === 100) setSuccess(true);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageURLs.length < 1)
        return setError("You must upload at least 1 image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than Regular Price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className=" text-teal-700 text-3xl sm:text-4xl md:text-5xl font-semibold text-center my-6">
        Creating Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Listing name"
            className="border p-3 rounded-lg"
            id="name"
            onChange={handleChange}
            value={formData.name}
            maxLength="30"
            minLength="10"
            required
          />
          <textarea
            className="border p-3 rounded-lg"
            placeholder="Description"
            id="description"
            onChange={handleChange}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            onChange={handleChange}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                min={1}
                max={10}
                required
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                min={1}
                max={10}
                required
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="py-3 px-2 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                min="50"
                max="1000000"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="py-3 px-2 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  min="0"
                  max="1000000"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFile(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full cursor-pointer"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleSubmitImage}
              className="p-3 active:scale-90 bg-teal-700 text-white border border-teal-700 rounded uppercase hover:bg-transparent hover:text-teal-700 transition-all duration-150 ease-in"
            >
              Upload
            </button>
          </div>
          {showUploading !== null && <p>Phots are uploading {showUploading}%</p>}
          {success && <p className="text-green-600">Image Uploaded Successfully!</p>}
          <p className="text-red-500">{imageUploadError && imageUploadError}</p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image url"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 border hover:border-red-500 uppercase cursor-pointer p-2"
                >
                  Delete
                </button>
              </div>
            ))}
          <button disabled={loading} className="listing-button uppercase">
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
