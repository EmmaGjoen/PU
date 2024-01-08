import React, { useState } from 'react';
import { db } from '../firebase-config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import './RentalAgreement.css'; // import the CSS file

function RentalAgreement({ listing }) {
  const user = firebase.auth().currentUser;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState(listing.price);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert('You must be logged in to make a rental agreement!');
      return;
    }

    setIsLoading(true);

    const agreementData = {
      listingId: listing.id,
      listinguserId: listing.userId,
      startDate,
      endDate,
      price,
      notes,
      renterId: user.uid,
      renterEmail: user.email,
      status: 'pending', // Set the initial status to "pending"
      createdAt: new Date(), // Add a timestamp to track when the request was made
    };

    await db.collection('rentalAgreements').add(agreementData);

    // Notify the seller of the new request
    const sellerRef = await db.collection('users').doc(listing.userId).get();
    const sellerData = sellerRef.data();
    const message = `${user.email} has requested to rent your ${listing.title} listing. Please log in to your account to accept or reject the request.`;
    const notificationData = {
      message,
      createdAt: new Date(),
    };
    if (sellerData && sellerData.pushToken) {
      await db.collection('notifications').doc(sellerData.pushToken).collection('messages').add(notificationData);
    }
    setIsLoading(false);
    setStartDate('');
    setEndDate('');
    setPrice(listing.price);
    setNotes('');
  };

  return (
  <form onSubmit={handleSubmit} className="rental-agreement-form">
    <h2 className="rental-agreement-form__title">Rental Agreement</h2>
    <div className="rental-agreement-form__field">
      <label htmlFor="start-date" className="rental-agreement-form__label">Start Date:</label>
      <input
        id="start-date"
        type="date"
        value={startDate}
        onChange={(event) => setStartDate(event.target.value)}
        required
        className="rental-agreement-form__input"
      />
    </div>
    <div className="rental-agreement-form__field">
      <label htmlFor="end-date" className="rental-agreement-form__label">End Date:</label>
      <input
        id="end-date"
        type="date"
        value={endDate}
        onChange={(event) => setEndDate(event.target.value)}
        required
        className="rental-agreement-form__input"
      />
    </div>
    <div className="rental-agreement-form__field">
      <label htmlFor="price" className="rental-agreement-form__label">Price (per day):</label>
      <input
        id="price"
        type="number"
        min="0"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        required
        className="rental-agreement-form__input"
      />
    </div>
    <div className="rental-agreement-form__field">
      <label htmlFor="notes" className="rental-agreement-form__label">Notes:</label>
      <textarea
        id="notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className="rental-agreement-form__input"
      />
    </div>
    <button type="submit" disabled={isLoading} className="rental-agreement-form__button">
      {isLoading ? 'Creating Rental Agreement...' : 'Create Rental Agreement'}
    </button>
  </form>

  );
}

export default RentalAgreement;
