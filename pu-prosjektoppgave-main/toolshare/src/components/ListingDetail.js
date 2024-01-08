import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import RentalAgreement from "./RentalAgreement";
import "./RentalAgreement.css";
import SendMessage from "./SendMessage";
import MapDirections from "./MapDirections";
import { db } from '../firebase-config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { Link } from 'react-router-dom';


function ListingDetail({ listings }) {
  const [showMessage, setShowMessage] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState({});

  // extract the "id" parameter from the route
  const { id } = useParams();

  // find the listing with the matching ID
  const listing = listings.find(item => item.id === id);

  // if the listing data hasn't loaded yet, show a loading message
  if (!listing) {
    return <div>Loading...</div>;
  }

  const handleSaveListing = () => {
    // get the current user ID
    const userID = user.email

    // create a new document in Firestore for the saved listing
    db.collection("users").doc(userID).collection("savedListings").doc(listing.id).set({
      userId: user.uid,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      imageURL: listing.imageURL,
      availability: listing.availability,
    }).then(() => {
      console.log("Listing saved successfully");
    }).catch((error) => {
      console.error("Error saving listing: ", error);
    });
  };


//Delete listing
  const deleteListing = async () => {
    try {
      const db = firebase.firestore();
      await db.collection("listings").doc(listing.id).delete();
      console.log("Listing deleted successfully");
      alert("Listing deleted successfully");
      window.location.replace("/")
    } catch (error) {
      console.error("Error deleting listing: ", error);
    }
  };

  //Check if user is owner of listing
  const isOwner = user && user.email === listing.userEmail;


  // if the listing data has loaded, render the listing details
  return (
      <div className="full-listing-details">
        <div>
        <img
          src={listing.imageURL}
          alt={listing.title}
          className="full-listing-image"/>
        
        <h2 className="full-listing-title">{listing.title}</h2>
        <p className="full-listing-description">{listing.description}</p>
        <p className="full-listing-price">Price: {listing.price} kr</p>
        {!isOwner && <button className="full-listing-button" onClick={() => setShowMessage(true)}>Contact</button>}
          {showMessage && <SendMessage recipient={listing} />}
          {!isOwner && user && <button className="full-listing-button" onClick={handleSaveListing}>Save Listing</button>}
          {isOwner && <button className="full-listing-button" onClick={deleteListing}>Delete Listing</button>}
        </div>
        <div>
        {listing.availability !== "Unavailable" ? <RentalAgreement listing={listing} /> : ""}  
        </div>
      </div>
    
  );
}

export default ListingDetail;

