import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // CSS styles

function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [plot, setPlot] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle image file change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setPlot('');

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPlot(response.data.plot);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Clear image and plot when navigating to home
  const clearImageAndPlot = () => {
    setImage(null);
    setImagePreview(null);
    setPlot('');
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-brand">Image Color Analyzer</div>
        <ul className="navbar-nav">
          <li><Link to="/" onClick={clearImageAndPlot}>Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="main-content">
            <h1 className="app-title">Analyze Your Image's Color Distribution</h1>
            <form onSubmit={handleSubmit} className="upload-form">
              <label className="custom-file-upload">
                <input type="file" accept="image/*" onChange={handleImageChange} />
                Choose Image
              </label>
              <button type="submit" className="upload-button">Upload</button>
            </form>

            {imagePreview && (
              <div className="image-preview">
                <h2>Your Uploaded Image</h2>
                <img src={imagePreview} alt="Uploaded Preview" className="uploaded-image" />
              </div>
            )}

            {loading && (
              <div className="loader">
                <div className="spinner"></div>
                <p>Processing your image...</p>
              </div>
            )}

            {plot && (
              <div className="plot-container">
                <h2>Color Distribution</h2>
                <img src={`data:image/png;base64,${plot}`} alt="Color Distribution Plot" />
              </div>
            )}
          </div>
        } />
        <Route path="/about" element={<div><h1>About Our Company</h1><p>We specialize in image analysis using machine learning!</p></div>} />
        <Route path="/contact" element={<div><h1>Contact Us</h1><p>Email: LordImager@imageanalyzer.com</p></div>} />
      </Routes>

      <footer className="footer">
        <p>© 2024 Image Color Analyzer. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
