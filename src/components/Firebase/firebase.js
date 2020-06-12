import app from 'firebase/app';

export const config = {
    apiKey: "AIzaSyByRMldAI3zf___c_DwB42fuQuAprjT59c",
    authDomain: "tableaux-9cae1.firebaseapp.com",
    databaseURL: "https://tableaux-9cae1.firebaseio.com",
    projectId: "tableaux-9cae1",
    storageBucket: "tableaux-9cae1.appspot.com",
    messagingSenderId: "477222218367",
    appId: "1:477222218367:web:86b0debd6dc0c5ba57ad4a",
    measurementId: "G-FHPWWN1DXM"
  };

class Firebase {
    constructor() {
      app.initializeApp(config);
    }
}
   
export default Firebase;