import React from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';
import './App.css';
// import { MainTab } from '../Tab/Tab';
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
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

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
  }

  componentWillUnmount() {
    this.listener();
  }
  
  render() {
    return (
      <div>
        <TopPanel authUser={this.state.authUser}/>
      
        <Router>
            <div>
              <Navigation authUser={this.state.authUser}/>
        
              {/* <Route exact path={ROUTES.LANDING} component={LandingPage} /> */}
              <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
              <Route path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route path={ROUTES.SIGN_OUT} component={SignOutPage} />
              <Route path={ROUTES.YOUR_TIMETABLE} component={YourTimetable} />
              <Route path={ROUTES.SHARED_TIMETABLE} component={SharedTimetable} />
              <Route path={ROUTES.MODULES} component={Modules} />
              <Route path={ROUTES.MY_CONSULTS} component={MyConsults} />
              <Route path={ROUTES.SETTINGS} component={Settings} />
              {/* <Route path={ROUTES.TAB} component={MainTab} /> */}
            </div>
        </Router>
      </div>
    );
  }
}

export default withFirebase(App);
