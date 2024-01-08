import CreateListing from "./components/CreateListing";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import 'firebase/auth';

import Chat from "./components/Chat";

import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import About from "./components/About";
import ListingCard from "./components/ListingCard";
import LogIn from "./components/LogIn";
import { ChakraProvider } from '@chakra-ui/react';
import { Route, Routes} from "react-router-dom";

import ListingDetail from "./components/ListingDetail";
import Profile from "./components/Profile";
import LoggedIn from "./components/LoggedIn";

function App() {
  const [listings, setListings] = useState([]);
  const [keyword, setKeyword] = useState(""); // new state for keyword
  const [availableOnly, setAvailableOnly] = useState(false); // new state for availability filter
  const [category, setCategory] = useState(""); // new state for keyword

  const user = firebase.auth().currentUser;
  console.log(category)
  const cards = listings.filter((item) => category ? item.category === category : item)
  .filter(
    (item) =>
    item.title.toLowerCase().includes(keyword.toLowerCase()) ||
    item.shortDescription.toLowerCase().includes(keyword.toLowerCase())
  )
  .filter(
    (item) =>
      !availableOnly || item.availability.toLowerCase() === "available"
  )
  .map((items) => {
    return (
      <div className="item">
        <ListingCard
          imgSrc={items.imageURL}
          title={items.title}
          price={items.price + " kr"}
          location={items.shortDescription}
          id={items.id}
          badgeText={items.availability}  />
      </div>
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      const db = firebase.firestore();
      const data = await db.collection('listings').get();
      setListings(data.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  return (
    <ChakraProvider>
      <div className="App">
        <Navbar listings={listings} setKeyword={setKeyword} setAvailableOnly={setAvailableOnly} availableOnly={availableOnly} setCategory={setCategory}/>
        <Routes>
          <Route path="/" element={
            <section className="listings-list">
              {cards}
            </section>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={user ? <div><LoggedIn /></div> : <div><LogIn /></div>} />
          <Route path="/createlisting" element={<CreateListing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/listing/:id" element={<ListingDetail listings={listings} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
