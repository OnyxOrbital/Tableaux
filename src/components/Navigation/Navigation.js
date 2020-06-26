import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import * as ROUTES from '../../constants/routes';
import yourTimetableIcon from '../../images/my-timetable-grey.gif';
import modulesIcon from '../../images/all-modules-grey.gif';
import sharedTimetablesIcon from '../../images/shared-timetables-grey.gif';
import myConsultationIcon from '../../images/my-consultations-grey.gif';
import settingsIcon from '../../images/settings-grey.gif';


export default class Navigation extends React.Component {
  render() {
    return (
      <ul className="navBar">
        <li classname="navLink">
          <Link to={ROUTES.YOUR_TIMETABLE}><img className='icon' src={yourTimetableIcon}/><p>Your Timetable</p></Link>
        </li>
        <li classname="navLink">
          <Link to={ROUTES.MODULES}><img className='icon' src={modulesIcon}/><p>Modules</p></Link>
        </li>
        <li classname="navLink">
          <Link to={ROUTES.SHARED_TIMETABLE}><img className='icon' src={sharedTimetablesIcon}/><p>Shared Timetables</p></Link>
        </li>
        <li classname="navLink">
          <Link to={ROUTES.MY_CONSULTS}><img className='icon' src={myConsultationIcon}/><p>My Consults</p></Link>
        </li>
        <li classname="navLink">
          <Link to={ROUTES.SETTINGS}><img className='icon' src={settingsIcon}/><p>Settings</p></Link>
        </li>
        {/* <li>
          <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
        <li>
          <Link to={ROUTES.SIGN_OUT}>Sign Out</Link>
        </li> */}
      </ul>
    );
  }
}
