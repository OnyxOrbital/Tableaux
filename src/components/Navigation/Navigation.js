import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import * as ROUTES from '../../constants/routes';
import yourTimetableIcon from '../../images/my-timetable-grey.gif';
import modulesIcon from '../../images/all-modules-grey.gif';
import sharedTimetablesIcon from '../../images/shared-timetables-grey.gif';
import myConsultationIcon from '../../images/my-consultations-grey.gif';
import settingsIcon from '../../images/settings-grey.gif';

// const Navigation = ({ authUser }) => (
//   <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
// );
 
export default class Navigation extends React.Component {
  render() {
    return (
      <ul>
        <li>
          <Link to={ROUTES.YOUR_TIMETABLE}><img className='icon' src={yourTimetableIcon}/>Your Timetable</Link>
        </li>
        <li>
          <Link to={ROUTES.MODULES}><img className='icon' src={modulesIcon}/>Modules</Link>
        </li>
        <li>
          <Link to={ROUTES.SHARED_TIMETABLE}><img className='icon' src={sharedTimetablesIcon}/>Shared Timetables</Link>
        </li>
        <li>
          <Link to={ROUTES.MY_CONSULTS}><img className='icon' src={myConsultationIcon}/>My Consults</Link>
        </li>
        <li>
          <Link to={ROUTES.SETTINGS}><img className='icon' src={settingsIcon}/>Settings</Link>
        </li>
        <li>
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
        <li>
          <Link to={ROUTES.SIGN_OUT}>Sign Out</Link>
        </li>
      </ul>
    );
  }
}