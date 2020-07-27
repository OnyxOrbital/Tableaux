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
  AllDayPanel,
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
  return <Toolbar.Root {...restProps} style={{ backgroundColor: '#171a24'}} />
};

const DateNavButtons = ({ classes, ...restProps }) => {
  return <DateNavigator.NavigationButton  { ...restProps}  className="date-nav-buttons" style={{ color: 'white', margin: '0.25rem'}}/>
};

const DateNavRootComponent = ({ classes, ...restProps }) => {
  return <DateNavigator.Root { ...restProps}  className="date-nav" navigationButtonComponent={DateNavButtons} />
};

const allDayCell = ({ classes, ...restProps }) => {
  return <AllDayPanel.Cell { ...restProps} style={{ backgroundColor: '#171a24'}}/>
};

const allDayTitleCell = ({ classes, ...restProps }) => {
  return <AllDayPanel.TitleCell { ...restProps} style={{ backgroundColor: '#171a24'}}/>
};


class OtherTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayedData: [],
      myDisplayedData: [],
      compare: false,
      username: null,
      uid: null,
      titles: [],
      redirectTo: null,
      consultData: null,
      sharedAs: null,
      modsColor: ['#95AAE0', '#af82b8', '#d47d7d', '#7bc6c7', '#b6b88d', '#e8c26f', '#a63f3f', '#8a8674'],
    }
    this.indexOfModule = this.indexOfModule.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.containsModule = this.containsModule.bind(this);
    this.handleCompareClick = this.handleCompareClick.bind(this);
    this.readFromOtherTimetableDB = this.readFromOtherTimetableDB.bind(this);
    this.authListener = this.props.firebase.auth.onAuthStateChanged(
      (authUser) => {
        if(authUser) {
          this.readFromOtherTimetableDB()
        }
      })
  }


  handleCompareClick() {
    this.setState({ compare: !this.state.compare });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('called should comp update')
  //   if (!nextProps.location.props) {
  //     console.log("if block next props", nextProps)
  //     return false;
  //   } else {
  //     console.log("else block next props", nextProps)
  //     return true;
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   console.log('called comp will receive props')
  //   if (nextProps.location.props) {
  //     console.log('props is not null')
  //     let oldUsername = this.state.username;
  //     let newUsername = nextProps.location.props.username;
  //     if (oldUsername !== newUsername ) {
  //       console.log("username change")
  //       let displayedData = Object.values(nextProps.location.props)[0];
  //       let uid = nextProps.location.props.uid;
  //       let titles = [];
  //       let sharedAs = nextProps.location.props.sharedAs;
  //       let myDisplayedData = nextProps.location.props.myDisplayedData;

  //       displayedData.forEach(appointment => {
  //           // if mod is not in titles array
  //           if (!titles.includes(appointment.title)) {
  //             titles.push(appointment.title);
  //           }
  //       })

  //       // if shared as TA, loop through each appointment in displayedData to filter out non-mods
  //       if (sharedAs === "TA") {
  //         let newdd = [];
  //         displayedData.forEach(appointment => {
  //           // if appointment is a consult slot
  //           if (appointment.title.toLowerCase() === "consult" || appointment.title.toLowerCase() === "consultation") {
  //             newdd.push(appointment);
  //           }
  //         })

  //         displayedData = newdd;
  //       }

  //       this.setState({
  //         displayedData: displayedData,
  //         username: newUsername,
  //         uid: uid,
  //         titles: titles,
  //         myDisplayedData: myDisplayedData,
  //         sharedAs: sharedAs
  //       })
  //     }
  //   }
  // }

  async componentDidMount() {
    console.log('called compdidmount')
    if (this.props.location.props) {
      console.log('if block other tt', this.props.location.props)
      let username = this.props.location.props.username;
      console.log("dd comp did mount", this.props.location.props.displayedData)
      // console.log("dd comp did mount", Object.values(this.props.location.props.displayedData))
      let displayedData = [];
      if (this.props.location.props.displayedData.length > 0) {
        displayedData = Object.values(this.props.location.props)[0];
      }
      console.log('dd hereee', displayedData)
      let uid = this.props.location.props.uid;
      let titles = [];
      let sharedAs = this.props.location.props.sharedAs;
      let myDisplayedData = this.props.location.props.myDisplayedData;

      if (displayedData.length > 0) {
        displayedData.forEach(appointment => {
          // if mod is not in titles array
          if (!titles.includes(appointment.title)) {
            titles.push(appointment.title);
          }
      })
      }

      // if shared as TA, loop through each appointment in displayedData to filter out non-mods
      if (sharedAs === "TA" && displayedData.length > 0) {
        let newdd = [];
        displayedData.forEach(appointment => {
          // if appointment is a consult slot
          if (appointment.title.toLowerCase() === "consult" || appointment.title.toLowerCase() === "consultation") {
            newdd.push(appointment);
          }
        })
        displayedData = newdd;
      }

      if (displayedData && displayedData.length > 0) {
        displayedData = displayedData.map(slot => {
          if (slot.title.toLowerCase() === "consult" || slot.title.toLowerCase() === "consultation" || !slot.lessonType) {
            if (slot.rRule) {
              return {
                title: slot.title,
                startDate: slot.startDate,
                endDate: slot.endDate,
                rRule: slot.rRule,
                exDate: slot.exDate,
                user: "user1",
                id: slot.id
              }
            } else {
              return {
                title: slot.title,
                startDate: slot.startDate,
                endDate: slot.endDate,
                user: "user1",
                id: slot.id,
              }
            }
          } else {
            if (slot.id) { // if slot has an id
              return {
                title: slot.title,
                startDate: slot.startDate,
                endDate: slot.endDate,
                lessonType: slot.lessonType,
                classNo: slot.classNo,
                rRule: slot.rRule,
                exDate: slot.exDate,
                user: "user1",
                id: slot.id,
             }
            } else {
              return {
                title: slot.title,
                startDate: slot.startDate,
                endDate: slot.endDate,
                lessonType: slot.lessonType,
                classNo: slot.classNo,
                rRule: slot.rRule,
                exDate: slot.exDate,
                user: "user1"
              }
            }
          }
        })
      }

      console.log("myDD before change", myDisplayedData)
      if (myDisplayedData[0] && myDisplayedData[0].length !== 0) {
        myDisplayedData = myDisplayedData[0].map(slot => {
          console.log('slot', slot)
          console.log("slot.title", slot.title)
          if (slot.title.toLowerCase() === "consult" || slot.title.toLowerCase() === "consultation" || !slot.lessonType) {
            if (slot.rRule) {
              return {
                title: slot.title,
                startDate: slot.startDate,
                endDate: slot.endDate,
                rRule: slot.rRule,
                exDate: slot.exDate,
                user: "user2"
             }
            } else {
              return {
                title: slot.title,
                startDate: slot.startDate,
                endDate: slot.endDate,
                user: "user2"
             }
            }
          } else {
            return {
              title: slot.title,
              startDate: slot.startDate,
              endDate: slot.endDate,
              lessonType: slot.lessonType,
              classNo: slot.classNo,
              rRule: slot.rRule,
              exDate: slot.exDate,
              user: "user2"
           }
        }})

      }

      console.log("displayeddata asdawd", displayedData)
      console.log("myDD ", myDisplayedData)

      if (this.props.firebase.auth.currentUser) {
        // write to OtherTimetable database to store state (so that when rerendering, data is not lost)
        this.props.firebase.database.ref('users')
        .child(this.props.firebase.auth.currentUser.uid)
        .child("other-timetable")
        .set({
          displayedData: displayedData,
          username: username,
          uid: uid,
          titles: titles,
          myDisplayedData: myDisplayedData,
          sharedAs: sharedAs
        })
      }

      console.log("set state mydd", myDisplayedData)
      console.log("set state dd", displayedData)
      
      this.setState({
        displayedData: displayedData,
        username: username,
        uid: uid,
        titles: titles,
        myDisplayedData: myDisplayedData,
        sharedAs: sharedAs
      });
    } else {
      // console.log('else block')

      // if (this.props.firebase.auth.currentUser) {
      //   console.log('user')
      //   // read from OtherTimetable database
      //   let ref = this.props.firebase.database.ref('users')
      //     .child(this.props.firebase.auth.currentUser.uid)
      //     .child("other-timetable")
      //   let snapshot = await ref.once("value");
      //   let value = snapshot.val();
      //   if (value) {
      //     console.log('val.dd', value.displayedData)
      //     this.setState({
      //       displayedData: value.displayedData,
      //       username: value.username,
      //       uid: value.uid,
      //       titles: value.titles,
      //       myDisplayedData: value.myDisplayedData,
      //       sharedAs: value.sharedAs
      //     })
      //   }
    }
  }

  async readFromOtherTimetableDB() {
    console.log('user')
    // read from OtherTimetable database
    let ref = this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child("other-timetable")
    let snapshot = await ref.once("value");
    let value = snapshot.val();
    if (value) {
      console.log('val.dd', value.displayedData)
      this.setState({
        displayedData: value.displayedData,
        username: value.username,
        uid: value.uid,
        titles: value.titles,
        myDisplayedData: value.myDisplayedData,
        sharedAs: value.sharedAs
      })
    }
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
    if (this.state.compare) { // if compare function is activated
      let current = props.data.user;
      if (current === "user1") {
        background = '#7bc6c7';
      } else {
        background = '#d47d7d';
      }
    } else {
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

                    // write to notifications database for user whom shared their timetable with you
                    this.props.firebase.database.ref('users')
                    .child(this.state.uid)
                    .child('notifications')
                    .push({
                      time: new Date().toString(),
                      type: '/MyConsults',
                      message: `New Booking from ${this.props.firebase.auth.currentUser.displayName}!`
                    })
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
    let myDisplayedData = this.state.myDisplayedData;

    let finalDisplayedData = [];
    if (myDisplayedData && myDisplayedData.length > 0 && displayedData) {
      // console.log("length of myDD", myDisplayedData.length)
      // console.log("length of DD", displayedData.length)
      // console.log('concat', displayedData.concat(myDisplayedData))
      finalDisplayedData = displayedData.concat(myDisplayedData);
    }
    if (this.state.redirectTo) {
      return <Redirect to={{
        pathname: '/MyConsults'
      }}/>;
    }

    return (
      <div>
        <h1>{this.state.username}'s Timetable [{this.state.sharedAs}]</h1>
        <ThemeProvider theme={theme}>
          <Paper>
            <Scheduler
              data={this.state.compare
                      ? finalDisplayedData
                      : displayedData}
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
              />
              <Toolbar
                rootComponent={ToolbarRoot}
              />
              <DateNavigator
                rootComponent={DateNavRootComponent}/>
              <Appointments appointmentComponent={this.myAppointment} />
              <AppointmentForm />
              <AllDayPanel
                cellComponent={allDayCell}
                titleCellComponent={allDayTitleCell}
              />
            </Scheduler>
          </Paper>
        </ThemeProvider>
        { this.state.compare
          ? <button onClick={this.handleCompareClick}>Revert to default</button>
          : <button onClick={this.handleCompareClick}>Compare</button> }
      </div>);
  }
}

export default withFirebase(OtherTimetable);
