import React from 'react';
import './Profile.css';
import SignOutButton from '../SignOut/SignOut';
import SignInButton from '../SignIn/SignIn';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import Pdf from './Tableaux-User-Guide.pdf';

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
    // <div className="details"><h3>Phone Number: </h3><p>{this.props.user.phoneNumber ? this.props.user.phoneNumber : '-'}</p></div>
    if (this.props.user) {
      return (
          <div>
            <h1>User Profile</h1>
            <div className="details"><h3>Name: </h3><p>{this.props.user.displayName}</p></div>
            <div className="details"><h3>Email: </h3><p>{this.props.user.email}</p></div>
            <div className="buttons">
              <a href = {Pdf} target = "_blank" id="user-guide1">View User Guide</a>
              <SignOutButton />
            </div>
          </div>
      );
    } else {
      return (
      <div>
        <p>Please sign in to view your profile page.</p>
        <div className="buttons">
          <a href = {Pdf} target = "_blank" id="user-guide2">View User Guide</a>
          <SignInButton />
        </div>
      </div>);
    }
  }
}

export default withFirebase(Profile);
