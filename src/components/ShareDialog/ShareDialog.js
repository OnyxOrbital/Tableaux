import React from 'react';
import { withFirebase } from '../Firebase/index';
import './ShareDialog.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ShareSearchBar from '../ShareSearchBar/ShareSearchBar';

class ShareDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setOpen: false,
      event: null
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleCloseCancel = this.handleCloseCancel.bind(this);
    this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
    this.addPeopleISharedMyTTWith = this.addPeopleISharedMyTTWith.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
  }
  
  handleClickOpen() {
    this.setState({
      setOpen: true
    });
  }

  handleCloseCancel() {
    this.setState({
      setOpen: false
    });
  }

  handleCloseConfirm() {
    this.setState({
      setOpen: false
    });
    
    this.addPeopleISharedMyTTWith();
  }
  
  saveEvent(event) {
    this.setState({ event: event });
  }

  // writes user chosen in share search bar into "peopleISharedMyTTWith" database
  addPeopleISharedMyTTWith(){
    if (this.state.event) {
      let uid = null;
      //Query data for uid
      this.props.firebase.database.ref('users')
        .orderByChild("username")
        .equalTo(this.state.event.value).on("value", function(snapshot) {
          console.log('snapshot.val', Object.keys(snapshot.val())[0]);
          uid = Object.keys(snapshot.val())[0];
        })
        console.log("uid", uid);
      if (uid !== this.props.firebase.auth.currentUser.uid) {
        this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('peopleISharedMyTTWith')
        .push(uid)

        this.props.firebase.database.ref('users')
        .child(uid)
        .child('peopleWhoSharedTheirTTWithMe')
        .push(this.props.firebase.auth.currentUser.uid)
      }
    }
    //Write uid to 'peopleisharedmyttwith'
    console.log("current uid", this.props.firebase.auth.currentUser.uid)

  }
  
  render() {
    return (
      <div>
        <button id="share" onClick={this.handleClickOpen}>
          Share
        </button>
        <Dialog open={this.state.setOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle style={{backgroundColor: '#212636', zIndex: '10'}} id="form-dialog-title">Share Your Timetable</DialogTitle>
          <DialogContent style={{backgroundColor: '#40444f', zIndex: '10', height:'300px'}}>
            <DialogContentText style={{color: '#e2dce3'}}>
              Search for the user you would like to share your timetable with:
            </DialogContentText>
            <ShareSearchBar users={this.props.users} action={this.saveEvent}/>
          </DialogContent>
          <DialogActions style={{backgroundColor: '#212636', zIndex: '10'}}>
            <button id="cancel" onClick={this.handleCloseCancel}>
              Cancel
            </button>
            <button id="confirm" onClick={this.handleCloseConfirm}>
              Confirm
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withFirebase(ShareDialog);