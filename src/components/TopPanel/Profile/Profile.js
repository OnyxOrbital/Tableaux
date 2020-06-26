import React from 'react';
import './Profile.css';
import SignInButton from '../../SignIn/SignIn';
import SignOutButton from '../../SignOut/SignOut';

export default class Profile extends React.Component {
  render() {
      return (
          <div>
              {this.props.authUser 
              ? (
                <div>
                  <p>{this.props.authUser}</p>
                  <div className="dropdownContent">
                    <SignOutButton />
                  </div>
                </div>)
              : <SignInButton />}
          </div>
      );
  }
}
