import React from 'react';
import Slider from 'react-slick';
import './Carousel.css'; // Custom styles for carousel if needed
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const TrendingCarousel = ({ trending }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 3000,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {trending.map((item) => (
          <div key={item._id} className="carousel-slide">
            <img src={item.media_urls[0]} alt={item.title} className="carousel-image" /> 
            <h3 align="center" style={{marginTop: "5px"}}>{item.title}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TrendingCarousel;
