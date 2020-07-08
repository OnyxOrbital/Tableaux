import React from 'react';
import './Profile.css';
import SignOutButton from '../SignOut/SignOut';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const Profile = () => (
  <AuthUserContext.Consumer>
    {authUser => {
    return <ProfileBase user={authUser}/>}}
  </AuthUserContext.Consumer>
);

class ProfileBase extends React.Component {
  render() {
    if (this.props.user) {
      console.log(this.props.user)
      return (
          <div>
            <h2>User Profile</h2>
            <div className="details"><h3>Name: </h3><p>{this.props.user.displayName}</p></div>
            <div className="details"><h3>Email: </h3><p>{this.props.user.email}</p></div>
            <div className="details"><h3>Phone Number: </h3><p>{this.props.user.phoneNumber ? this.props.user.phoneNumber : '-'}</p></div>
            <SignOutButton />
          </div>
      );
    } else {
      return <p style={{color: 'red'}}>Waiting for user data...</p>
    }
  }
}

export default withFirebase(Profile);
