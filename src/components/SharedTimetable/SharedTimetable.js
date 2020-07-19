import React from 'react';
import './SharedTimetable.css';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase/index';

class SharedTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.getSharedData = this.getSharedData.bind(this);
    this.readPeopleWhoSharedTheirTTWithMe = this.readPeopleWhoSharedTheirTTWithMe.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  readPeopleWhoSharedTheirTTWithMe() {
    let peopleWhoSharedTheirTTWithMeuid = [];
    if (this.props.firebase.auth.currentUser) {
      // retrieve array of uids
      this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('peopleWhoSharedTheirTTWithMe')
        .on('value', function(snapshot) {
          console.log(snapshot.val())
          
          if (snapshot.val()) {
            console.log(Object.values(snapshot.val())[0])
            peopleWhoSharedTheirTTWithMeuid.push([Object.values(snapshot.val())[0]]);
          }
        })
      console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)
      peopleWhoSharedTheirTTWithMeuid = this.getSharedData(peopleWhoSharedTheirTTWithMeuid);
      
    }

    return peopleWhoSharedTheirTTWithMeuid;
  }

  // retrieve appointments from each uid if the array is not empty
  getSharedData(peopleWhoSharedTheirTTWithMeuid) {
    console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)
    let results = [];
    // check if array is not empty
    if (peopleWhoSharedTheirTTWithMeuid && peopleWhoSharedTheirTTWithMeuid !== []) {
      // loop through each uid in array to retrieve [username, appointmentsArr]
      peopleWhoSharedTheirTTWithMeuid.forEach(user => {
        console.log(user)
        let username = null;
        let appointmentsArr = [];

        // NOTE : user[0] might require mapping instead
        this.props.firebase.database.ref('users')
        .child(user[0].uid)
        .on('value', function(snapshot) {
          console.log('snapshot.val()', snapshot.val())
          if (snapshot.val()) {
            username = snapshot.val().username;
            if (snapshot.val().appointments) {
              appointmentsArr.push(Object.values(snapshot.val().appointments.appointmentsArr));
              results.push([username, user[0].uid, appointmentsArr[0], user[0].sharedAs]);
              console.log("results push", [username, user[0].uid, appointmentsArr[0], user[0].sharedAs])
            } else {
              results.push([username, user.uid, appointmentsArr, user.sharedAs]);

            }
          }
        })

      })
    }

    console.log("results", results)
    return results;
  }

  handleDelete(uid) {
    console.log('uid', uid)
    this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('peopleWhoSharedTheirTTWithMe')
      .once('value', snapshot => {
        snapshot.forEach(child => {
          console.log(child.val())
          if (child.val().uid === uid) {
            child.ref.remove();
          }
        })
      });

    this.props.firebase.database.ref('users')
      .child(uid)
      .child('peopleISharedMyTTWith')
       .once('value', snapshot => {
        snapshot.forEach(child => {
          console.log(child.val())
          if (child.val().uid === this.props.firebase.auth.currentUser.uid) {
            child.ref.remove();
          }
        })
      });
  }

  renderTableData(userList) {
    return userList.map((user, key) => {
      return (
        <tr id={key}>
          <td className="shared-td">
            <Link to={{
              pathname: `/SharedTimetables/${user[0].replace(/\s/g, "")}`,
              props: {
                displayedData: user[2],
                username: user[0],
                uid: user[1],
                sharedAs: user[3]
                }
              }}>{user[0]}</Link>
              <button onClick={() => this.handleDelete(user[1])}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </button>
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
                <tr >{this.renderTableHeader()}</tr>
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
