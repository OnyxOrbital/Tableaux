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

  render(){
    return (
      <div>
        <div className="consultsList">
        <h2>My Consults</h2>

        {this.state.consults ? (<table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Identity</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Remarks</th>
              <th></th>
            </tr>
            {this.state.consults.map(consult => {
                 return <Consult consult={consult} />
             })}
          </tbody>
        </table>) : <p style={{color: 'red'}}>You have no consults, you should start booking one :)</p> }

      </div>
      </div>
    );
  }
}

export default withFirebase(MyConsults);