import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import CreateListing from './pages/CreateListing'
import PrivateRoutes from './components/PrivateRoutes'
import YourListings from './pages/YourListings'
import UpdateListing from './pages/UpdateListing'

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/yourlistings' element={<YourListings />} />
          <Route path='/createlisting' element={<CreateListing />} />
          <Route path='/updatelisting/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App