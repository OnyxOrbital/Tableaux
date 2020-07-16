import React from 'react';
import './TopPanel.css';
import logo from '../../images/tableaux-logo.gif';
import { Notifications } from './Notifications/Notifications';
import SearchBar from '../SearchBar/SearchBar';
import SignInButton from '../SignIn/SignIn';
import NavMenu from '../Navigation/NavMenu';
import {
  withRouter
} from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';


class TopPanel extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange = (e) => {
      this.props.history.push(`/Modules/${e.value}`);
    }

    render() {
        return (
          <div className="top-panel">
            <NavMenu className="navMenuButton" user={this.props.firebase.auth.currentUser}/>
            <div className="logo">
              <img src={logo} height="100px" width="100px" id="logoImg" alt=''/>
              <p>Tableaux</p>
            </div>
            <SearchBar action={this.handleChange}/>
            <div>
              {this.props.firebase.auth.currentUser 
              ? (
                <div>
                  <p>{this.props.firebase.auth.currentUser.displayName}</p>
                </div>)
              : <SignInButton />}
            </div>
            <Notifications />
            <p id="semesterdate">AY2020/21, Semester 1</p>
          </div>
        );
    }
}

export default compose(withRouter, withFirebase)(TopPanel);