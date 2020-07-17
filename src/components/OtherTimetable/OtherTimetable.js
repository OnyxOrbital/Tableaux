import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import './OtherTimetable.css';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  AppointmentForm,
  ConfirmationDialog
} from '@devexpress/dx-react-scheduler-material-ui';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { withFirebase } from '../Firebase';

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

//Styles space above timetable (toolbar)
const ToolbarRoot = ({ classes, ...restProps }) => {
  return <Toolbar.Root {...restProps} style={{backgroundColor: '#171a24'}} />
};

class OtherTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedData: [],
      username: null,
      uid: null,
      titles: [],
      redirectTo: null,
      consultData: null,
      modsColor: ['#95AAE0', '#af82b8', '#d47d7d', '#7bc6c7', '#b6b88d', '#e8c26f', '#a63f3f', '#8a8674'],
    }
    this.indexOfModule = this.indexOfModule.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.containsModule = this.containsModule.bind(this);
  }

  componentDidMount() {
    let username = this.props.location.props.username;
    let displayedData = Object.values(this.props.location.props)[0];
    let uid = this.props.location.props.uid;
    let titles = [];
    // let sharedAs = this.props.location.props.sharedAs;

    displayedData.forEach(appointment => {
        // if mod is not in titles array
        if (!titles.includes(appointment.title)) {
          titles.push(appointment.title);
        }
    })

    // if shared as TA, loop through each appointment in displayedData to filter out non-mods
    // if (sharedAs === "TA") {
    //   let newdd = [];
    //   displayedData.forEach(appointment => {
    //     // if appointment is a consult slot
    //     if (appointment.title.toLowerCase() === "consult" || ppointment.title.toLowerCase() === "consultation") {
    //       newdd.push(appointment);
    //     }
    //   })
    //
    //   displayedData = newdd;
    // }

    this.setState({
      displayedData: displayedData,
      username: username,
      uid: uid,
      titles: titles
    })
  }

  // checks if event.data.title is contained in array of modules
  containsModule(title, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === title) {
        return true;
      }
    }
    return false;
  }

  myAppointment(props) {
    let background = '';
    let titles = this.state.titles;
    let colors = this.state.modsColor;
    let current = props.data.title;
    if (current.toLowerCase() === 'consult' || current.toLowerCase() === 'consultation') {
      background = '#847d8a';
    } else if (!this.containsModule(current, titles)) { // neither consult nor mod
      background = '#9e7d5f';
    } else if (this.indexOfModule(current, titles) < colors.length) {
     background = colors[this.indexOfModule(current, titles)];
    } else { // if no more colors to assign
      background = colors[titles.length % colors.length];
    }

    return <Appointments.Appointment {...props} style={{backgroundColor: background}}
      onClick={(event) => {
          // converts title to lowercase for uniformity
          if (event.data.title.toLowerCase() === "consult" || event.data.title.toLowerCase() === "consultation") {
            // pop up confirm booking dialog
            let result = window.confirm("Confirm booking?");
            if (result) {
              let ref = this.props.firebase.database.ref('users')
              .child(this.props.firebase.auth.currentUser.uid)
              .child("MyConsults");

              ref.orderByChild("startDate").equalTo(event.data.startDate).once("value",
                snapshot => {
                  if(!snapshot.exists()) {
                    //if no clashing consult slots, store consult data into user database under "MyConsults"
                    ref.push({
                      uid: this.state.uid,
                      username: this.state.username,
                      startDate: event.data.startDate,
                      endDate: event.data.endDate,
                      status: 'Pending',
                      identity: 'TA'
                    });
                    this.writeToMyConsults(event);
                  } else { //has clashing consult slot
                    window.alert("You cannot book a consult at this timing!")
                  }});

              // redirects user to MyConsults page
              this.setState({
                redirectTo: true,
                consultData: event.data
              });
            }
          }
      }}
      onDoubleClick={() => { }}
    />
  }

  // write to the database of the uid user (user's timetable you're viewing)
  writeToMyConsults(event) {
    this.props.firebase.database.ref('users')
      .child(this.state.uid)
      .child("MyConsults")
      .push({
        uid: this.props.firebase.auth.currentUser.uid,
        username: this.props.firebase.auth.currentUser.displayName,
        startDate: event.data.startDate,
        endDate: event.data.endDate,
        status: 'Pending',
        identity: 'Student'
      });
  }

  // finds index of title in modules arr
  indexOfModule(title, modules) {
    let index = 0
    for (let i = 0; i < modules.length; i++) {
      if (modules[i] === title) {
        index = i;
      }
    }

    return index;
  }

  render() {
    let displayedData = this.state.displayedData;
    if (this.state.redirectTo) {
      return <Redirect to={{
        pathname: '/MyConsults'
      }}/>;
    }

    return (
      <div>
        <h1>{this.state.username}'s Timetable</h1>
        <ThemeProvider theme={theme}>
          <Paper>
            <Scheduler
              data={displayedData}
              height={660}
            >
              <ViewState
                defaultCurrentDate={new Date()}
              />
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
              <Toolbar
                rootComponent={ToolbarRoot}
              />
              <DateNavigator />
              <Appointments appointmentComponent={this.myAppointment} />
              <AppointmentForm />
            </Scheduler>
          </Paper>
        </ThemeProvider>
      </div>);
  }
}

export default withFirebase(OtherTimetable);
