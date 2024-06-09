import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import OAuth from '../components/OAuth'

const SignIn = () => {

  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState(null)
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setMessage("Please fill out all the fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return false;
    }
    setMessage(null);
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return;
    }
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok){
        navigate('/')
      }

      if(data.success === false){
        dispatch(signInFailure(data.message))
        return
      }

      dispatch(signInSuccess(data))

    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="flex sm:flex-row flex-col items-center p-2 pt-24 max-w-screen-lg mx-auto">
      <div className="flex-1 mb-4 sm:mb-0">
        <h1 className=" sm:text-3xl md:text-4xl text-[26px] text-center text-red-500 font-mono mb-2 font-medium">
          Welcome Back!
        </h1>
        <p className=" sm:text-lg text-[15px] text-center font-mono">
          Sign in to access your personalized property dashboard. Keep track of your properties and manage them with ease.
        </p>
      </div>
      <div className="flex-1 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border-2 border-teal-800 p-2 sm:p-3 rounded-lg"
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            onChange={handleChange}
          />
          <input
            className="border-2 border-teal-800 p-2 sm:p-3 rounded-lg"
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-800 disabled:bg-teal-800 p-2 sm:p-3 cursor-pointer disabled:cursor-default uppercase rounded-lg text-[17px] font-medium text-white disabled:text-white hover:text-teal-800 border-2 border-teal-800 hover:bg-transparent transition-all duration-200 ease-linear"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth />
        </form>
        <div className="flex items-center gap-2 mt-4">
          <p>Don't have an account?</p>
          <Link to={'/signup'}>
            <span className="text-blue-600 hover:underline">Sign Up</span>
          </Link>
        </div>
        {error && <p className="bg-red-200 text-red-500 p-3 rounded-lg mt-2">{error}</p>}
        {message && <p className="bg-red-200 text-red-500 p-3 rounded-lg mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default SignIn;
