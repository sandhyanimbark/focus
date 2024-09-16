
'use client';


import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ImageList() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 8;
  const [hasMoreImages, setHasMoreImages] = useState(true);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);


  const [selectedImage, setSelectedImage] = useState(null);


  // Adding dynamic stars logic
  useEffect(() => {
    const starContainer = document.querySelector('.star-container');
    const totalStars = 100;


    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      const size = Math.random() * 3 + 1;
      const topPosition = Math.random() * 100;
      const leftPosition = Math.random() * 100;
      const duration = Math.random() * 5 + 3;


      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${topPosition}%`;
      star.style.left = `${leftPosition}%`;
      star.style.animationDuration = `${duration}s`;


      starContainer.appendChild(star);
    }


    return () => {
      starContainer.innerHTML = '';
    };
  }, []);


  useEffect(() => {
    fetchImages();
  }, [currentPage]);



  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
  
      if (data.length === 0) {
        // Handle no images found scenario
        setImages([]);
        setHasMoreImages(false); // No more images if the array is empty
      } else {
        setImages(data);
        setHasMoreImages(data.length > imagesPerPage * currentPage);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
        setLoading(false);
      }
    };

  const handleEdit = (image) => {
    setEditingImage(image);
    setNewDescription(image.description);
  };


  const handleDelete = async (id) => {
    const response = await fetch(`/api/images/${id}`, {
      method: 'DELETE',
    });


    if (response.ok) {
      toast.success('Image deleted successfully');
      fetchImages();
    } else {
      toast.error('Failed to delete image');
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setNewImage(reader.result.split(',')[1]);
    };
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/images/${editingImage.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: newDescription,
        imageBase64: newImage || editingImage.image_data,
      }),
    });


    if (response.ok) {
      toast.success('Image updated successfully');
      setEditingImage(null);
      setNewDescription('');
      setNewImage(null);
      fetchImages();
    } else {
      toast.error('Failed to update image');
    }
  };


  // Handle inserting new image
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result.split(',')[1]);
    };
  };


  const handleNewImageSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, imageBase64: image }),
    });


    if (response.ok) {
      toast.success('Image uploaded successfully!');
      setDescription('');
      setImage(null);
      fetchImages();
      setIsModalOpen(false);
    } else {
      toast.error('Failed to upload image');
    }
  };


  const handleImageClick = (image) => setSelectedImage(image);
  const handleClosePreview = () => setSelectedImage(null);

  const paginatedImages = (images && images.length > 0) ? images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)  : [];
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-night p-4 overflow-hidden">
      {/* Twinkling Stars */}
      <div className="star-container absolute inset-0"></div>


      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="loader"></div>
          <p className="text-xl text-gray-700 mt-4">Ruko jara, page load hone do...</p>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl w-full z-10">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-200">Uploaded Images</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded button-pop"
          >
            Upload New Image
          </button>
          <hr className="mt-5 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {paginatedImages.map((image) => (
              <div key={image.id} className="bg-gray-700 p-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                {editingImage && editingImage.id === image.id ? (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                      <label className="block text-gray-200 text-sm font-bold mb-2">New Description</label>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-200 text-sm font-bold mb-2">New Image (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="flex items-center">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded button-pop mr-2"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingImage(null)}
                        className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded button-pop"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-300 font-bold mb-2">{image.description}</p>
                    <img
                      src={`data:image/jpeg;base64,${image.image_data}`}
                      alt={image.description}
                      className="w-full h-48 object-cover rounded-lg mb-4 cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => handleImageClick(image)}
                    />
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEdit(image)}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="w-full sm:w-auto bg-gradient-to-r from-gray-500 to-red-500 text-white font-bold py-2 px-4 rounded button-pop"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>


          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!hasMoreImages}
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            >
              Next
            </button>
          </div>
        </div>
      )}


      {/* New Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Upload New Image</h2>
            <form onSubmit={handleNewImageSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleNewImageChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded button-pop mr-2"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded button-pop"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClosePreview}>
          <div className="relative">
            <img src={`data:image/jpeg;base64,${selectedImage.image_data}`} alt={selectedImage.description} className="max-h-screen max-w-full rounded-lg" />
            <button
              className="absolute top-0 right-0 m-4 text-2xl"
              onClick={handleClosePreview}
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
