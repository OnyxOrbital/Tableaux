import React from 'react';
import { withFirebase } from '../Firebase/index';
import './MoreInfoDialog.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class MoreInfoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setOpen: false,
      event: null
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.setState({ event: this.props.event });
    console.log("here at componentdidmount")
  }

  handleClickOpen() {
    this.setState({
      setOpen: true
    });
  }

  saveEvent(event) {
    this.setState({ event: event });
  }

  handleClose() {
    this.setState({
      setOpen: false
    });
  }

  render() {
    return (
      <div>
        <button id="info" className="info-button" onClick={this.handleClickOpen}>
          <i class="fa fa-info" aria-hidden="true"></i>
        </button>
        <Dialog open={this.state.setOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle style={{backgroundColor: '#212636', zIndex: '10'}} id="form-dialog-title">How To Use Your Timetable</DialogTitle>
          <DialogContent style={{backgroundColor: '#40444f', zIndex: '10', height:'150px'}}>
            <DialogContentText style={{color: '#e2dce3'}}>
              1. <strong>Double click</strong> any slot in timetable to create a slot
              <br/>
              2. for consultation slots, make sure it is <strong>ONLY</strong> labelled
                as <strong>“Consult”</strong> or <strong>“Consultation”</strong> (capitalization is not important
              <br/>
              3. Remember to <strong>save data</strong> before visiting other tabs
                or your schedule plans may be lost
              <br/>
              4. Click on <strong>“Refresh Data”</strong> to view saved data
              <br/>
              5. Click on <strong>“Share”</strong> button to share your timetable with others
              <br/>
              6. Click on <strong>“Trash”</strong> icon beside modules in <strong>“Your Modules”</strong> list to delete any modules you have added
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{backgroundColor: '#212636', zIndex: '10'}}>
            <button id="cancel" onClick={this.handleClose}>
              OK
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withFirebase(MoreInfoDialog);
