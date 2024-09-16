'use client';


import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ImageSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchImage, setSearchImage] = useState(null);
  const [results, setResults] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const [loading, setLoading] = useState(false);


  const fileInputRef = useRef(null);


  // Dynamically generate stars on mount
  useEffect(() => {
    const starContainer = document.querySelector('.star-container');
    const totalStars = 100; // Number of stars you want to generate


    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 3 + 1; // Random size between 1px and 4px
      const topPosition = Math.random() * 100; // Random top position (0% to 100%)
      const leftPosition = Math.random() * 100; // Random left position (0% to 100%)
      const duration = Math.random() * 5 + 3; // Random twinkle duration (3s to 8s)


      // Set the size, position, and animation duration for each star
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${topPosition}%`;
      star.style.left = `${leftPosition}%`;
      star.style.animationDuration = `${duration}s`;


      starContainer.appendChild(star); // Append the star to the container
    }
  }, []);


  const handleSearch = async () => {
    if (!searchTerm && !searchImage) {
      toast.error('Please provide a search term or an image');
      return;
    }


    setLoading(true);


    const body = searchImage
      ? { imageBase64: searchImage }
      : { description: searchTerm };


    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });


      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        toast.error(data.error);
        setResults([]);
      }
    } catch (error) {
      toast.error('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSearchImage(reader.result.split(',')[1]);
      };
    }
  };


  const handleClear = () => {
    setSearchTerm('');
    setSearchImage(null);
    setResults([]);


    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const openPopup = (imageSrc) => {
    setPopupImage(imageSrc);
  };


  const closePopup = () => {
    setPopupImage(null);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-night p-4 relative overflow-hidden">
      {/* Dynamic Starry Background */}
      <div className="star-container absolute inset-0 overflow-hidden"></div>


      <h1 className="text-4xl font-bold mb-6 text-white floating" style={{ lineHeight: '5rem' }}>
        Search Images
      </h1>


      <div className="flex flex-wrap gap-8 justify-center w-full max-w-7xl mb-6 relative">
        <div className="search-section bg-dark p-6 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search by description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-4 p-2 bg-night-input border border-gray-500 rounded"
          />
        </div>


        <div className="search-section bg-dark p-6 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 bg-night-input border border-gray-500 rounded text-white"
            ref={fileInputRef}
          />
        </div>
      </div>


      <div className="flex space-x-4 mt-4">
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="w-full sm:w-auto bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Clear
        </button>
      </div>


      {loading && (
        <div className="mt-6">
          <div className="loader"></div>
        </div>
      )}


      <div className="w-full max-w-4xl mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((image) => (
          <div key={image.id} className="bg-gray-700 p-4 rounded-lg shadow glow-on-hover">
            <p className="text-gray-200 font-bold mb-2">{image.description}</p>
            <img
              src={`data:image/jpeg;base64,${image.image_data}`}
              alt={image.description}
              className="w-full h-48 object-cover rounded mb-4 cursor-pointer"
              onClick={() =>
                openPopup(`data:image/jpeg;base64,${image.image_data}`)
              }
            />
          </div>
        ))}
      </div>


      {popupImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closePopup}
        >
          <div className="relative">
            <img src={popupImage} alt="Full Size" className="max-h-screen max-w-full rounded-lg" />
            <button
              className="absolute top-0 right-0 m-4 text-2xl"
              onClick={closePopup}
            >
              &times;
            </button>
          </div>
        </div>
      )}


      <ToastContainer />
    </div>
  );
}


