import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.floor(progress));
      },
      (error) => {
        console.error("File upload error:", error);
        setFileUploadError(true);
        setUploadSuccess(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
          setUploadSuccess(true);
        });
      }
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setFileUploadError("Please, choose the image less than 2MB");
        setUploadSuccess(false);
        return;
      }
      setFileUploadError(false);
      setUploadSuccess(false);
      setFile(selectedFile);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(null);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateSuccess(null);
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess("Your profile Updated Successfully!");
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignoutUser = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (error) {}
  };

  const handleShowListings = async () => {
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleFileChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile logo"
          className="rounded-full self-center h-20 w-20 object-cover cursor-pointer"
        />
        {fileUploadError && (
          <p className="text-red-600 text-center">{fileUploadError}</p>
        )}
        {filePercentage > 0 && (
          <p className="text-center">{`Upload Progress: ${filePercentage}%`}</p>
        )}
        {uploadSuccess && (
          <p className="text-center text-green-600">
            Image uploaded successfully!
          </p>
        )}
        <input
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="placeholder:text-gray-500 p-3 rounded-lg border-2 outline-none hover:border-teal-800 transition-all duration-150 ease-in"
        />
        <input
          type="email"
          id="email"
          placeholder="youremail@gmail.com"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="placeholder:text-gray-500 p-3 rounded-lg border-2 outline-none hover:border-teal-800 transition-all duration-150 ease-in"
        />
        <input
          type="password"
          id="password"
          placeholder="*********"
          defaultValue={currentUser.password}
          onChange={handleChange}
          className="placeholder:text-gray-500 p-3 rounded-lg border-2 outline-none hover:border-teal-800 transition-all duration-150 ease-in"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-teal-800 disabled:bg-teal-800 p-2 sm:p-3 cursor-pointer disabled:cursor-default uppercase rounded-lg text-[17px] font-medium text-white disabled:text-white hover:text-teal-800 border-2 border-teal-800 hover:bg-transparent transition-all duration-200 ease-linear"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-3 text-red-600 font-semibold">
        <span className="cursor-pointer" onClick={handleDeleteUser}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignoutUser}>
          Sign Out
        </span>
      </div>
      {updateSuccess && (
        <p className="bg-green-300 text-green-600 p-3 rounded-lg mt-2">
          {updateSuccess}
        </p>
      )}
      {error && (
        <p className="bg-red-300 text-red-600 p-3 rounded-lg mt-2">{error}</p>
      )}
      <button
        onClick={handleShowListings}
        className="text-green-700 font-semibold text-[17px] w-full mt-7"
      >
        Show Listings
      </button>
      {showListingsError && (
        <p className="text-red-700 text-sm">{showListingsError}</p>
      )}
      {userListings && userListings.length > 0 && (
        <div>
          <h1 className="text-2xl my-4">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border-2 border-slate-300 rounded-lg p-3 flex justify-between items-center gap-3"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-16 w-16 object-contain"
                  src={listing.imageURLs[0]}
                  alt="listing image"
                />
              </Link>
              <Link className="flex-1" to={`/listing/${listing._id}`}>
                <p className="text-slate-700 font-semibold hover:underline transition-all duration-75 ease-in truncate">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col gap-2 items-center">
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
      )}
    </div>
  );
};

export default Profile;
