import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import './Timetable.css';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import Confirmation from '../Confirmation/Confirmation';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

//For styling the timetable
const theme = createMuiTheme({
  palette: {
    third: {
      darker: '#171a24',
      lighter: 'rgb(33, 38, 54)',
      light: '#e2dce3'
    }
  },
});

const style = theme => ({
  normalCellDark: {
    backgroundColor: fade(theme.palette.third.darker, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.third.darker, 0.8),
    }
  },
  normalCellLight: {
    backgroundColor: fade(theme.palette.third.lighter, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.third.lighter, 0.8),
    }
  },
  scaleDark: {
    backgroundColor: fade('#454a6e', 1),
  },
});

//Styling Timtable cells
const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDay() === 0 || date.getDay() === 2
  || date.getDay() === 4) {
    return <WeekView.TimeTableCell {...restProps} className={classes.normalCellDark} />;
  } return <WeekView.TimeTableCell {...restProps} className={classes.normalCellLight}/>;
};

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

//Styling top header cells
const DayScaleCellBase = ({ classes, ...restProps }) => {
  return <WeekView.DayScaleCell {...restProps} style={{color: 'white',}} className={classes.scaleDark}/>;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

//Styling top header cells
const DayScaleEmptyCellBase = ({ classes, ...restProps }) => {
  return <WeekView.DayScaleEmptyCell {...restProps} className={classes.scaleDark}/>;
};

const DayScaleEmptyCell = withStyles(style, { name: 'DayScaleEmptyCell' })(DayScaleEmptyCellBase);

//Styling left header layout
const TimeScaleLayoutBase = ({ classes, ...restProps }) => {
  return <WeekView.TimeScaleLayout {...restProps} className={classes.scaleDark}/>;
};

const TimeScaleLayout = withStyles(style, { name: 'TimeScaleLayout' })(TimeScaleLayoutBase);

//Styling left header labels
const TimeScaleLabelBase  = ({ classes, ...restProps }) => {
  return <WeekView.TimeScaleLabel {...restProps} className={classes.scaleDark}/>;
};

const TimeScaleLabel = withStyles(style, { name: 'TimeScaleLabel' })(TimeScaleLabelBase);

//Hard coded data
const currentDate = '2020-06-22';
const schedulerData = [
  { startDate: '2020-06-22T10:30', endDate: '2020-06-22T11:00', title: 'Consult' },
  { startDate: '2020-06-24T15:30', endDate: '2020-06-24T16:00', title: 'Consult' },
  { startDate: '2020-06-24T16:00', endDate: '2020-06-24T16:30', title: 'Consult' }
];

//Table class
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: schedulerData,
      addedAppointment: {},
      appointmentChanges: {},
      editingAppointmentId: undefined,
      showComponent: false,
      redirectTo: null,
      lessonData: null
    }
    this.myAppointment = this.myAppointment.bind(this);
    this._onButtonClick = this._onButtonClick.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(this);
  }

  _onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }

  myAppointment(props) {
    return <Appointments.Appointment {...props} onClick={(event) => {
      let result = window.confirm("Confirm booking?");
      if (result) {
       this.setState({ 
         redirectTo: true,
         lessonData: event.data });
      } 
    }}/>
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        data = data.filter(appointment => appointment.id !== deleted);
      }
      return { data };
    });
  }

  changeAddedAppointment(addedAppointment) {
    this.setState({ addedAppointment });
  }

  changeAppointmentChanges(appointmentChanges) {
    this.setState({ appointmentChanges });
  }

  changeEditingAppointmentId(editingAppointmentId) {
    this.setState({ editingAppointmentId });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{
        pathname: '/MyConsults',
        consult: { 
          name: 'Lian Chiu',
          title: this.state.lessonData.title,
          startDate: this.state.lessonData.startDate,
          endDate: this.state.lessonData.endDate,
          status: 'Pending'
        }
      }}/>;
    }

    return (    
      <div>
        <ThemeProvider theme={theme}>
        <Paper>
          <Scheduler
            data={this.state.data}
            height={660}
          >
            <ViewState
              currentDate={currentDate}
            />
            <EditingState
              onCommitChanges={this.commitChanges}
              addedAppointment={this.state.addedAppointment}
              onAddedAppointmentChange={this.changeAddedAppointment}

              appointmentChanges={this.state.appointmentChanges}
              onAppointmentChangesChange={this.changeAppointmentChanges}

              editingAppointmentId={this.state.editingAppointmentId}
              onEditingAppointmentIdChange={this.changeEditingAppointmentId}
            />
            <IntegratedEditing />
            <WeekView
              startDayHour={8}
              endDayHour={20}
              timeTableCellComponent={TimeTableCell}
              dayScaleCellComponent={DayScaleCell}
              timeScaleLayoutComponent={TimeScaleLayout}
              timeScaleLabelComponent={TimeScaleLabel}
              dayScaleEmptyCellComponent={DayScaleEmptyCell}
              excludedDays={[0]}
            />
            <ConfirmationDialog />
            <Appointments appointmentComponent={this.myAppointment} />
            <AppointmentTooltip
              showOpenButton
              showDeleteButton
            />
            <AppointmentForm />
          </Scheduler>
        </Paper>
        </ThemeProvider>
        {this.state.showComponent ?
          <Confirmation path="/MyConsults" message="Do you want to confirm booking?" /> 
          :
          null
        }
      </div>);
  }
} 
