import React from 'react';
import './SharedTimetable.css';
import { Link } from 'react-router-dom';
import SharedUsers from './SharedUsers';
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
          console.log('snap.val', snapshot.val())
          peopleWhoSharedTheirTTWithMeuid.push(Object.values(snapshot.val())[0]);
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
    if (peopleWhoSharedTheirTTWithMeuid && peopleWhoSharedTheirTTWithMeuid != []) {
      console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)
      // loop through each uid in array to retrieve [username, appointmentsArr]
      peopleWhoSharedTheirTTWithMeuid.forEach(uid => {
        console.log("uid", uid)
        let username = null;
        let appointmentsArr = [];
        this.props.firebase.database.ref('users')
        .child(uid)
        .on('value', function(snapshot) {
          console.log('snap.val', snapshot.val())
          username = snapshot.val().username;
          appointmentsArr.push(Object.values(snapshot.val().appointments.appointmentsArr));
          results.push([username, appointmentsArr[0]]);
        })
        console.log('username', username)
        console.log('appt arr', appointmentsArr[0])
      })
      console.log('results', results)
    }
    return results;
  }
  
  render() {
    return (
        // <div className="sharedTimetables">
        //     <h2>Shared Timetables</h2>
        //     <div className="sharedList">
        //         <table>
        //         <thead>
        //             <tr>
        //             <th>Name</th>
        //             <th>Identity</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             <tr className="evenRow">
        //                 <td><Link className="link" to="/SharedTimetables/LianChiu">Lian Chiu</Link></td>
        //                 <td>TA</td>
        //             </tr>
        //             <tr className="oddRow">
        //             <td><a className="link">Benson Lee</a></td>
        //             <td>TA</td>
        //             </tr>
        //             <tr className="evenRow">
        //             <td><a className="link">Michelle Goh</a></td>
        //             <td>Student</td>
        //             </tr>
        //             <tr className="oddRow">
        //             <td><a className="link">Jamie Ferguson</a></td>
        //             <td>Student</td>
        //             </tr>
        //         </tbody>
        //         </table>
        //     </div>
        // </div>
      <div className="sharedTimetables">
          <h2>Shared Timetables</h2>
          <SharedUsers users={this.readPeopleWhoSharedTheirTTWithMe()}/>
      </div>
    );
  }
}

export default withFirebase(SharedTimetable);