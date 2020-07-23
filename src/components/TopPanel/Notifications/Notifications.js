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
    this.deleteNotification = this.deleteNotification.bind(this);
    this.onNotificationsChange = this.onNotificationsChange.bind(this);

    if (this.props.firebase.auth.currentUser) {
      this.ref = this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('notifications');
      this.ref.on('value', this.onNotificationsChange)
    }
  }

  onNotificationsChange(snapshot) {
    console.log('called on notif chnage')
    let notifications = [];
    if (snapshot.val() !== null) {
      notifications.push(snapshot.val());
    }
    this.setState({ notifications: notifications });
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

  deleteNotification(time) {
    this.props.firebase.database.ref('users')
    .child(this.props.firebase.auth.currentUser.uid)
    .child('notifications')
    .once('value', snapshot => {
      snapshot.forEach(child => {
        console.log(child.val().time)
        if (child.val().time === time) {
          child.ref.remove();
        }
      })
    });

    let ref = this.props.firebase.database.ref('users')
    .child(this.props.firebase.auth.currentUser.uid)
    .child('notifications');
    ref.on('value', this.onNotificationsChange);
  }

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
    if (this.props.firebase.auth.currentUser) {
      console.log("this.state.notifications", this.state.notifications)
      return (
        <div className="notifications">
          <button onClick={this.handleNotificationClick} className="notificationButton">
            <img src={notificationIcon} alt=''></img>
            <p>Notifications</p>
          </button>
          { this.state.open ?
            <div className="dropdownContent">{
              this.state.notifications.length > 0 ?
                this.state.notifications.reverse().map(notif => {
                  return (
                    <div className="notification">
                        <div className="time-and-close-div">
                          <p className="timestamp">[{new Date(notif.time).toLocaleDateString()} {new Date(notif.time).toLocaleTimeString()}]</p>
                          <button time={notif.time} className="close-button" onClick={() => this.deleteNotification(notif.time)}><i time={notif.time} className="fa fa-times" aria-hidden="true"></i></button>
                        </div>
                        <Link to={notif.type} onClick={this.closeNotification}>
                      <p>{notif.message}</p>
                      <hr className="notification-line"/></Link>
                    </div>
                  );
                })
              : <p id="no-notif">No Notifications</p>
            }
            </div> : null }
        </div>);
    } else {
      return (
        <button onClick={() => { window.alert("You are not signed in :(") }} className="notificationButton">
          <img src={notificationIcon} alt=''></img>
          <p>Notifications</p>
        </button>
      )
    }

  }
}

export default withFirebase(Notifications);
