import React, { useEffect, useState } from 'react';
import SearchComponent from '../components/SearchComponent';
import axiosInstance from '../axios/instanse';
import './Home.css';
import TrendingCarousel from '../components/Carousel';
import Dialog from '../components/Dialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookCatalog from '../components/BookCatalog'
function Home() {
  const [trending, setTrending] = useState([]);
  const [liked, setLiked] = useState([]);
  const [viewed, setViewed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');

  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axiosInstance.get("/books/trending");
        setTrending(response.data.trending);
        setLiked(response.data.liked);
        setViewed(response.data.viewed);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchBooks = async() => {
      try{
        const response = await axiosInstance.get("/books/search?limit=100")
        setBooks(response.data)
      }catch(err){
        console.error(err)
      }
    }

    fetchTrending();
    fetchBooks()
  }, []);

  useEffect(() => {
  }, [searchResults]);

  const handleMoreClick = (description) => {
    setSelectedDescription(description);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDescription('');
  };

  const like = async (bookId) => {
    try{
      await axiosInstance.post(`/books/like?bookId=${bookId}`)
      toast("Successfully liked")
    }catch(err){
      console.error(er)
    }
  }

  const gradientStyle = [
  {
    background: 'linear-gradient(to right, #ff7e5f, #feb47b)' // Linear gradient from left to right
  },
  {
    background: 'linear-gradient(to right, #feb47b, #ddfe7b)' // Linear gradient from left to right
  },
  {
    background: 'linear-gradient(to right, #ddfe7b, #c7fe7b)' // Linear gradient from left to right
  },
];

  return (
    <div className="home-container">
      <SearchComponent setSearchResults={setSearchResults} />
      {searchResults && (
        <div className="search-results-container">
          {searchResults
            .filter((val, index, self) =>
              index === self.findIndex((v) =>
                (v.metadata?.url || v.url) === (val.metadata?.url || val.url)
              )
            )
            .map((val) => (
            <div className="search-result-item bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col items-center">
              <img
                src={val.metadata && val.metadata.url || val.media_urls[0]}
                alt={val.metadata?.title || val.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p className="title text-lg font-semibold mb-1">
                {val.metadata?.title || val.title}
              </p>
              <p className="author text-sm text-gray-500 mb-2">
                {val.metadata?.author || val.author}
              </p>
              <div className="flex space-x-2">
                <button
                  className="more-button bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                  onClick={() => handleMoreClick(val.metadata?.description || val.description)}
                >
                  More
                </button>
                
                  {val.is_from_library === false ? <button
                  className="reserv-button bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  onClick={() => {like(val._id)}}
                >Like </button>: <button
                className="reserv-button bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                onClick={() => {}}
              >Reserv </button>}
                
              </div>
            </div>
            
            ))}
        </div>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        description={selectedDescription}
      />
      <div className="carousel-row">
        <div className="carousel-item" style={gradientStyle[0]}>
          <p align="center">Trending</p>
          <TrendingCarousel trending={trending} />
        </div>
        <div className="carousel-item" style={gradientStyle[1]}>
          <p align="center">Liked</p>
          <TrendingCarousel trending={liked} />
        </div>
        <div className="carousel-item" style={gradientStyle[2]}>
          <p align="center">Viewed</p>
          <TrendingCarousel trending={viewed} />
        </div>
      </div>
      <ToastContainer />
      <BookCatalog books={books}/>
    </div>
  );
}

export default Home;
