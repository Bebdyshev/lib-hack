import React from 'react';
import './Marquee.css'; // Import your CSS file

const ReviewCard = ({ title, media_urls, author, is_from_library }) => (
  <figure className="review-card review-card-light">
    <div className="img-container">
      <img className="img" src={media_urls[0]} alt={title} />
      <div>
        <figcaption className="figcaption">{title}</figcaption>
        <p className="username">{title}</p>
      </div>
    </div>
    <blockquote className="blockquote">{author}</blockquote>
  </figure>
);

export function MarqueeDemo({ data, reverse }) {
  return (
    <div className="container container-light">
      <div className={`marquee ${reverse ? "reverse" : ""}`}>
        {data.map((item) => (
          <ReviewCard key={item._id} {...item} />
        ))}
      </div>
      <div className="gradient-left"></div>
      <div className="gradient-right"></div>
    </div>
  );
}
