import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import TopPanel from '../TopPanel/TopPanel';
import Navigation from '../Navigation/Navigation';
import SignUpPage from '../SignUp/SignUp';
import SignInPage from '../SignIn/SignIn';
import SignOutPage from '../SignOut/SignOut';
import YourTimetable from '../YourTimetable/YourTimetable';
import SharedTimetable from '../SharedTimetable/SharedTimetable';
import Modules from '../Modules/Modules';
import MyConsults from '../MyConsults/MyConsults';
import Settings from '../Settings/Settings';
import ModuleInfo from '../Modules/ModuleInfo/ModuleInfo';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import Timetable from '../Timetable/Timetable';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
    this.props.firebase.getDatabase();
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <TopPanel authUser={this.state.authUser}/>
            <div className="app">
              <Navigation className="nav" authUser={this.state.authUser}/>

              <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route path={ROUTES.SIGN_OUT} component={SignOutPage} />
              <Route className="page" path={ROUTES.YOUR_TIMETABLE} component={YourTimetable} />
              <Switch>
                <Route exact path={ROUTES.SHARED_TIMETABLE} component={SharedTimetable} />
                <Route path={`/SharedTimetables/:name`} component={Timetable} />
              </Switch>
              <Switch>
                <Route exact path={ROUTES.MODULES} component={Modules} />
                <Route path={`/Modules/:moduleCode`} component={ModuleInfo}/>
              </Switch>
              <Route path={ROUTES.MY_CONSULTS} component={MyConsults} />
              <Route path={ROUTES.SETTINGS} component={Settings} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default withFirebase(App);
