import React from 'react'; 
import './SignIn.css';
import { withFirebase } from '../Firebase';

function SignInButton({firebase}) {
  return (
    <button className="signIn" type="button" onClick={(event) => {
      firebase.doSignIn()
      .then(socialAuthUser => {
        console.log(socialAuthUser);
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid)
          .set({
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {},
          });});
     
        event.preventDefault();
      }}>
      <p>Sign In</p>
    </button>);
}


export default withFirebase(SignInButton);