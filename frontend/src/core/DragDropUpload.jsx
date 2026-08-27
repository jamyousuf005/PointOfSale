import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';

export default function DragDropImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      setFileDetails(null);
      return;
    }

    if (typeof value === 'string') {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';
      setPreview(value.startsWith('http') ? value : `${backendUrl}/uploads/${value}`);
      setFileDetails({ name: value, size: null });
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(value);
      setFileDetails({ name: value.name, size: (value.size / 1024 / 1024).toFixed(2) + ' MB' });
    }
  }, [value]);

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

  const processFile = (file) => {
    if (validateFile(file)) {
      if (onChange) {
        onChange(file);
      }
    }
  };

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

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const removeImage = (e) => {
    if (e) e.stopPropagation();
    setPreview(null);
    setFileDetails(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="w-full my-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-102'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-40 w-40 object-cover rounded-lg shadow-md border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 shadow transition-colors"
              >
                ×
              </button>
            </div>
            {fileDetails && (
              <div>
                <p className="text-sm font-medium text-gray-700">{fileDetails.name}</p>
                {fileDetails.size && (
                  <p className="text-xs text-gray-500">{fileDetails.size}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Upload className="h-full w-full" />
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or <span className="text-purple-600 underline font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
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
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}