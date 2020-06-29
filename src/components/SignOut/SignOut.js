import React from 'react';
import './SignOut.css';
import { withFirebase } from '../Firebase';
 
const SignOutButton = ({ firebase }) => (
  <button className="Signout" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);
 
export default withFirebase(SignOutButton);