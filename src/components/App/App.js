import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { withAuthentication } from '../Session';

import './App.css';
import TopPanel from '../TopPanel/TopPanel';
import Navigation from '../Navigation/Navigation';
import SignInPage from '../SignIn/SignIn';
import SignOutPage from '../SignOut/SignOut';
import YourTimetable from '../YourTimetable/YourTimetable';
import SharedTimetable from '../SharedTimetable/SharedTimetable';
import Modules from '../Modules/Modules';
import MyConsults from '../MyConsults/MyConsults';
import Profile from '../Profile/Profile';
import ModuleInfo from '../Modules/ModuleInfo/ModuleInfo';
import * as ROUTES from '../../constants/routes';
import OtherTimetable from '../OtherTimetable/OtherTimetable';

class App extends React.Component {
   render() {
    return (
      <div>
        <Router>
          <div>
            <TopPanel />
            <div className="app">
              <Navigation className="nav" />

              <div className="content">
                <Route exact path="/"><Redirect to={ROUTES.YOUR_TIMETABLE} /></Route>
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.SIGN_OUT} component={SignOutPage} />
                <Route className="page" path={ROUTES.YOUR_TIMETABLE} component={YourTimetable} />
                <Switch>
                  <Route exact path={ROUTES.SHARED_TIMETABLE} component={SharedTimetable} />
                  <Route path={`/SharedTimetables/:username`} component={OtherTimetable} />
                </Switch>
                <Switch>
                  <Route exact path={ROUTES.MODULES} component={Modules} />
                  <Route path={`/Modules/:moduleCode`} component={ModuleInfo}/>
                </Switch>
                <Route path={ROUTES.MY_CONSULTS} component={MyConsults} />
                <Route path={ROUTES.PROFILE} component={Profile} />
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default withAuthentication(App);
