import React from 'react';
import './Profile.css';
import SignOutButton from '../SignOut/SignOut';
import SignInButton from '../SignIn/SignIn';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const Profile = () => (
  <AuthUserContext.Consumer>
    {authUser => {
    return <ProfileBase user={authUser}/>}}
  </AuthUserContext.Consumer>
);

class ProfileBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: null,
      email: null,
      phoneNumber: null
    }
  }

  render() {
    if (this.props.user) {
      console.log(this.props.user)
      return (
          <div>
            <h1>User Profile</h1>
            <div className="details"><h3>Name: </h3><p>{this.props.user.displayName}</p></div>
            <div className="details"><h3>Email: </h3><p>{this.props.user.email}</p></div>
            <div className="details"><h3>Phone Number: </h3><p>{this.props.user.phoneNumber ? this.props.user.phoneNumber : '-'}</p></div>
            <SignOutButton />
          </div>
      );
    } else {
      return (
      <div>
        <p>Please sign in to view your profile page.</p>
        <SignInButton />
      </div>);
    }
  }
}

export default withFirebase(Profile);
