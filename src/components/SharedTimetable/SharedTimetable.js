import React from 'react';
import './SharedTimetable.css';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase/index';

class SharedTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleWhoSharedTheirTTWithMeuid: [],
      myDisplayedData: []
    }
    this.getSharedData = this.getSharedData.bind(this);
    // this.readPeopleWhoSharedTheirTTWithMe = this.readPeopleWhoSharedTheirTTWithMe.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onSharedTimetableChange = this.onSharedTimetableChange.bind(this);

    if (this.props.firebase.auth.currentUser) {
      this.ref = this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('peopleWhoSharedTheirTTWithMe')
      this.ref.on('value', this.onSharedTimetableChange)
    }
  }

  onSharedTimetableChange(snapshot) {
    console.log("got to sharedTiemtableChange")
    let peopleWhoSharedTheirTTWithMeuid = [];
    if (snapshot.val()) {
      peopleWhoSharedTheirTTWithMeuid.push([Object.values(snapshot.val())[0]]);
    }
    peopleWhoSharedTheirTTWithMeuid = this.getSharedData(peopleWhoSharedTheirTTWithMeuid);
    this.setState({ peopleWhoSharedTheirTTWithMeuid: peopleWhoSharedTheirTTWithMeuid});
  }

  async componentDidMount() {
    let peopleWhoSharedTheirTTWithMeuid = [];
    let myDisplayedData = [];
    if (this.props.firebase.auth.currentUser) {
      // retrieve array of uids
      let ref = this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('peopleWhoSharedTheirTTWithMe');
      let snapshot = await ref.once('value');
      let value = snapshot.val();
      console.log(value)
      if (value) {
        console.log(Object.values(snapshot.val())[0])
        peopleWhoSharedTheirTTWithMeuid.push([Object.values(value)[0]]);
      }
      console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)
      peopleWhoSharedTheirTTWithMeuid = await this.getSharedData(peopleWhoSharedTheirTTWithMeuid);

      let ref2 = this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('appointments')
        .child('appointmentsArr');
      let snapshot2 = await ref2.once('value');
      let value2 = snapshot2.val();
      if (value2) {
        console.log('snapshot stuff', Object.values(value2))
        myDisplayedData.push(Object.values(value2));
      }
    }
    console.log('peopleWhoSharedTheirTTWithMeuid after getshareddata', peopleWhoSharedTheirTTWithMeuid)
    this.setState({
      peopleWhoSharedTheirTTWithMeuid: peopleWhoSharedTheirTTWithMeuid,
      myDisplayedData: myDisplayedData
    });
  }

  // retrieve appointments from each uid if the array is not empty
  async getSharedData(peopleWhoSharedTheirTTWithMeuid) {
    console.log('peopleWhoSharedTheirTTWithMeuid', peopleWhoSharedTheirTTWithMeuid)
    let results = [];
    // check if array is not empty
    if (peopleWhoSharedTheirTTWithMeuid && peopleWhoSharedTheirTTWithMeuid !== []) {
      // loop through each uid in array to retrieve [username, appointmentsArr]
      peopleWhoSharedTheirTTWithMeuid.forEach(async user => {
        console.log(user)
        let username = null;
        let appointmentsArr = [];
        // NOTE : user[0] might require mapping instead
        console.log('user[0].uid', user[0].uid)
        let ref = this.props.firebase.database.ref('users')
                .child(user[0].uid)
        let snapshot = await ref.once('value');
        let value = snapshot.val();
        console.log('value', value)
        if (value) {
          username = value.username;
          if (value.appointments) {
            console.log(value.appointments.appointmentsArr)
            appointmentsArr.push(Object.values(value.appointments.appointmentsArr));
            results.push([username, user[0].uid, appointmentsArr[0], user[0].sharedAs]);
            console.log("results push", [username, user[0].uid, appointmentsArr[0], user[0].sharedAs])
          } else {
            results.push([username, user[0].uid, [], user[0].sharedAs]);
          }
        }
      })
    }
    console.log("results", results)
    return results;
  }

  handleDelete(uid) {
    // console.log('uid', uid)
    let result = window.confirm("Are you sure you want to delete?");
    if (result) {
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

  }

  renderTableData(userList) {
    console.log('userlist', userList)
    return userList.map((user, key) => {
      console.log('user', user)
      return (
        <tr id={key}>
          <td className="shared-td">
            <Link to={{
              pathname: `/SharedTimetables/${user[0].replace(/\s/g, "")}`,
              props: {
                displayedData: user[2],
                username: user[0],
                uid: user[1],
                sharedAs: user[3],
                myDisplayedData: this.state.myDisplayedData
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
    let userList = this.state.peopleWhoSharedTheirTTWithMeuid;
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
