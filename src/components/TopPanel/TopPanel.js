import React from 'react';
import './TopPanel.css';
import logo from '../../images/tableaux-logo.gif';
import { Notifications } from './Notifications/Notifications';
import SearchBar from '../SearchBar/SearchBar';
import SignInButton from '../SignIn/SignIn';
import {
  withRouter
} from 'react-router-dom';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

const TopPanel = () => (
  <AuthUserContext.Consumer>
    {authUser => {
    return <TopPanelBase user={authUser}/>}}
  </AuthUserContext.Consumer>
);

class TopPanelBase extends React.Component {
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
            <div className="logo">
              <img src={logo} height="100px" width="100px" id="logoImg" alt=''/>
              <p>Tableaux</p>
            </div>
            <SearchBar action={this.handleChange}/>
            <div>
              {this.props.user 
              ? (
                <div>
                  <p>{this.props.user.displayName}</p>
                </div>)
              : <SignInButton />}
            </div>
            <Notifications />
            <p id="semesterdate">AY2019/20, Special Term 1</p>
          </div>
        );
    }
}

export default compose(withRouter, withFirebase)(TopPanel);