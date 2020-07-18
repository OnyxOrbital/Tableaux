import React from 'react';
import { withFirebase } from '../Firebase/index';
import './ShareAsDialog.css';
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
    this.handleTA = this.handleTA.bind(this);
    this.handleStudent = this.handleStudent.bind(this);
    this.addPeopleISharedMyTTWith = this.addPeopleISharedMyTTWith.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
  }

  componentDidMount() {
    this.handleClickOpen();
    this.setState({ event: this.props.event });
    console.log("here at componentdidmount")
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

  handleStudent() {
    this.setState({
      setOpen: false
    });

    this.addPeopleISharedMyTTWith("Student");
  }

  handleTA() {
    this.setState({
      setOpen: false
    });

    this.addPeopleISharedMyTTWith("TA");
  }

  saveEvent(event) {
    this.setState({ event: event });
  }

  // writes user chosen in share search bar into "peopleISharedMyTTWith" database
  async addPeopleISharedMyTTWith(sharedAs){
    console.log("addpeopleisharedmyttwith", sharedAs)
    console.log("this.props.event", this.props.event)

    if (this.state.event) {
      let uid = null;

      //Query data for uid of user you want to share TT with
      this.props.firebase.database.ref('users')
        .orderByChild("username")
        .equalTo(this.state.event).on("value", function(snapshot) {
          uid = Object.keys(snapshot.val())[0];
          console.log("new uid", uid)
        })


      // if uid you chose is not your uid
      if (uid !== this.props.firebase.auth.currentUser.uid) {

        console.log("i reached here")
        // check if uid you chose already exists in your database
        let ref = this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child('peopleISharedMyTTWith');
        let snapshot = await ref.once('value');
        let value = snapshot.val();
        // console.log('val', value)
        // console.log('!value.hasOwnProperty(uid)',  !Object.values(value).includes(uid))
        if (!value || !Object.values(value).includes(uid)) {
          // write to database of user
          this.props.firebase.database.ref('users')
          .child(this.props.firebase.auth.currentUser.uid)
          .child('peopleISharedMyTTWith')
          .push(uid)

          // write to database to the user whom you shared your TT with
          this.props.firebase.database.ref('users')
          .child(uid)
          .child('peopleWhoSharedTheirTTWithMe')
          .push([this.props.firebase.auth.currentUser.uid, sharedAs])
        }
      }
    }
  }

  render() {
    return (
      <div>
        <Dialog open={this.state.setOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle style={{backgroundColor: '#212636', zIndex: '10'}} id="form-dialog-title">Share Your Timetable</DialogTitle>
          <DialogContent style={{backgroundColor: '#40444f', zIndex: '10', height:'100px'}}>
            <DialogContentText style={{color: '#e2dce3'}}>
              What do you want to share your timetable as?
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: '#212636', zIndex: '10'}}>
            <button id="cancel" onClick={this.handleStudent}>
              Student
            </button>
            <button id="confirm" onClick={this.handleTA}>
              TA
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withFirebase(ShareDialog);
