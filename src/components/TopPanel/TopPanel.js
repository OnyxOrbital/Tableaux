import React from 'react';
import './TopPanel.css';
import logo from '../../images/tableaux-logo.gif';
import { Notifications } from './Notifications/Notifications';
import { SearchBar } from './SearchBar/SearchBar';


export default class TopPanel extends React.Component {
    render() {
        return (
          <div className="top-panel">
            <div className="logo">
              <img src={logo} height="100px" width="100px" id="logoImg"/>
              <p>Tableaux</p>
            </div>
            <SearchBar />
            <Notifications />
            <p id="semesterdate">AY2019/20, Special Term 1</p>
          </div>
        );
    }
}