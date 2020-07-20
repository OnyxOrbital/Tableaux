import React from 'react';
import './Module.css';
import { withFirebase } from '../../Firebase';

class Module extends React.Component {
  constructor(props) {
    super(props);
    this.removeModule = this.removeModule.bind(this);
  }

  //add remove module function
  /*remove from appointmentsArr in database, 
  and remove from modsData in database */
  removeModule() {
    this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('appointments')
      .child('appointmentsArr')
      .once('value', snapshot => {
        snapshot.forEach(child => {
          console.log(child.val().title)
          if (child.val().title === this.props.module) {
            child.ref.remove();
          }
        })
      });
      this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('appointments')
      .child('modsData')
      .child(this.props.module)
      .remove()
  }
  
  render() {
    return(
      <div className="Module-information">
        <h3>{this.props.module}</h3>
        <button onClick={this.removeModule}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
      </div>
    );
  }
}

export default withFirebase(Module);