import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/sharp-solid-svg-icons';
import './Findbook.css';

const Card = React.memo(({ card, setCards, cards, sendRequest, likeanddis }) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-100, 100], [-18, 18]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const isFront = card.id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : card.id % 2 ? 3 : -3;
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
    } else if (x.get() < -swipeThreshold) {
      sendRequest(card._id, "dislike");
    }

    if (Math.abs(x.get()) > swipeThreshold) {
      setCards((prev) => prev.filter((v) => v._id !== card._id));
    }
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
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="tinder-img" style={{ pointerEvents: 'none' }}>
        <img className="book-cover" src={card.media_urls} alt={card.title} />
      </div>
      <div className="text">
        <h2 className="title">{card.title}</h2>
        <span className="author">{card.author}</span>
        <hr />
        <span className="description">{card.description}</span>
      </div>

      {swipeDirection === 'right' && (
        <FontAwesomeIcon icon={faHeart} className="swipe-icon heart-icon" />
      )}
      {swipeDirection === 'left' && (
        <FontAwesomeIcon icon={faHeartBroken} className="swipe-icon broken-heart-icon" />
      )}
    </motion.div>
  );
});

export default Card;
