import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import ListingCard from "./ListingCard";
import "./Profile.css";

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [rentalAgreements, setRentalAgreements] = useState([]);
  const [activeRentalAgreements, setActiveRentalAgreements] = useState([]);


  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      setCurrentUser(user);


      // Fetch the user's listings
      firebase
        .firestore()
        .collection("listings")
        .where("userId", "==", user.uid)
        .onSnapshot((snapshot) => {
          const newItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setListings(newItems);
        });

      // Fetch the user's rental agreements
      firebase
        .firestore()
        .collection("rentalAgreements")
        .where("listinguserId", "==", user.uid)
        .onSnapshot((snapshot) => {
          const newItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRentalAgreements(newItems);
        });

        firebase
        .firestore()
        .collection("rentalAgreements")
        .where("listinguserId", "==", user.uid)
        .where("status", "==", "accepted") // Add a where clause to filter by status
        .onSnapshot((snapshot) => {
          const newItems = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setActiveRentalAgreements(newItems);
        });

    } else {
      setCurrentUser(null);
      setListings([]);
      setRentalAgreements([]);
    }
  }, []);

  const handleAccept = async (id, listingId) => {
    try {
      // Update rental agreement status to "accepted"
      await firebase
        .firestore()
        .collection("rentalAgreements")
        .doc(id)
        .update({
          status: "accepted",
        });

    // Update the listing status to "unavailable"
    const listing = listings.find((item) => item.id === listingId);
    if (listing) {
      await firebase
        .firestore()
        .collection("listings")
        .doc(listing.id)
        .update({
          availability: "Unavailable",
        });
    }
  } catch (error) {
    console.error("Error accepting rental agreement: ", error);
  }
};

  const handleReject = async (id) => {
    try {
      await firebase.firestore().collection("rentalAgreements").doc(id).update({
        status: "rejected"
      });
    } catch (error) {
      console.error("Error rejecting rental agreement: ", error);
    }
  };

  const handleCancel = async (id, listingId) => {
    try {
      await firebase.firestore().collection("rentalAgreements").doc(id).update({
        status: "cancelled"
      });
          // Update the listing status to "unavailable"
      const listing = listings.find((item) => item.id === listingId);
      if (listing) {
        await firebase
          .firestore()
          .collection("listings")
          .doc(listing.id)
          .update({
            availability: "Available",
          });
      }
    } catch (error) {
      console.error("Error cancelling rental agreement: ", error);
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Welcome, {firebase.auth().currentUser.email}!</h1>
  
      <h2 className="profile-section-heading">Your Listings</h2>
      <ul className="profile-listings">
        {listings.map((item) => (
          <div className="profile-listing-card">
            <ListingCard
              imgSrc={item.imageURL}
              title={item.title}
              price={item.price + " kr"}
              location={item.shortDescription}
              id={item.id}
              badgeText={item.availability}
            />
          </div>
        ))}
      </ul>
  
      <h2 className="profile-section-heading">Pending Rental Agreements</h2>
      <ul className="profile-agreements">
        {rentalAgreements
          .filter((item) => item.status === "pending")
          .map((item) => (
            <li key={item.id}>
              <p>User email {item.renterEmail} has sent you a pending request</p>
              <p>Start Date: {item.startDate}</p>
              <p>End Date: {item.endDate}</p>
              <p>Asking Price: {item.price}</p>
              <p>Notes: {item.notes}</p>
              <button onClick={() => handleAccept(item.id, item.listingId)}>Accept</button>
              <button onClick={() => handleReject(item.id)}>Reject</button>
            </li>
          ))}
      </ul>

      <h2 className="profile-section-heading">Active Rental Agreements</h2>
        <ul className="profile-agreements">
          {activeRentalAgreements.map((item) => (
            <li key={item.id}>
              <p>You have a rental agreement with {item.renterEmail} from {item.startDate} to {item.endDate} for {item.price}.</p>
              <button onClick={() => handleCancel(item.id, item.listingId)}>Cancel</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;