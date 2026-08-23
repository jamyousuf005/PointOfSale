import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

export default function DragDropImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  
  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return false;
    }

    setError('');
    return true;
  };

  // Process selected file
  const processFile = (file) => {
    if (validateFile(file)) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Drag event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processFile(imageFile);
    } else {
      setError('Please drop an image file');
    }
  };

  // File input change handler
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload function (you can customize this)
  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      // Replace with your actual upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        removeImage();
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Drag & Drop Image Upload
      </h2>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          /* Image Preview */
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-48 w-48 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{image?.name}</p>
              <p className="text-xs text-gray-500">
                {image && `${(image.size / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>
        ) : (
          /* Upload Prompt */
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <Upload className="h-full w-full" />
            </div>
            <div>
              <p className="text-lg text-gray-600">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                or{' '}
                <span className="text-blue-500 hover:text-blue-600 underline font-medium">
                  click to browse
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF, WebP up to 10MB
              </p>
            </div>
          </div>
        )}

       
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {preview && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors font-medium"
          >
            Upload Image
          </button>
          <button
            onClick={removeImage}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

    </div>
  );
}