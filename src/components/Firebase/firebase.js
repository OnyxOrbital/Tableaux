import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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
      this.database = firebase.database();
      this.user = this.user.bind(this);
    }

    doSignIn = () => {

      var provider = new firebase.auth.OAuthProvider('microsoft.com');
     
      provider.setCustomParameters({
        // Force re-consent.
        prompt: 'consent',
        // Target specific email with login hint.
        login_hint: 'user@u.nus.edu'
      });
      
      return firebase.auth().signInWithPopup(provider);
    }
    
  doSignOut = () => {
    return firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  getDatabase = () => {
    fetch(`https://api.nusmods.com/v2/2019-2020/moduleList.json`)
    .then(response => response.json())
    // .then(searchResults => this.setState({ searchResults: searchResults }))
    .then(results => {
      results.forEach(module => {
        this.database.ref('/modules/' + module.moduleCode).set({
          module_code: module.moduleCode,
          title: module.title
        });
      })
    })
  }

  retrieveData = () => {
    return this.database.ref('modules');
  }

  //User API
  user = uid => this.database.ref(`users/${uid}`);
  users = () => this.database.ref('users');
}



export default Firebase;

