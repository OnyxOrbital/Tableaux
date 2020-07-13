import React from 'react';
import './MyConsults.css';
// import ConsultList from './ConsultList/ConsultList';
import Consult from './Consult/Consult';
import { withFirebase } from '../Firebase/index';

class MyConsults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consults: []
    }
  }

  componentDidMount() {
    let newConsults = [];
    if (this.props.firebase.auth.currentUser) {
      this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('MyConsults')
      .on('value', function(snapshot) {
        newConsults.push(Object.values(snapshot.val()))
      })
      if (newConsults) {
        console.log('newconsults', newConsults[0])
        this.setState({ consults: newConsults[0] });
      }
    }  
  }

  renderTableData(consults) {
    return consults.map((slot, key) => {
       return (
          <tr id={key}>
             <td>{slot.username}</td>
             <td>{slot.identity}</td>
             <td>{slot.startDate}</td>
             <td>{slot.endDate}</td>
             <td className="status">{slot.status}</td>
             {slot.identity === "Student" ?
                (<div>
                  <td><button>Accept</button><button>Decline</button></td>
                </div>):
                (<td><button>Cancel</button></td>)
              }
          </tr>
       )
    })
 }

 renderTableHeader(consults) {
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
    return (
      <div>
        <h1>My Consults</h1>
        <div className="consultsList">
          {this.state.consults ? (
            <table className="consults-table">
              <tbody>
                {this.renderTableHeader(this.state.consults)}
                {this.renderTableData(this.state.consults)}
              </tbody>
            </table>) 
          : <p style={{color: 'red'}}>You have no consults, you should start booking one :)</p> }
        </div>
      </div>
    );
  }
}

export default withFirebase(MyConsults);