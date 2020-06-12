import React from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';
import './App.css';
import { MainTab } from '../Tab/Tab';
import TopPanel from '../TopPanel/TopPanel';
import Navigation from '../Navigation/Navigation';
import SignUpPage from '../SignUp/SignUp';
import SignInPage from '../SignIn/SignIn';
import * as ROUTES from '../../constants/routes';

class App extends React.Component {
  render(){
    return (
      <div>
        <Router>
          <div>
            <Navigation />
    
            <hr />
      
            {/* <Route exact path={ROUTES.LANDING} component={LandingPage} /> */}
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.TAB} component={MainTab} />
          </div>
        </Router>
        {/* <TopPanel />
        <MainTab /> */}
      </div>
    );
  }
}

export default App;
