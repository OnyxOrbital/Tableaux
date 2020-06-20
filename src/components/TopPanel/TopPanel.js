import React from 'react';
import './TopPanel.css';
import logo from '../../images/tableaux-logo.gif';
import { Notifications } from './Notifications/Notifications';
import SearchBar from './SearchBar/SearchBar';
import Profile from './Profile/Profile';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import ModuleInfo from '../ModuleInfo/ModuleInfo';


export default class TopPanel extends React.Component {
    // constructor(props) {
    //   super(props);
    //   this.state = {
    //     redirectTo: null
    //   }
    //   this.select = this.select.bind(this)
    //   this.redirect = this.redirect.bind(this)
    // }

    // select(modCode) {
    //   this.setState({ redirectTo: modCode });
    // }

    // redirect() {
    //   if (this.state.redirectTo) {
    //     return <Router><Route path={`/Modules/:moduleCode`} component={ModuleInfo}/></Router>
    //   }
    // }


    render() {
        return (
          <div className="top-panel">
            <div className="logo">
              <img src={logo} height="100px" width="100px" id="logoImg"/>
              <p>Tableaux</p>
            </div>
            <SearchBar />
            {/* {this.redirect()} */}
            
            <Profile authUser={this.props.authUser}/>
            <Notifications />
            <p id="semesterdate">AY2019/20, Special Term 1</p>
          </div>
        );
    }
}