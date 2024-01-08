import React, {useState, useEffect} from "react";
import { onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";



function LoggedIn() {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/login`; 
    navigate(path);
  }

  const [user, setUser] = useState({});

  // set up listener for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // cleanup function to unsubscribe when component unmounts
  }, []);

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
    routeChange()
    window.location.reload();
  };

  return (
    <div className="login-div">
      <div>
        <h2 className="login-div">You are logged in!</h2> 
      <div className="login-div">
        <h3> User logged in: </h3>
        <h4> {user?.email}</h4>
        <div class="vertical-center">
        <button className="loginbutton" onClick={logout}> Sign out </button>
        </div>
        {/* use optional chaining to avoid error when user is null or undefined */}
        </div>
        <div className="login-div">
        <div class="container">
        </div>
        </div>
      </div>
    </div>
  );
}

export default LoggedIn;
