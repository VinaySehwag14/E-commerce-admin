// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//* Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB01t07felfdfXSH9dQejHx7zyiUz1pqLg",
  authDomain: "e-commerce-43e2c.firebaseapp.com",
  projectId: "e-commerce-43e2c",
  storageBucket: "e-commerce-43e2c.appspot.com",
  messagingSenderId: "739570509645",
  appId: "1:739570509645:web:50cf4d88c729f6bdcf7904",
};

//* Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
