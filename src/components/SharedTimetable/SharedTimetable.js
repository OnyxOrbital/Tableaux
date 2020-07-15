import React from 'react';
import './SharedTimetable.css';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase/index';

class SharedTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.getSharedData = this.getSharedData.bind(this);
    this.readPeopleWhoSharedTheirTTWithMe = this.readPeopleWhoSharedTheirTTWithMe.bind(this);
  }

  readPeopleWhoSharedTheirTTWithMe() {
    let peopleWhoSharedTheirTTWithMeuid = [];
    if (this.props.firebase.auth.currentUser) {
      // retrieve array of uids
      this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('peopleWhoSharedTheirTTWithMe')
        .on('value', function(snapshot) {
          if (snapshot.val()) {
            console.log('snap.val', snapshot.val())
            peopleWhoSharedTheirTTWithMeuid.push(Object.values(snapshot.val())[0]);
          }
        })
      console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)

      peopleWhoSharedTheirTTWithMeuid = this.getSharedData(peopleWhoSharedTheirTTWithMeuid);

    }

    return peopleWhoSharedTheirTTWithMeuid;
  }

  // retrieve appointments from each uid if the array is not empty
  getSharedData(peopleWhoSharedTheirTTWithMeuid) {
    let results = [];

    // check if array is not empty
    if (peopleWhoSharedTheirTTWithMeuid && peopleWhoSharedTheirTTWithMeuid !== []) {
      console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)
      // loop through each uid in array to retrieve [username, appointmentsArr]
      peopleWhoSharedTheirTTWithMeuid.forEach(uid => {
        console.log("uid", uid)
        let username = null;
        let appointmentsArr = [];
        this.props.firebase.database.ref('users')
        .child(uid)
        .on('value', function(snapshot) {
          // console.log('snap.val', snapshot.val())
          // console.log('snap val username', snapshot.val().username)
          // console.log("snap val appointments", Object.values(snapshot.val().appointments.appointmentsArr))
          if (snapshot.val()) {
            username = snapshot.val().username;
            if (snapshot.val().appointments) {
              // console.log("snap val appointments", Object.values(snapshot.val().appointments.appointmentsArr))
              appointmentsArr.push(Object.values(snapshot.val().appointments.appointmentsArr));
              results.push([username, uid, appointmentsArr[0]]);
            } else {
              results.push([username, uid, appointmentsArr]);
            }
          }
        })
        console.log('username', username)
        console.log('appt arr', appointmentsArr[0])
      })
      console.log('results', results)
    }
    return results;
  }

  renderTableData(userList) {
    console.log('rendertabledata', userList)
    return userList.map((user, key) => {
      return (
        <tr id={key}>
          <td>
            <Link to={{
              pathname: `/SharedTimetables/${user[0].replace(/\s/g, "")}`,
              props: {
                displayedData: user[2],
                username: user[0],
                uid: user[1]
                }
              }}>{user[0]}</Link>
          </td>
        </tr>)
    })
 }

 renderTableHeader() {
    return <th>Name</th>
}

  render() {
    let userList = this.readPeopleWhoSharedTheirTTWithMe();
    if (this.props.firebase.auth.currentUser) {
      if (userList && userList.length !== 0) {
        return (
          <div className="sharedTimetables">
              <h1>Shared Timetables</h1>
            <table className="sharedList">
              <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.renderTableData(userList)}
              </tbody>
            </table>
          </div>
        );
      } else {
        return (
          <div className="sharedTimetables">
              <h1>Shared Timetables</h1>
            <table className="sharedList">
              <tbody>
                <tr>{this.renderTableHeader()}</tr>
              </tbody>
            </table>
            <p style={{textAlign: 'center', color: '#e8007c'}}>No shared timetables to show :(</p>
          </div>
        );
      }
    } else {
      return (
        <div className="sharedTimetables">
            <h1>Shared Timetables</h1>
          <table className="sharedList">
            <tbody>
              <tr>{this.renderTableHeader()}</tr>
              <br />
              <p style={{textAlign: 'center', color: '#e8007c'}}>Please sign in to use this function.</p>
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default withFirebase(SharedTimetable);
