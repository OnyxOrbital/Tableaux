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
      openShareAsDialog: false,
      shareAs: 'Student'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleCloseCancel = this.handleCloseCancel.bind(this);
    this.handleTA = this.handleTA.bind(this);
    this.handleStudent = this.handleStudent.bind(this);
    this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
    this.addPeopleISharedMyTTWith = this.addPeopleISharedMyTTWith.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.getUIDs = this.getUIDs.bind(this);
    this.diffSharedAs = this.diffSharedAs.bind(this);
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
    });

    this.addPeopleISharedMyTTWith();
  }

  saveEvent(event) {
    this.setState({ event: event });
  }

  handleStudent() {
    this.setState({
      shareAs: 'Student'
    });
  }

  handleTA() {
    this.setState({
      shareAs: 'TA'
    });
  }

  getUIDs(arr) {
    console.log("getUids")
    let uids = [];
    arr.forEach(user => {
      console.log(user)
      uids.push(user[0]);
    })

    console.log("uids arr", uids)
    return uids;
  }

  diffSharedAs(arr, uid, sharedAs) {
    console.log("diffSharedAs")
    let result = false;
    arr.forEach(user => {
      if (user[0] === uid && user[1] !== sharedAs) {
        result = true;
      }
    })

    return result;
  }

  // writes user chosen in share search bar into "peopleISharedMyTTWith" database
  async addPeopleISharedMyTTWith(){
    console.log('called addpeople')
    let sharedAs = this.state.shareAs;

    if (this.state.event && sharedAs) {
      let uid = null;

      //Query data for uid of user you want to share TT with
      this.props.firebase.database.ref('users')
        .orderByChild("username")
        .equalTo(this.state.event.value).on("value", function(snapshot) {
          uid = Object.keys(snapshot.val())[0];
          // console.log("new uid", uid)
        })


      // if uid you chose is not your uid
      if (uid !== this.props.firebase.auth.currentUser.uid) {
        console.log('uid', uid)
        console.log('this.props.firebase.auth.currentUser.uid', this.props.firebase.auth.currentUser.uid)
        // check if uid you chose already exists in your database
        // let ref = this.props.firebase.database.ref('users')
        // .child(this.props.firebase.auth.currentUser.uid)
        // .child('peopleISharedMyTTWith');
        // let snapshot = await ref.once('value');
        // let value = snapshot.val();

        let ref = this.props.firebase.database.ref('users')
        .child(uid)
        .child('peopleWhoSharedTheirTTWithMe');
        let snapshot = await ref.once('value');
        let value = snapshot.val();
        console.log("value xxx", value)

        if (!value
            || !this.getUIDs(Object.values(value)).includes(this.props.firebase.auth.currentUser.uid)
            || this.diffSharedAs(Object.values(value), this.props.firebase.auth.currentUser.uid, sharedAs)) {
              console.log("new sharedAs", sharedAs)

          // write to database of user
          this.props.firebase.database.ref('users')
          .child(this.props.firebase.auth.currentUser.uid)
          .child('peopleISharedMyTTWith')
          .child(uid)
          .set({
            uid: uid,
            sharedAs: sharedAs})

          // write to database to the user whom you shared your TT with
          this.props.firebase.database.ref('users')
          .child(uid)
          .child('peopleWhoSharedTheirTTWithMe')
          .child(this.props.firebase.auth.currentUser.uid)
          .set({
            uid: this.props.firebase.auth.currentUser.uid,
            sharedAs: sharedAs})

          // write to notification database of user whom you shared your TT with
          this.props.firebase.database.ref('users')
          .child(uid)
          .child('notifications')
          .push({
            time: new Date().toString(),
            type: '/SharedTimetable',
            message: `${this.props.firebase.auth.currentUser.displayName} shared their timetable with you as ${sharedAs}!`
          })
        }
      }
    }
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
            <DialogContentText style={{color: '#e2dce3'}}>
              Select whether you would like to share as a TA or share as a student.
              Share as TA: only consult slots will be shared.
              Share as Student: all slots will be shared
            </DialogContentText>
            <button className="share-as-button" onClick={this.handleStudent} autoFocus>
              Share as Student
            </button>
            <button className="share-as-button" onClick={this.handleTA}>
              Share as TA
            </button>
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

        {/* { this.state.openShareAsDialog ? <ShareAsDialog setOpen="true" event={this.state.event.value} /> : <div /> } */}
      </div>
    );
  }
}

export default withFirebase(ShareDialog);
