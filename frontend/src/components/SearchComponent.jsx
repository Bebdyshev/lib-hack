import React, { useState } from 'react';
import { SearchIcon, CameraIcon, XIcon } from '@heroicons/react/outline';
import axios from 'axios';
import axiosInstance from '../axios/instanse';

const SearchComponent = ({ setSearchResults }) => {
  const [text, setText] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [isNeuroEnabled, setIsNeuroEnabled] = useState(false);
  const [filePreview, setFilePreview] = useState(null); // State to store the file preview
  const [isUploading, setIsUploading] = useState(false); // State to block the search during upload

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setHasFile(!!file);

    if (file) {
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

      const formData = new FormData();
      formData.append('file', file);

      // Set uploading state to true to disable the search button
      setIsUploading(true);

      try {
        const response = await axios.post('https://lib-hack-ai-backend-production.up.railway.app/search/neiro-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setSearchResults(response.data.results.matches);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        // Once the upload is done, set uploading state to false
        setIsUploading(false);
      }
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const clearSearch = () => {
    setText('');
    setHasFile(false);
    setFilePreview(null); // Reset the file preview
  };

  const toggleNeuro = () => {
    setIsNeuroEnabled((prev) => !prev); // Toggle the state
  };

  const showContinueButton = hasFile || text.trim() !== '';

  const handleSearch = async () => {
    if (text.trim() === '') return; 
  
    try {
      let url = `/books/search`;
      let params = { query: text };
  
      if (isNeuroEnabled) {
        url = `https://lib-hack-ai-backend-production.up.railway.app/search/neiro-text`;
        params = { prompt: text };
      }
  
      const response = await axiosInstance.get(url, { params });
      if (isNeuroEnabled){
        setSearchResults(response.data.results.matches);
      }else{
      setSearchResults(response.data);}
    } catch (error) {
      console.error('Error searching:', error);
    }
  };
  

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0px 12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      Width: '600px',
      height: '65px',
      margin: 'auto',
      marginTop: '15px'
    }}>
      {/* Neuro Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginRight: '8px',
        cursor: 'pointer'
      }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#4A4A4A',
            fontSize: '14px',
            marginRight: '8px'
          }}
        >
          <span style={{ marginRight: '6px' }}>AI</span>
          <div
            onClick={toggleNeuro}
            style={{
              width: '40px',
              height: '20px',
              borderRadius: '10px',
              backgroundColor: isNeuroEnabled ? '#3B82F6' : '#D1D5DB',
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: isNeuroEnabled ? '22px' : '2px',
                transition: 'left 0.3s ease'
              }}
            />
          </div>
        </label>
      </div>

      {/* File Preview */}
      {filePreview && (
        <div style={{ margin: '10px 0', textAlign: 'center' }}>
          <img
            src={filePreview}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
      )}

      {/* Text Input */}
      <div style={{ flexGrow: 1 }}>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Найдётся всё"
          style={{
            width: '75vh',
            padding: '8px',
            border: '1px solid #D1D5DB',
            borderRadius: '4px',
            outline: 'none',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '8px',
      }}>
        {/* File Upload Button */}
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3F4F6',
            color: '#4A4A4A',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '4px',
          }}
        >
          <i className="fa-solid fa-image" style={{fontSize: '20px'}}></i>
        </label>

        {/* Clear Button */}
        <button
          onClick={clearSearch}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            backgroundColor: '#F3F4F6',
            color: '#4A4A4A',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginRight: '4px',
          }}
          title="Очистить поисковый запрос"
        >
          <i class="fa-solid fa-x" style={{fontSize: '20px'}}></i>
        </button>

        {/* Search Button */}
        {showContinueButton && (
          <button
            onClick={handleSearch} // Call handleSearch when button is clicked
            disabled={isUploading} // Disable while uploading
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              backgroundColor: isUploading ? '#9CA3AF' : '#3B82F6',
              color: '#ffffff',
              borderRadius: '4px',
              border: 'none',
              cursor: isUploading ? 'not-allowed' : 'pointer'
            }}
            title="Поиск"
          >
            <i class="fa-solid fa-magnifying-glass" style={{fontSize: '20px'}}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
