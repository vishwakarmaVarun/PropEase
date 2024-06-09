# PropEase

PropEase is a full-stack real estate web application that provides users with a platform to list, search, and manage properties. Built using the MERN stack (MongoDB, Express, React, Node.js), the application integrates OAuth for secure authentication, JWT for authorization, and Firebase for image storage.

## Features

- **User Authentication and Authorization**:
  - Secure user authentication using OAuth (Google, Facebook, etc.).
  - JSON Web Tokens (JWT) for maintaining user sessions and authorization.
- **Property Management**:
  - Users can create, read, update, and delete property listings.
  - Image uploads for property listings are handled by Firebase.
- **Search and Filter**:
  - Users can search for properties based on various criteria like location, price, and amenities.
- **Responsive Design**:
  - Fully responsive design ensures seamless user experience on all devices.

## Technologies

- **Frontend**:
  - React
  - Redux
  - Axios
- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
- **Authentication**:
  - OAuth (Google, Facebook)
  - JWT (JSON Web Tokens)
- **Image Storage**:
  - Firebase
- **Others**:
  - Docker (for containerization)
  - Jest (for testing)

## Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/yourusername/PropEase.git
   cd PropEase
   ```
3. **Install Backend Dependencies**:
   ```
   cd backend
   npm install
   ```
5. **Install Frontend Dependencies**:
   ```
   cd ../client
   npm install
   ```

7. **Set Up Environment Variables**:
- Create a `.env` file in the `backend` directory and add the following variables:
  ```
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
  FIREBASE_API_KEY=your_firebase_api_key

5. **Run the Application**:
- Start the backend server:
  ```
  cd backend
  npm start
  ```
- Start the frontend development server:
  ```
  cd ../client
  npm start
  ```

## Usage

1. **Access the Application**:
- Open your web browser and go to `http://localhost:3000` to access the frontend.
- The backend server runs on `http://localhost:5000`.

2. **Authentication**:
- Use the OAuth options to sign in or create an account.

3. **Create and Manage Listings**:
- Once authenticated, you can create new property listings, upload images, and manage your existing listings.

4. **Search and Filter Properties**:
- Use the search and filter functionality to find properties based on your criteria.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgements

- Thanks to the developers of the MERN stack and Firebase for their powerful tools.
- Special thanks to all the contributors and testers of PropEase.
