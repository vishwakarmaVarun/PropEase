import React from 'react'

const About = () => {
  return (
    <div className="bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-md sm:p-8 p-4 sm:mt-16">
        <h1 className="text-4xl font-bold text-center mb-6">About Our PropEase Estate App</h1>
        <p className="text-gray-700 text-lg mb-4">
          Welcome to our PropEase Estate App, your number one source for all things real estate. We're dedicated to providing you the best properties, with a focus on dependability, customer service, and uniqueness.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Founded in 2024, our app has come a long way from its beginnings. When we first started out, our passion for helping people find their dream homes drove us to start our own business.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          We hope you enjoy our app as much as we enjoy offering it to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        <p className="text-gray-700 text-lg">
          Sincerely,<br />
          PropEase Estate App Team
        </p>
      </div>
    </div>
  )
}

export default About