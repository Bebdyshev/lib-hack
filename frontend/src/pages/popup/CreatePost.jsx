import React, { useState, useEffect, useRef } from 'react';
import './popup.css';
import axiosInstance from '../../axios/instanse'; // Adjust this import according to your setup
import { toast } from 'react-toastify';

const CreatePost = ({ onClose }) => {
  const popupRef = useRef(null);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState(""); // Renamed for clarity

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(file);
      setPreviewUrl(objectUrl);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const resp = await axiosInstance.post("/aws/upload-media", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('File uploaded:', resp.data);
        setImageUrls(resp.data.fileUrl); // Set imageUrls with the uploaded file URL
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl('');
    setImageUrls(""); // Clear imageUrls
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData =  { title, author, description, media_urls: [imageUrls] }
    try {
      const resp = await axiosInstance.post("/books/create_book", submitData);
      console.log('Post created:', resp.data);
      toast("Post created successfully");
      onClose();
    } catch (err) {
      console.error('Error creating book:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className="popup-content"
        ref={popupRef}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-button" onClick={onClose}>&times;</span>
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "center",
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>                              
            <div className="custom-file-input">
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
              <label htmlFor="file-input" className="file-label">
                {previewUrl ? (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                  </div>
                ) : (
                  <div className="placeholder">
                    <span>Select an image</span>
                  </div>
                )}
              </label>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <span>Title</span>
              </label>
              <input
                type="text"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "96%",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #e2e8f0",
                }}
                required
              />
            </div>    
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <span>Author name</span>
              </label>
              <input
                type="text"
                placeholder="Author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{
                  width: "96%",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #e2e8f0",
                }}
                required
              />
            </div>            
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                <span>Description</span>
              </label>
              <textarea
                placeholder="Write description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "96%",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #e2e8f0",
                }}
                required
              />
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: "#3182ce",
                  color: "#fff",
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
