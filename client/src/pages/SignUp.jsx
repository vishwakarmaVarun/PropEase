import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom'
import OAuth from "../components/OAuth";

const SignUp = () => {

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setError("Please fill out all the fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if(res.ok){
        setError(null)
        setLoading(false)
        navigate('/signin')
      }

      if(data.success === false){
        setError(data.message)
        setLoading(false)
        return
      }

    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }

  return (
    <div className="flex sm:flex-row gap-5 flex-col items-center p-2 pt-24 max-w-screen-lg mx-auto">
      <div className="flex-1 text-center">
        <h1 className="sm:text-3xl md:text-4xl text-[26px] font-mono mb-2 font-medium">
          Welcome to Prop<span className=" text-red-500">Ease</span>
        </h1>
        <p className="sm:text-lg text-[15px] font-mono mb-4">
          Your Property, Simplified
        </p>
        <p className="sm:text-base text-[14px] text-gray-700 font-mono">
          Sign up now and take the first step towards streamlined property management.
        </p>
      </div>
      <div className="flex-1 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border-2 border-teal-800 p-2 sm:p-3 rounded-lg"
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
          />
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
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <OAuth />
        </form>
        <div className="flex items-center gap-2 mt-4">
          <p>Already have an account?</p>
          <Link to={'/signin'}>
            <span className="text-blue-600 hover:underline">Sign In</span>
          </Link>
        </div>
        {error && <p className="bg-red-200 text-red-500 p-3 rounded-lg mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
