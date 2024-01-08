import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import './CreateListing.css'; // Import the CSS file

// CreateListing returns a form for creating a new listing, and adds it to the database
function CreateListing({ onClose }) {
  // initialises values
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const currentUser = firebase.auth().currentUser;


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!currentUser) {
      alert('User must be logged in');
      return;
    }
  
    const listingData = {
      id: firebase.firestore().collection('listings').doc().id,
      title,
      shortDescription,
      description,
      price,
      userEmail: currentUser.email,
      userId: currentUser.uid,
      availability: "Available",
    }

    
  
    if (image) {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(image.name);
      await imageRef.put(image);
      const imageURL = await imageRef.getDownloadURL();
      listingData.imageURL = imageURL;
    }
    
    await firebase.firestore().collection('listings').doc(listingData.id).set(listingData);
    await firebase.firestore().collection('users').doc(currentUser.email).collection('listings').doc(listingData.id).set(listingData);
    setTitle('');
    setDescription('');
    setShortDescription('');
    setPrice(0);
    setImage(null);
    onClose();
  };
  

  // returns a form, and executes handleSubmit 
  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <input
        type="text"
        placeholder="Title"
        maxLength="15"
        minLength="1"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        className="listing-input"
      />
      <input
        type="text"
        placeholder="Short Description"
        maxLength="40"
        minLength="1"
        value={shortDescription}
        onChange={(event) => setShortDescription(event.target.value)}
        required
        className="listing-input"
      />
      <textarea
        type="text"
        placeholder="Full Description"
        maxLength="300"
        minLength="1"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        required
        className="fullDescription-listing-input"
      />
      <input
        type="number"
        placeholder="Price"
        max="10000"
        min="0"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        required
        className="listing-input"
      />
      <input
        type="file"
        onChange={(event) => setImage(event.target.files[0])}
        required
        className="listing-input"
      />
      <button type="submit" className="create-listing-btn">Create Listing</button>
    </form>
  );
}


export default CreateListing;
