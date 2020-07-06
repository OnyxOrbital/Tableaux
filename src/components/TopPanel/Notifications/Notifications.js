import React from 'react';
import './Notifications.css';
import notificationIcon from '../../../images/notification.gif';

export class Notifications extends React.Component {
  render() {
    return (
      <div className="notifications">
        <button className="notificationButton">
          <img src={notificationIcon} alt=''></img>
          <p>Notifications</p>
        </button>
        <div className="dropdownContent">
          <a href="myConsults.html" className="notification">New Booking!</a>
          <a href="myConsults.html" className="notification">Booking cancelled!</a>
          <a href="myConsults.html" className="notification">Booking confirmed!</a>
        </div>
      </div>);
  }
}