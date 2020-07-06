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
    type: 'dark',
    primary: {
      dark: '#171a24',
      main: 'rgb(33, 38, 54)',
      light: '#e2dce3',
    }
  }
});

const style = theme => ({
  normalCellDark: {
    backgroundColor: fade(theme.palette.primary.dark, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.dark, 0.8),
    }
  },
  normalCellLight: {
    backgroundColor: fade(theme.palette.primary.main, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.8),
    }
  },
  scaleDark: {
    backgroundColor: fade(theme.palette.primary.dark, 1),
  },
});

//Styling Timtable cells
const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDay() === 0 || date.getDay() === 2
  || date.getDay() === 4 || date.getDay() === 6) {
    return <WeekView.TimeTableCell {...restProps} className={classes.normalCellDark} />;
  } return <WeekView.TimeTableCell {...restProps} className={classes.normalCellLight}/>;
};

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

//Styling top header cells
const DayScaleCellBase = ({ classes, ...restProps }) => {
  return <WeekView.DayScaleCell {...restProps} className={classes.scaleDark} />;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

//Styling top header cells
const DayScaleEmptyCellBase = ({ classes, ...restProps }) => {
  return <WeekView.DayScaleEmptyCell {...restProps} className={classes.normalCellDark}/>;
};

const DayScaleEmptyCell = withStyles(style, { name: 'DayScaleEmptyCell' })(DayScaleEmptyCellBase);

//Styling left header layout
const TimeScaleLayoutBase = ({ classes, ...restProps }) => {
  return <WeekView.TimeScaleLayout {...restProps} style={{textColor: 'green'}} className={classes.scaleDark} />;
};

const TimeScaleLayout = withStyles(style, { name: 'TimeScaleLayout' })(TimeScaleLayoutBase);

//Styling left header labels
const TimeScaleLabelBase  = ({ classes, ...restProps }) => {
  return <WeekView.TimeScaleLabel {...restProps}  style={{textColor: 'green'}} className={classes.scaleDark}/>;
};

const TimeScaleLabel = withStyles(style, { name: 'TimeScaleLabel' })(TimeScaleLabelBase);

//Background color
const LayoutBase = ({ classes, ...restProps }) => {
  return <WeekView.Layout {...restProps} style={{backgroundColor: '#69616b'}} />
};

const Layout = withStyles(style, { name: 'Layout'})(LayoutBase);

//Hard coded data
const currentDate = '2020-06-22';

//Table class
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.lessons,
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
    return <Appointments.Appointment {...props} style={{backgroundColor: '#ffd736'}} onClick={(event) => {
      let result = window.confirm("Confirm booking?");
      if (result) {
        console.log(event.data)
       this.setState({ 
         redirectTo: true,
         lessonData: event.data });
      } 
    }}/>
  }

  commitChanges({ added, changed, deleted }) {
    console.log('called commit changes');
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
              data={this.props.lessons.concat(this.state.data)}
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
                layoutComponent={LayoutBase}
                excludedDays={[0]}
              />
              <ConfirmationDialog />
              <Appointments appointmentComponent={this.myAppointment} />
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
