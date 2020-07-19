import React from 'react';
import './MyConsults.css';
import { withFirebase } from '../Firebase/index';
class MyConsults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consults: []
    }
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    let newConsults = [];
    if (this.props.firebase.auth.currentUser) {
      let ref = this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('MyConsults')
      let snapshot = await ref.once('value');
      let value = snapshot.val();
      if (value) {
        newConsults.push(Object.values(snapshot.val()));
      }
      if (newConsults) {
        this.setState({ consults: newConsults[0] });
      }
    }  
  }

  handleCancel(uid, startDate, endDate) {
    console.log('uid', uid)
    this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('MyConsults')
      .once('value', snapshot => {
        snapshot.forEach(child => {
          console.log(child.val())
          if (child.val().uid === uid 
            && child.val().startDate === startDate
            && child.val().endDate === endDate) {
            child.ref.remove();
          }
        })
      });

    this.props.firebase.database.ref('users')
      .child(uid)
      .child('MyConsults')
       .once('value', snapshot => {
        snapshot.forEach(child => {
          console.log(child.val())
          if (child.val().uid === this.props.firebase.auth.currentUser.uid
              && child.val().startDate === startDate
              && child.val().endDate === endDate) {
            child.ref.remove();
          }
        })
      });
    
    // write to notifications database for user whom you booked a consult with
    this.props.firebase.database.ref('users')
    .child(uid)
    .child('notifications')
    .push({
      time: new Date().toString(),
      type: '/MyConsults',
      message: `Consultation with ${this.props.firebase.auth.currentUser.displayName} is cancelled by ${this.props.firebase.auth.currentUser.displayName} :(`
    })
  }

  handleAccept(uid) {
    // write to notifications database for user whom you booked a consult with
    this.props.firebase.database.ref('users')
    .child(uid)
    .child('notifications')
    .push({
      time: new Date().toString(),
      type: '/MyConsults',
      message: `Consultation with ${this.props.firebase.auth.currentUser.displayName} is confirmed! :)`
    })
  }

  handleDecline(uid) {
    // write to notifications database for user whom you booked a consult with
    this.props.firebase.database.ref('users')
    .child(uid)
    .child('notifications')
    .push({
      time: new Date().toString(),
      type: '/MyConsults',
      message: `Consultation with ${this.props.firebase.auth.currentUser.displayName} is declined :(`
    })
  }

  renderTableData(consults) {
    return consults.map((slot, key) => {
       return (
          <tr id={key}>
             <td>{slot.username}</td>
             <td>{slot.identity}</td>
             <td>{new Date(slot.startDate).toDateString()} {new Date(slot.startDate).toLocaleTimeString()}</td>
             <td>{new Date(slot.endDate).toDateString()} {new Date(slot.endDate).toLocaleTimeString()}</td>
             <td className="status">{slot.status}</td>
             {slot.identity === "Student" ?
                (<div>
                  <td><button onClick={() => this.handleAccept(slot.uid)}>Accept</button><button onClick={() => this.handleDecline(slot.uid)}>Decline</button></td>
                </div>):
                (<td><button onClick={() => this.handleCancel(slot.uid, slot.startDate, slot.endDate)}>Cancel</button></td>)
              }
          </tr>
       )
    })
 }

 renderTableHeader() {
    return (
    <tr>
      <th>Name</th>
      <th>Identity</th>
      <th>Start Time</th>
      <th>End Time</th>
      <th>Status</th>
      <th></th>
    </tr>);
}
  render(){
    if (this.props.firebase.auth.currentUser) {
      return (
        <div>
          <h1>My Consults</h1>
          <div className="consultsList">
            {this.state.consults && this.state.consults.length > 0 ? (
              <table className="consults-table">
                <tbody>
                  {this.renderTableHeader()}
                  {this.renderTableData(this.state.consults)}
                </tbody>
              </table>) 
            : (<div>
              <table className="consults-table">
                <tbody>
                  {this.renderTableHeader()}
                </tbody>
              </table>
              <p style={{textAlign: 'center', color: '#e8007c'}}>No consults to show :(</p>
            </div>) }
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>My Consults</h1>
          <div className="consultsList">
            <table className="consults-table">
              <tbody>
                {this.renderTableHeader()}
              </tbody>
            </table>
            <p style={{textAlign: 'center', color: '#e8007c'}}>Please sign in to use this function.</p>
          </div>
        </div>
      );
    }
  }
}

export default withFirebase(MyConsults);