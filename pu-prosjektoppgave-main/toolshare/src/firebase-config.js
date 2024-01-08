import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyBvGi7HhRJLxM3CKDyBrNuGTM6nXMiY3N4",
    authDomain: "fir-pu-a255d.firebaseapp.com",
    projectId: "fir-pu-a255d",
    storageBucket: "fir-pu-a255d.appspot.com",
    messagingSenderId: "72298627365",
    appId: "1:72298627365:web:12dffde311e35f8b331acc",
    measurementId: "G-BV1YYX29E7"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();

// export const auth = getAuth(app)
// export const db = getFirestore();
export { auth, db };
