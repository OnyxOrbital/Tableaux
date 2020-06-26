import React from 'react'; 
import './SignIn.css';
import { withFirebase } from '../Firebase';
 
// const SignInButton = ({ firebase }) => (
//   <button id="signIn" type="button" onClick={firebase.doSignIn}>
//     Sign In
//   </button>
// );

function SignInButton({firebase}) {
  return (
    <button className="signIn" type="button" onClick={firebase.doSignIn}>
      <p>Sign In</p>
    </button>);
}
 
export default withFirebase(SignInButton);