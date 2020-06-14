import app from 'firebase/app';
import 'firebase/auth';
import { Redirect } from 'react-router-dom';

export const config = {
    apiKey: "AIzaSyByRMldAI3zf___c_DwB42fuQuAprjT59c",
    authDomain: "tableaux-9cae1.firebaseapp.com",
    databaseURL: "https://tableaux-9cae1.firebaseio.com",
    projectId: "tableaux-9cae1",
    storageBucket: "tableaux-9cae1.appspot.com",
    messagingSenderId: "477222218367",
    appId: "1:477222218367:web:86b0debd6dc0c5ba57ad4a",
    measurementId: "G-FHPWWN1DXM",
    redirectUrl: 'https://tableaux-9cae1.firebaseapp.com/__/auth/handler'
  };

class Firebase {
    constructor() {
      app.initializeApp(config);
      this.auth = app.auth();
    }
    //Auth API
    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

}

export default Firebase;

