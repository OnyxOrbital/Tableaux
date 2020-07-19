import React from 'react';
import './Notifications.css';
import {Link} from 'react-router-dom';
import notificationIcon from '../../../images/notification.gif';
import { withFirebase } from '../../Firebase/index';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      notifications: []
    }
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
  }

  // async componentDidMount() {
  //   console.log('called compdidmount')
  //   let notifications = [];
  //   if (this.props.firebase.auth.currentUser) {
  //     let ref = this.props.firebase.databse.ref('users')
  //       .child(this.props.firebase.auth.currentUser.uid)
  //       .child('notifications');
  //     let snapshot = await ref.once('value');
  //     let value = snapshot.val();
  //     console.log(value)
  //     if (value) { //if snapshot is not empty
  //       console.log('Object.values(value)', Object.values(value))
  //       notifications.push(Object.values(value));
  //     }
  //   }
  //   this.setState({ notifications: notifications })
  // }

  closeNotification() {
    this.setState({ open: false });
  }

  async handleNotificationClick() {
    console.log('clicked')
    let notifications = [];
    if (this.props.firebase.auth.currentUser) {
      let ref = this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('notifications');
      let snapshot = await ref.once('value');
      let value = snapshot.val();
      console.log(value)
      if (value) { //if snapshot is not empty
        console.log('Object.values(value)', Object.values(value))
        notifications.push(Object.values(value));
      }
    }
    console.log('notis', notifications)
    if (notifications && notifications.length !== 0) {
      this.setState({ notifications: notifications[0] })
    }
    
    // if (this.state.open) {
    //   this.setState({ open: false });
    // } else {
    //   this.setState({ open: true });
    // }

    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div className="notifications">
        <button onClick={this.handleNotificationClick} className="notificationButton">
          <img src={notificationIcon} alt=''></img>
          <p>Notifications</p>
        </button>
        { this.state.open ? 
          <div className="dropdownContent">{
            this.state.notifications.map(notif => {
              return <Link to={notif.type} className="notification" onClick={this.closeNotification}>[{new Date(notif.time).toLocaleDateString()} {new Date(notif.time).toLocaleTimeString()}] {notif.message}</Link> 
            })}
          </div> : null }
        {/* {this.state.open ? <div className="dropdownContent">
          <Link to="/MyConsults" className="notification">New Booking from -name- !</Link>
          <Link to="/MyConsults" className="notification">Consultation with -name- cancelled by -name- :(</Link>
          <Link to="/MyConsults"  className="notification">Consultation with -name- confirmed by -name- !</Link>
          <Link to="/SharedTimetables"  className="notification">-name- shared their timetable with you as -identity-!</Link>
        </div> : null} */}
      </div>);
  }
}

export default withFirebase(Notifications);