import React from 'react';
import './TopPanel.css';
import logo from '../../images/tableaux-logo.gif';
import { Notifications } from './Notifications/Notifications';
import SearchBar from '../SearchBar/SearchBar';
import Profile from './Profile/Profile';
import {
  withRouter
} from 'react-router-dom';

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
            <div className="logo">
              <img src={logo} height="100px" width="100px" id="logoImg" alt=''/>
              <p>Tableaux</p>
            </div>
            <SearchBar action={this.handleChange}/>
            <Profile />
            <Notifications />
            <p id="semesterdate">AY2019/20, Special Term 1</p>
          </div>
        );
    }
}

export default withRouter(TopPanel);