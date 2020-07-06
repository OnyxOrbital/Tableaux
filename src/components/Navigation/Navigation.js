import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import * as ROUTES from '../../constants/routes';
import yourTimetableIcon from '../../images/my-timetable-grey.gif';
import modulesIcon from '../../images/all-modules-grey.gif';
import sharedTimetablesIcon from '../../images/shared-timetables-grey.gif';
import myConsultationIcon from '../../images/my-consultations-grey.gif';
import settingsIcon from '../../images/settings-grey.gif';
import yourTimetableYellowIcon from '../../images/my-timetable.gif';
import modulesYellowIcon from '../../images/all-modules.gif';
import sharedTimetablesYellowIcon from '../../images/shared-timetables.gif';
import myConsultationYellowIcon from '../../images/my-consultations.gif';
import settingsYellowIcon from '../../images/settings-icon.gif';


export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   oldtimetablesrc: true
    // }
    this.changeBackground = this.changeBackground.bind(this);
    this.resetBackground = this.resetBackground.bind(this);
  }

  changeBackground = (e, image) => {
    // console.log('event', e);
    e.preventDefault();
    e.target.style.backgroundColor = '#171a24';
    e.target.style.color = '#F1C944';
    // e.target.getElementsByTagName("img").src = image;
    // this.setState({ oldtimetablesrc: "false" });
  }

  resetBackground = (e) => {
    // console.log('event blur', e);
    e.preventDefault();
    e.target.style.backgroundColor = 'rgb(33, 38, 54)';
    e.target.style.color = '#e2dce3';
  }

  render() {
    return (
      <ul className="navBar">
        <li className="navLink" onClick={(e) => this.changeBackground(e, yourTimetableYellowIcon)} onBlur={this.resetBackground}>
          <Link to={ROUTES.YOUR_TIMETABLE}><img className='icon' src={yourTimetableIcon} alt=''/><p>Your Timetable</p></Link>
        </li>
        <li className="navLink" onClick={(e) => this.changeBackground(e, modulesYellowIcon)} onBlur={this.resetBackground}>
          <Link to={ROUTES.MODULES}><img className='icon' src={modulesIcon} alt='' /><p>Modules</p></Link>
        </li>
        <li className="navLink" onClick={(e) => this.changeBackground(e, sharedTimetablesYellowIcon)} onBlur={this.resetBackground}>
          <Link to={ROUTES.SHARED_TIMETABLE}><img className='icon' src={sharedTimetablesIcon} alt='' /><p>Shared Timetables</p></Link>
        </li>
        <li className="navLink" onClick={(e) => this.changeBackground(e, myConsultationYellowIcon)} onBlur={this.resetBackground}>
          <Link to={ROUTES.MY_CONSULTS}><img className='icon' src={myConsultationIcon} alt='' /><p>My Consults</p></Link>
        </li>
        <li className="navLink" onClick={(e) => this.changeBackground(e, settingsYellowIcon)} onBlur={this.resetBackground}>
          <Link to={ROUTES.SETTINGS}><img className='icon' src={settingsIcon} alt='' /><p>Settings</p></Link>
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
