import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import './Timetable.css';
import {
  Scheduler,
  WeekView,
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

//Hard coded data
const currentDate = '2020-06-22';

//Table class
class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      displayedData: [],
      addedAppointment: {},
      appointmentChanges: {},
      editingAppointmentId: undefined,
      redirectTo: null,
      consultData: null,
      isEditing: false,
      modsColor: ['#95AAE0', '#CB70DD', '#D17373', '#bd814d', '#CC5688', '#6E59A7', '#63B586', '#891F1F', '#897F54'],
      modTitles: [],
      isDataLoaded: false,
    }
    this.indexOfModule = this.indexOfModule.bind(this);
    this.containsModule = this.containsModule.bind(this);
    this.replaceSlot = this.replaceSlot.bind(this);
    this.showAlternatives = this.showAlternatives.bind(this);
    this.process = this.process.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.saveAppointmentsToDatabase = this.saveAppointmentsToDatabase.bind(this);
    // this.readData = this.readData.bind(this);
    this.saveModsData = this.saveModsData.bind(this);
  }

  // checks if event.data.title is contained in array of modules
  containsModule(title, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title === title) {
        return true;
      }
    }

    return false;
  }

  myAppointment(props) {
    let background = '';
    let titles = this.props.modules;
    console.log("titles", titles)
    let colors = this.state.modsColor;
    // console.log(colors);
    let current = props.data.title;
    if (current === 'Consult') {
      background = '#7D7684';
      // background = '#bd814d';
    } else if (this.indexOfModule(current, titles) < colors.length) {
     background = colors[this.indexOfModule(current, titles)];
     console.log("index of module", this.indexOfModule(current, titles))
    //  console.log('title includes current')
    } else { // if no more colors to assign
      background = colors[titles.length % colors.length];
      console.log("modding color", titles.length % colors.length)
      // console.log('modulo block')
    }

    return <Appointments.Appointment {...props} style={{backgroundColor: background}}
      onClick={(event) => {
        if (this.state.isEditing) {
          if (event.data.title.toLowerCase() !== "consult" || event.data.title.toLowerCase() !== "consultation") {
            let displayedData = this.replaceSlot(event.data.title, event.data.lessonType, event.data);
            this.setState({
              displayedData: displayedData,
              isEditing: false
            });
          }
        } else {
          // converts title to lowercase for uniformity
          if (event.data.title.toLowerCase() === "consult" || event.data.title.toLowerCase() === "consultation") {
            // pop up confirm booking dialog
            let result = window.confirm("Confirm booking?");
            if (result) {
              // console.log('event.data', event.data)
              // redirects user to MyConsults page

              this.setState({
                redirectTo: true,
                consultData: event.data
              });
            }
          } else if (!this.containsModule(event.data.title, this.props.modules)) { // for slots that are not modules nor consults
            // the code has yet to be implemented
          } else { // for mod slots, shows alternative slots
          let alternatives = this.showAlternatives(event.data.title, event.data.lessonType, event.data.classNo);
            this.setState({
              displayedData: this.state.displayedData.concat(alternatives),
              isEditing: true
            })
          }
      }
    }} />
  }

  // finds index of title in modules arr
  indexOfModule(title, modules) {
    let index = 0
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].value === title) {
        index = i;
      }
    }

    return index;
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { displayedData } = state;
      if (added) {
        const startingAddedId = displayedData.length > 0 ? displayedData[displayedData.length - 1].id + 1 : 0;
        displayedData = [...displayedData, { id: startingAddedId, ...added }];
      }
      if (changed) {
        displayedData = displayedData.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        displayedData = displayedData.filter(appointment => appointment.id !== deleted);
      }
      return { displayedData };
    });
  }

  // helps update dipslayed data whenever mods are added in myModules
  componentWillReceiveProps(nextProps) {
    // if data is updated (i.e mod added)
    if (nextProps.data !== this.state.data || nextProps.displayedData !== this.state.displayedData) {
      console.log("cwrp if block")
      console.log("next props dd", nextProps.displayedData)
      let displayedData = nextProps.displayedData;
      let newData = nextProps.data;
      let modTitles = this.state.modTitles;

      let modKeys = Object.keys(newData);

      console.log("modKeys", modKeys)
      //loop through data, if there are mods in data that
      //is not in dd, push mod to dd (and modTitles)
      console.log("displayedData", displayedData)
      modKeys.forEach(key => { //for each mod in new data
        let isIndd = false;
        displayedData.forEach(slot => {
          if (slot.title === key) {
            isIndd = true;
          }
        })
        if (!isIndd) {
          console.log("newData[key]", newData[key])
          displayedData.push(newData[key]);
          modTitles.push(key)
      })

      console.log("final modTitles", modTitles)
      displayedData = this.process(displayedData);

      // modKeys.forEach(key => {
      //   if (!this.containsModule(key, displayedData)) {
      //     modTitles.push(key)
      //   }
      // })

      console.log("now displayed data", displayedData)
      this.setState({
        data: newData,
        displayedData: displayedData,
        modTitles: modTitles
      });
    }
  }


  // process(lessons) {
  //   let result = []; // array of selected lesson slots to be shown
  //   let modulekeys = Object.keys(lessons); //arr of mod keys
  //   modulekeys.forEach(module => { //for each module array
  //     let lessonTypekeys = Object.keys(lessons[module]);
  //     lessonTypekeys.forEach(lessonType => { //for each lesson type
  //       let classNokeys = Object.keys(lessons[module][lessonType]);
  //         result = result.concat(lessons[module][lessonType][classNokeys[0]]); //concat first class no into result
  //     })
  //   })
  //   return result;
  // }


  // helps update dipslayed data whenever mods are added in myModules
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.lessons !== this.state.data) {
  //     let displayedData = this.state.displayedData;
  //     let data = this.state.data;
  //     let newData = nextProps.lessons;
  //     let modTitles = this.state.modTitles;

  //     let modKeys = Object.keys(newData);
  //     console.log('modKeys', modKeys)
  //     console.log("displayed data", displayedData)
  //     modKeys.forEach(key => { //for each mod in new data
  //       // seems like theres a problem with displayedData keys
  //       if (!displayedData.hasOwnProperty(key)) {
  //         console.log('push mod to displayeddata')
  //         displayedData.push(newData[key]);
  //         console.log("after push dd", displayedData)
  //         modTitles.push(key)
  //       }
  //     })
  //     console.log("in compwillreceive b4 process", displayedData)
  //     displayedData = this.process(displayedData);
  //     console.log("in compwillreceive after process", displayedData)
  //     data.push(newData)
  //     this.setState({
  //       data: data,
  //       displayedData: displayedData,
  //       modTitles: modTitles
  //     });
  //   }
  // }

  /*Returns duplicated time slots. Not sure if problem is here or in comp will receive props
  input correct, output has extra array of the same module. Only when we add another mod. When
  we only add 1 mod it works fine.*/
  process(lessons) {
    let result = []; // array of selected lesson slots to be shown
    let modulekeys = Object.keys(lessons); //arr of mod keys
    modulekeys.forEach(module => { //for each module array
      let lessonTypekeys = Object.keys(lessons[module]);
      if (lessonTypekeys[0] !== "endDate" && lessonTypekeys[0] !== "startDate" && lessonTypekeys[0] !== "classNo") { // if data has not been processed
        lessonTypekeys.forEach(lessonType => { //for each lesson type
          let classNokeys = Object.keys(lessons[module][lessonType]);
          console.log("if block",lessons[module][lessonType][classNokeys[0]])
            result = result.concat(lessons[module][lessonType][classNokeys[0]]); //concat first class no into result
            console.log("result", result)
          })
        }
     else {
        console.log("else block", lessons[module])
        result = result.concat(lessons[module]);
      }
    })
    return result;
  }

  showAlternatives(modCode, lessonType, classNo) {
    console.log('data', this.state.data)
    let newdata = this.state.data[modCode][lessonType]; //arr with classNos

    let keys = Object.keys(newdata); //arr of classNo keys
    let result = [];
    keys.forEach(key => { //get rid of keys
      if (key !== classNo) { // prevent duplicate slot
        result = result.concat(newdata[key]);
      }
    })

    return result;
  }

  // replaces all alternatives with a slot that is chosen by user
  replaceSlot(modCode, lessonType, eventData) {
    let lessons = this.state.displayedData;
    let displayedData = [];
    let changed = false;
    for (let i = 0; i < lessons.length; i++) {
      // check if slot chosen matches the modcode and lessontype
      if (!changed && lessons[i].title === modCode && lessons[i].lessonType === lessonType) {
        displayedData.push(eventData);
        changed = true;
      } else if (lessons[i].title === modCode && lessons[i].lessonType === lessonType){
      } else {
        displayedData.push(lessons[i]);
      }
    }

    return displayedData;
  }

  // readData() {
  //   console.log("before reading data", this.state.displayedData)
  //   let appointments = [];
  //   let data = [];
  //   let snapshotIsEmpty = false;
  //   if (this.props.firebase.auth.currentUser) {
  //     let ref = this.props.firebase.user(this.props.firebase.auth.currentUser.uid).child('appointments');
  //     ref.on('value', function(snapshot) {
  //       console.log('dd snapshot.val()', snapshot.val())
  //       if (snapshot.val()) { //if snapshot is not empty
  //         snapshotIsEmpty = true;  //snapshot is not empty
  //         appointments.push(Object.values(snapshot.val()));
  //       }
  //     });

  //     ref.child('modsData').on('value', function(snapshot) {
  //       console.log('data snapshot.val()', snapshot.val())
  //       if (snapshot.val()) { //if snapshot is not empty
  //         snapshotIsEmpty = true;  //snapshot is not empty
  //         data.push(snapshot.val());
  //       }
  //     });

  //     if (!snapshotIsEmpty) { //if snapshot is empty, finish loading
  //       console.log('snapshot is empty', snapshotIsEmpty) //loads before snapshot loads
  //       this.setState({
  //         isDataLoaded: true
  //       })
  //     } else if (appointments[0] && (appointments !== []) && data) { //if snapshot is not empty
  //       console.log('snapshot is not empty-data', data[0])
  //       console.log('snapshot is not empty-dd',  Object.values(appointments[0][0]))

  //       let modulekeys = Object.keys(data[0]); //arr of mod keys
  //       let data2 = [];
  //       modulekeys.forEach(module => { //for each module array
  //         console.log("module", module)
  //         let lessonTypekeys = Object.keys(data[0][module]);
  //         console.log("lessonTypekeys", lessonTypekeys)
  //           lessonTypekeys.forEach(lessonType => { //for each lesson type
  //           console.log('lessonType', lessonType)
  //           let classNokeys = Object.keys(data[0][module][lessonType]);
  //           console.log("classNokeys", classNokeys)
  //           classNokeys.forEach(classNo => {
  //             console.log('classNo', classNo)
  //             let arr = Object.values(data[0][module][lessonType][classNo]);
  //             console.log('arr', arr)
  //             if (!data2.hasOwnProperty(module)) {
  //               data2[module] = [];
  //               data2[module][lessonType] = [];
  //             } else if (!data2[module].hasOwnProperty(lessonType)) {
  //               data2[module][lessonType] = [];
  //             }
  //             data2[module][lessonType][classNo] = [];
  //             data2[module][lessonType][classNo] = data2[module][lessonType][classNo].concat(Object.values(arr));
  //           });
  //         });
  //       })
  //       console.log('data', data2)
  //       this.setState({
  //         displayedData: Object.values(appointments[0][0]),
  //         isDataLoaded: true,
  //         data: data2
  //       })
  //     }
  //   }
  // }

  saveAppointmentsToDatabase() {
    console.log("displayeddata to save", this.state.displayedData)
    //reseting the database first
    this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
      .child('appointments').child('appointmentsArr')
      .set({});

    let displayedData = this.state.displayedData;

    //looping through this.state.data and adding apppointments into db
    displayedData.map(appointment => {
      if (!appointment.classNo) {
        this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
        .child('appointments').child('appointmentsArr')
        .push({
          startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
          endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
          title: appointment.title,
        });
      } else {
        this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
        .child('appointments').child('appointmentsArr')
        .push({
          startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
          endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
          title: appointment.title,
          lessonType: appointment.lessonType,
          classNo: appointment.classNo
        });
      }
    });
    this.saveModsData();
    console.log("after save", this.state.displayedData)
  }

  saveModsData() {
    console.log("data to save", this.state.data)
    let data = this.state.data;
    this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
      .child('appointments').child('modsData')
      .set({});

    let modulekeys = Object.keys(data); //arr of mod keys
    modulekeys.forEach(module => { //for each module array
      let lessonTypekeys = Object.keys(data[module]);
      lessonTypekeys.forEach(lessonType => { //for each lesson type
        let classNokeys = Object.keys(data[module][lessonType]);
        classNokeys.forEach(classNo => {
          let arr = data[module][lessonType][classNo];
          for (let i = 0; i < arr.length; i++) {
            this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
            .child('appointments').child('modsData').child(module).child(lessonType).child(classNo)
            .push({
              startDate: JSON.stringify(arr[i].startDate).replace(/^"(.*)"$/, '$1'),
              endDate: JSON.stringify(arr[i].endDate).replace(/^"(.*)"$/, '$1'),
              title: module,
              lessonType: lessonType,
              classNo: classNo
            });
          }

        })
      })
    })
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{
        pathname: '/MyConsults',
        consult: {
          name: 'Lian Chiu',
          title: this.state.consultData.title,
          startDate: this.state.consultData.startDate,
          endDate: this.state.consultData.endDate,
          status: 'Pending'
        }
      }}/>;
    }

    return (
      <div>
        <div className="buttons-div">
            <button onClick={this.saveAppointmentsToDatabase} className="save-button"><i className="fa fa-save"></i>Save</button>
            {/* <button onClick={this.readData} className="refresh-button"><i className="fa fa-refresh"></i>Refresh appointments</button> */}
          </div>
        <ThemeProvider theme={theme}>
          <Paper>
            <Scheduler
              data={this.state.displayedData}
              height={660}
            >
              <ViewState
                currentDate={currentDate}
              />
              <EditingState
                onCommitChanges={this.commitChanges}
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
      </div>);
  }
}

export default withFirebase(Table);
