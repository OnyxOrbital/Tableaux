import React from 'react';
import './Profile.css';
import SignInButton from '../../SignIn/SignIn';
import SignOutButton from '../../SignOut/SignOut';
import { AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';

const Profile = () => (
  <AuthUserContext.Consumer>
    {authUser => {
    return <ProfileBase user={authUser}/>}}
  </AuthUserContext.Consumer>
);

class ProfileBase extends React.Component {
  render() {
      return (
          <div>
              {this.props.user 
              ? (
                <div>
                  <p>{this.props.user.displayName}</p>
                  <div className="dropdownContent">
                    <SignOutButton />
                  </div>
                </div>)
              : <SignInButton />}
          </div>
      );
  }
}

export default withFirebase(Profile);
