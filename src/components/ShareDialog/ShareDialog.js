import React from 'react';
import { withFirebase } from '../Firebase/index';
import './ShareDialog.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ShareSearchBar from '../ShareSearchBar/ShareSearchBar';
import ShareAsDialog from '../ShareAsDialog/ShareAsDialog';

class ShareDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setOpen: false,
      event: null,
      openShareAsDialog: false
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleCloseCancel = this.handleCloseCancel.bind(this);
    this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
    // this.addPeopleISharedMyTTWith = this.addPeopleISharedMyTTWith.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
  }

  handleClickOpen() {
    if (this.props.firebase.auth.currentUser) {
      this.setState({
        setOpen: true
      });
    } else {
      window.alert("Please sign in to use this function.");
    }
  }

  handleCloseCancel() {
    this.setState({
      setOpen: false
    });
  }

  handleCloseConfirm() {
    this.setState({
      setOpen: false,
      openShareAsDialog: true
    });

    console.log("here at cancel")
    // return <ShareAsDialog setOpen="true" event={this.state.event.value} />

    // this.addPeopleISharedMyTTWith();
  }

  saveEvent(event) {
    this.setState({ event: event });
  }

  // writes user chosen in share search bar into "peopleISharedMyTTWith" database
  // async addPeopleISharedMyTTWith(){
  //
  //   if (this.state.event) {
  //     let uid = null;
  //
  //     //Query data for uid of user you want to share TT with
  //     this.props.firebase.database.ref('users')
  //       .orderByChild("username")
  //       .equalTo(this.state.event.value).on("value", function(snapshot) {
  //         uid = Object.keys(snapshot.val())[0];
  //       })
  //
  //     // if uid you chose is not your uid
  //     if (uid !== this.props.firebase.auth.currentUser.uid) {
  //       // check if uid you chose already exists in your database
  //       let ref = this.props.firebase.database.ref('users')
  //       .child(this.props.firebase.auth.currentUser.uid)
  //       .child('peopleISharedMyTTWith');
  //       let snapshot = await ref.once('value');
  //       let value = snapshot.val();
  //       // console.log('val', value)
  //       // console.log('!value.hasOwnProperty(uid)',  !Object.values(value).includes(uid))
  //       if (!value || !Object.values(value).includes(uid)) {
  //         // write to database of user
  //         this.props.firebase.database.ref('users')
  //         .child(this.props.firebase.auth.currentUser.uid)
  //         .child('peopleISharedMyTTWith')
  //         .push(uid)
  //
  //         // write to database to the user whom you shared your TT with
  //         this.props.firebase.database.ref('users')
  //         .child(uid)
  //         .child('peopleWhoSharedTheirTTWithMe')
  //         .push([this.props.firebase.auth.currentUser.uid, sharedAs])
  //       }
  //     }
  //   }
  // }

  render() {
    return (
      <div>
        <button className="share-button" onClick={this.handleClickOpen}>
          <i className="fa fa-share-alt"></i>
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

        { this.state.openShareAsDialog ? <ShareAsDialog setOpen="true" event={this.state.event.value} /> : <div /> }
      </div>
    );
  }
}

export default withFirebase(ShareDialog);
