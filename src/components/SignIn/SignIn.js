import React from 'react'; 
import './SignIn.css';
import { withFirebase } from '../Firebase';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.createUserInDatabase = this.createUserInDatabase.bind(this);
  }

  createUserInDatabase(snapshot, user) {
    if (snapshot.val() === null) {
      return this.props.firebase.database.ref()
        .child('users').child(user.user.uid)
       .set({
         username: user.user.displayName,
         email: user.user.email,
         roles: {},
       }); 
    }
  }

  render() {
    return (
      <button className="signIn" type="button" onClick={(event) => {
        this.props.firebase.doSignIn()
        .then(socialAuthUser => {
          console.log('socialauthuser.uid', socialAuthUser.user.uid)
          return this.props.firebase.database.ref().child('users')
          .child(socialAuthUser.user.uid).once('value', snapshot => this.createUserInDatabase(snapshot, socialAuthUser));
        });
        event.preventDefault();
        }}>
        <p>Sign In</p>
      </button>);
  }    
}

export default withFirebase(SignIn);