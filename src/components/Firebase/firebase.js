import firebase from 'firebase/app';
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
  };

class Firebase {
    constructor() {
      firebase.initializeApp(config);
      this.auth = firebase.auth();
    }

    doSignIn = () => {
    
      var provider = new firebase.auth.OAuthProvider('microsoft.com');

      provider.setCustomParameters({
        // Force re-consent.
        prompt: 'consent',
        // Target specific email with login hint.
        login_hint: 'user@u.nus.edu'
      });

      firebase.auth().signInWithRedirect(provider);

      return firebase.auth().getRedirectResult()
      .then(function(result) {
        // User is signed in.
        // IdP data available in result.additionalUserInfo.profile.
        // OAuth access token can also be retrieved:
        // result.credential.accessToken
        // OAuth ID token can also be retrieved:
        // result.credential.idToken
        console.log(result.credential.idToken)
      })
      .catch(function(error) {
        // Handle error.
        console.log('Sign in error')
      });
    }
    
    
  doSignOut = () => {
    return firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }
}



export default Firebase;

