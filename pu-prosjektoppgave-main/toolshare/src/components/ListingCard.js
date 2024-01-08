import React from 'react'
import { Link } from 'react-router-dom'
const ListingCard = ({ id, imgSrc, title, price, location, badgeText}) => {

    // let badgeText= "Available"

  return (
    <Link to={`/listing/${id}`}>
      <div className="listing">
          {badgeText && <div className="listing-badge">{badgeText}</div>}
          <img src={imgSrc} alt = "tool" className='listing-image' />
          <span className='listing-title'>{title}</span>
          <span className="listing-price">{price}</span>
          <span>{location}</span>
      </div>
    </Link>
  )
}

export default ListingCard