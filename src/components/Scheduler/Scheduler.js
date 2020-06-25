import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import './Scheduler.css';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import Confirmation from '../Confirmation/Confirmation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router-dom';
import MyConsults from '../MyConsults/MyConsults';

const currentDate = '2020-06-22';
const schedulerData = [
  { startDate: '2020-06-22T10:30', endDate: '2020-06-22T11:00', title: 'Consult' },
  { startDate: '2020-06-24T15:30', endDate: '2020-06-24T16:00', title: 'Consult' },
  { startDate: '2020-06-24T16:00', endDate: '2020-06-24T16:30', title: 'Consult' }
];

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
      redirectTo: null
    }
    this.myAppointment = this.myAppointment.bind(this);
    this._onButtonClick = this._onButtonClick.bind(this);
  }

  _onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }

  myAppointment(props) {
    return <Appointments.Appointment {...props} onClick={() => {
      let result = window.confirm("Confirm booking?");
      console.log(result);
      if (result) {
       this.setState({ redirectTo: true });
      } 
    }}/>
  }

    render() {
      
        if (this.state.redirectTo) {
          return <Redirect to='/MyConsults' />;
        }

        return (    
          <div>      
            <Paper>
              <Scheduler
                data={schedulerData}
              >
                <ViewState
                  currentDate={currentDate}
                />
                <WeekView
                  startDayHour={8}
                  endDayHour={20}
                />
                <Appointments appointmentComponent={this.myAppointment} />
              </Scheduler>
            </Paper>
            {this.state.showComponent ?
              <Confirmation path="/MyConsults" message="Do you want to confirm booking?" /> 
              :
              null
            }
          </div>);
    }
} 
