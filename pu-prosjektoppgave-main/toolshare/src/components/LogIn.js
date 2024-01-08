import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";



function LogIn() {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/login`; 
    navigate(path);
    window.location.reload();
  }
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // set up listener for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; // cleanup function to unsubscribe when component unmounts
  }, []);

  // LOGIN
  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;
      console.log(user);
      setUser(user);
      routeChange();
    } catch (error) {
      console.log(error.message);
      //alert(error.message); 
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
    }
  };

  // LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // SIGN UP
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      const user = userCredential.user;
      console.log(user);
      setUser(user);
      setSignUpError("");
      routeChange();
    } catch (error) {
      console.log(error.message);
      setSignUpError(error.message);
    }
  };

  return (
    <div className="login-div">
      <div>
        <h2>Register new user</h2>
        <input
          placeholder="Email..."
          onChange={(event) => {
            setSignUpEmail(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          onChange={(event) => {
            setSignUpPassword(event.target.value);
          }}
        />
        <button className="loginbutton" onClick={signUp}> Register </button>
        {signUpError && <p>{signUpError}</p>}
      </div>
      <div>
        <h2>Log in to existing user</h2>
        <h4> Email: </h4>
        <input
          placeholder="Email..."
          onChange={(event) => {
            setLoginEmail(event.target.value);
          }}/>
        <br></br>
        <h4> Password: </h4> 
        <input
          type="password" 
          placeholder="Password..."
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />
        <br></br>
        <br></br>
        <button className="loginbutton" onClick={login}> Login </button>
        <br></br>
        <br></br>
        {errorMessage && <div>{errorMessage}</div>}
      <div className="login-div">
        </div>
        <div className="login-div">
        <div class="container">
        </div>
        </div>
      </div>

      
    </div>
  );
}


export default LogIn;



