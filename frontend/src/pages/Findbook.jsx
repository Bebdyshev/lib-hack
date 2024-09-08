import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import './Findbook.css';
import CreatePost from "./popup/CreatePost";
import axiosInstance from "../axios/instanse";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CIcon } from '@coreui/icons-react';
import { cilBookmark } from '@coreui/icons';

const Findbook = () => {
  const heartIcon = (
    <motion.div
      className="icon-container"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
    >
      <div className="yes" style={{backgroundColor: "#fa04042a"}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="red"
          style={{backgroundColor: "#fa040443"}}
          className="heart-icon"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </motion.div>
  );
  
  const brokenHeartIcon = (
    <motion.div
      className="icon-container"
      initial={{ scale: 1 }}
      style={{backgroundColor: "rgba(0, 0, 0, 0.163)"}}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop" }}
    >
      <div className="yes"       style={{backgroundColor: "rgba(0, 0, 0, 0.163)"}}>
      <i class="fa-solid fa-heart-crack" style={{fontSize: "100px", color: "black", zIndex: "1006", padding: "50px", borderRadius: "50%", backgroundColor: "rgba(0, 0, 0, 0.371)"}}></i>
      </div>
    </motion.div>
  );

  const [showHeart, setShowHeart] = useState(false); 
  const [showBrokenHeart, setShowBrokenHeart] = useState(false); 
  const [cards, setCards] = useState(null);
  const [likeanddis, setLikeanddis] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axiosInstance.get("/books/recomendation/init");
        const result = [resp.data.like, resp.data.current];
        const lad = [resp.data.like, resp.data.dislike];

        setLikeanddis(lad);
        setCards(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);


  const sendRequest = async (cardId, action) => {
    try {
      await axiosInstance.post(`/books/view?bookId=${cardId}`);
      await axiosInstance.post(`/books/${action}?bookId=${cardId}`);
      
    } catch (error) {
      // setError(cardId);
      console.error("Error sending request:", error);
    }
  };

  const loadMore = async (cardId, action) => {
    try {
      const anotherResponse = await axiosInstance.get(`/books/recomendation/following?bookId=${cardId}`);
      
      const choosen = action === "like" ? likeanddis[0] : likeanddis[1];
      
      console.log('Previous Like and Dislike:', likeanddis);
      console.log('New Recommendations:', anotherResponse.data.likedRecommendation, anotherResponse.data.dislikedRecommendation);
  
      if (
        anotherResponse.data.likedRecommendation !== likeanddis[0] || 
        anotherResponse.data.dislikedRecommendation !== likeanddis[1]
      ) {
        const lad = [anotherResponse.data.likedRecommendation, anotherResponse.data.dislikedRecommendation];
        const result = [anotherResponse.data.likedRecommendation, choosen];
        
        console.log('Result:', result);
  
        setCards(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(result)) {
            return result;
          }
          return prev;
        });
        setLikeanddis(lad);
      }
    } catch (err) {
      console.error('Error loading more cards:', err);
    }
  };
  

  const handleCreateButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  

  return (
    <div className="tinder-container">
      {cards && cards.map((card) => (
        <Card 
          key={card._id} 
          card={card} 
          cards={cards} 
          setCards={setCards} 
          sendRequest={sendRequest} 
          likeanddis={likeanddis} 
          setShowHeart={setShowHeart}
          setShowBrokenHeart={setShowBrokenHeart}
          setActiveCardId={setActiveCardId} 
          loadMore={loadMore}
        />
      ))}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <CreatePost onClose={handleClosePopup} />
        </div>
      )}
      <div className="createButton">
        <button className="create" onClick={handleCreateButtonClick}>
          +
        </button>
      </div>
      {showHeart && heartIcon}
      {showBrokenHeart && brokenHeartIcon}
      <ToastContainer />
    </div>
  );
};

const Card = React.memo(({ card,loadMore, setCards,sendRequest, cards, likeanddis, setShowHeart, setShowBrokenHeart, setActiveCardId }) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-100, 100], [-18, 18]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const isFront = card._id === cards[cards.length - 1]._id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : card._id % 2 ? 3 : -3;
    return `${rotateRaw.get() + offset}deg`;
  });

  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    const unsubscribe = x.onChange((latestValue) => {
      if (latestValue > 0) {
        setSwipeDirection('right');
      } else if (latestValue < 0) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection(null);
      }
    });

    return () => unsubscribe();
  }, [x]);

  const handleDragEnd = () => {
    const swipeThreshold = 100;
    
    if (x.get() > swipeThreshold) {
      sendRequest(card._id, "like");
      if (card._id === cards[0]._id){
        loadMore(card._id)
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 500); 
    } else if (x.get() < -swipeThreshold) {
      sendRequest(card._id, "dislike");
      if (card._id === cards[0]._id){
        loadMore(card._id)
      }
      setShowBrokenHeart(true);
      setTimeout(() => setShowBrokenHeart(false), 500); 
    }
    
    if (Math.abs(x.get()) > swipeThreshold) {
      setCards(prev => prev.filter(c => c._id !== card._id));
    }
  };

  const handleBookButtonClick = async (cardId) => {
    try {
      const rep = await axiosInstance.post(`/books/reserv?bookId=${cardId}`);
      console.log(rep)
      toast("Successfully booked. View more in filed reservations")
    } catch (error){
      console.error('Error booking book:', error);
    }
  }

  const handleCardClick = () => {
    setActiveCardId(card._id); 
  };

  return (
    <motion.div
      className="tinder-card"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick} 
    >
      <div className="tinder-img" style={{ pointerEvents: 'none' }}>
        <img className="book-cover" src={card.media_urls} alt={card.title} />
      </div>
      <div className="text">
      {card.is_from_library && (
  <div className="library-book-container">
    <div className="library-indicator" style={{color: "white"}}>from library</div>
    <div className="bookButton">
      <button className="book" onClick={() => handleBookButtonClick(card._id)}>
        Book
      </button>
    </div>
  </div>
)}

        {!card.is_from_library && <div className="bookcrossing-indicator">Book Crossing</div>}
        <h2 className="title">{card.title}</h2>
        <span className="author">{card.author}</span>
        <hr />
        <span className="description">{card.description}</span>
        
      </div>
      
    </motion.div>
  );
});

export default Findbook;