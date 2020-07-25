import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState, IntegratedEditing } from '@devexpress/dx-react-scheduler';
import './Timetable.css';
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  AppointmentForm,
  ConfirmationDialog,
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

const ConfirmationButton = ({ classes, ...restProps }) => {
  return <ConfirmationDialog.Button { ...restProps} style={{color: 'white'}}/>
};

//Table class
class Table extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      displayedData: [],
      redirectTo: null,
      consultData: null,
      isEditing: false,
      classBeingEdited:[], //[modcode, lessontype, lesson slot object]
      modsColor: ['#95AAE0', '#af82b8', '#d47d7d', '#7bc6c7', '#b6b88d', '#e8c26f', '#a63f3f', '#8a8674'],
      modTitles: [],
      isDataLoaded: false,
    }
    this.checkIfConsultSlotIsInArr = this.checkIfConsultSlotIsInArr.bind(this);
    this.indexOfModule = this.indexOfModule.bind(this);
    this.containsModule = this.containsModule.bind(this);
    this.replaceSlot = this.replaceSlot.bind(this);
    this.showAlternatives = this.showAlternatives.bind(this);
    this.process = this.process.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.saveAppointmentsToDatabase = this.saveAppointmentsToDatabase.bind(this);
    this.saveModsData = this.saveModsData.bind(this);
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
    let titles = this.props.modules;
    let colors = this.state.modsColor;
    let current = props.data.title;
    if (!current) { //if no title is entered, put 'event' as default title
      current = 'Event';
      props.data.title = 'Event';
    }
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
        let current = event.data.title;
        if (!current) {
          current = 'Event';
        }
        if (this.state.isEditing &&
          current === this.state.classBeingEdited[0] &&
          event.data.lessonType === this.state.classBeingEdited[1]) {
          if (current.toLowerCase() !== "consult" || current.toLowerCase() !== "consultation") {
            let displayedData = this.replaceSlot(current, event.data.lessonType, event.data);
            this.setState({
              displayedData: displayedData,
              isEditing: false
            });
          }
        } else if (this.state.isEditing) {
            let displayedData = this.replaceSlot(this.state.classBeingEdited[0], this.state.classBeingEdited[1], this.state.classBeingEdited[2]);
            this.setState({
              displayedData: displayedData,
              isEditing: false,
              classBeingEdited: []
            });
        } else {
          if (current.toLowerCase() === "consult" || current.toLowerCase() === "consultation" || !this.containsModule(current, this.props.modules)) { // for slots that are not modules nor consults
            // the code has yet to be implemented
            // event.onDoubleClick();
          } else { // for mod slots, shows alternative slots
          let alternatives = this.showAlternatives(current, event.data.lessonType, event.data.classNo);
            this.setState({
              displayedData: this.state.displayedData.concat(alternatives),
              isEditing: true,
              classBeingEdited: [event.data.title, event.data.lessonType, event.data]
            })
          }
      }
    }} />
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

  checkIfConsultSlotIsInArr(arr, consult) {
    let inArr = false;
    console.log("consult start date", consult.startDate)
    console.log("consult end date", consult.endDate)
    for (let i = 0; i < arr.length; i++) {
      let slot = arr[i];
      console.log('slot.startDate', slot.startDate)
      if (slot.title.toLowerCase() === "consult" || slot.title.toLowerCase() === "consultation") {
        if ((slot.startDate === consult.startDate && slot.endDate === consult.endDate)
        || (slot.startDate === consult.startDate.toJSON() && slot.endDate === consult.endDate.toJSON())
        || (slot.startDate.toString() === consult.startDate.toString() && slot.endDate.toString() === consult.endDate.toString())) {
          console.log('inArr')
          inArr = true;
        }
      }
    }

    return inArr;
  }

  commitChanges({ added, changed, deleted }) {
    console.log('this is deleted ', deleted)
    this.setState((state) => {
      let { displayedData } = state;
      if (added) {
        console.log("dd added", displayedData)
        console.log("added", added)
        const startingAddedId = displayedData.length > 0 ? displayedData.length + 1  : 0;
        if (added.title.toLowerCase() === "consult" || added.title.toLowerCase() === "consultation") {
            if (!this.checkIfConsultSlotIsInArr(displayedData, added)) {
              console.log('if block', this.checkIfConsultSlotIsInArr(displayedData, added))
              displayedData = [...displayedData, { id: startingAddedId, ...added }];
            } else {
              window.alert("Sorry, you cannot add a duplicate consultation slot.");
            }
        // } else if (added.lessonType) {
        //   window.alert("Sorry, you cannot edit a module.");
        } else {
          displayedData = [...displayedData, { id: startingAddedId, ...added }];
        }
      }
      
      if (changed) {
        console.log('changed', changed)
        displayedData = displayedData.map(appointment => {
          console.log('appt id', appointment.id)
          console.log("changed appointment", appointment)
          console.log("changed[appointment.id]", changed[appointment.id])
          return changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment});
      }

      // if (changed) {
      //   console.log("changed", changed)
      //   console.log("displayed data changed", displayedData)
      //   let dataToBeRemoved = false;

      //   displayedData = displayedData.map(appointment => {
      //     console.log('appointment', appointment)
      //     console.log("changed[appointment.id]", changed[appointment.id])
      //     // changed[appointment.id] is defined when appointment.id is undefined
      //     console.log("appointment.lessonType", appointment.lessonType)
      //     console.log("appointment.id", Number.isNaN(appointment.id))
      //     if (appointment.lessonType && !changed[appointment.id] && Number.isNaN(appointment.id)) {
      //       window.alert("Sorry, you cannot edit a module.");
      //       // dataToBeRemoved = true;
      //       console.log("{ ...appointment, ...changed[appointment.id] }", { ...appointment, ...changed[appointment.id] })
      //       return {startDate: null, endDate: null, title: null};
      //     } else {
      //       console.log("{ ...appointment, ...changed[appointment.id] }", { ...appointment, ...changed[appointment.id] })
      //       return changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment;
      //     }
      //   });

        // if the data changed is a mod, then we should remove that change
        // if (dataToBeRemoved) {
        //   displayedData.splice(displayedData.length - 1);
        // }
      //   console.log("displayed data after changed", displayedData)
      // }
      if (deleted !== undefined) {
        console.log("before dd deleted", displayedData)
        displayedData = displayedData.filter(appointment => appointment.id !== deleted);
        console.log("after dd deleted", displayedData)
      }
      console.log("now dd", displayedData)
      return { displayedData };
    });
  }

  componentDidMount() {
    let displayedData = this.state.displayedData;
    let displayedDataFromDB = this.props.dd; //displayed data from database (after refresh)
    let newData = this.props.data; //big data array from both database and unsaved mods
    let newDataKeys = Object.keys(newData);
    let modTitles = this.state.modTitles; //used for coloring
    let additionalModsToProcess = [];

    //loop through data, if there are mods in data that
    //is not in dd, push mod to dd (and modTitles)
      newDataKeys.forEach(modCode => { //for each mod in new data
        let isIndd = false;
        displayedDataFromDB.forEach(slot => {
          if (slot.title === modCode) {
            isIndd = true;
          }
        })
        if (!isIndd) {
          additionalModsToProcess.push(newData[modCode]);
          modTitles.push(modCode)
        }
      })
      additionalModsToProcess = this.process(additionalModsToProcess);
      
      displayedDataFromDB = displayedDataFromDB.concat(additionalModsToProcess);
      console.log("displayeddatafromdb dawd", displayedDataFromDB)
      console.log("dd before change", displayedData)
      displayedData = displayedData.concat(displayedDataFromDB);
      displayedData.forEach(data => {
        if (!data.lessonType) { //consult or event slot
          if (!this.checkIfConsultSlotIsInArr(displayedDataFromDB, data)) {
            displayedDataFromDB.push(data);
          }
        }
      });
      console.log('final displayed data',displayedDataFromDB)
      this.setState({
        data: newData,
        displayedData: displayedDataFromDB,
        modTitles: modTitles
      });
  }

  // helps update dipslayed data whenever mods are added in myModules
  componentWillReceiveProps(nextProps) {
    console.log('called compwillreceiveprops');
    // if data or displayeddata is updated (i.e mod added from search bar or from database)
    if (nextProps.data !== this.state.data || nextProps.dd !== this.state.displayedData) {
      let displayedData = this.state.displayedData;
      let displayedDataFromDB = nextProps.dd; //displayed data from database (after refresh)
      let newData = nextProps.data; //big data array from both database and unsaved mods
      let newDataKeys = Object.keys(newData);
      let modTitles = this.state.modTitles; //used for coloring
      let additionalModsToProcess = [];

      //loop through data, if there are mods in data that
      //is not in dd, push mod to dd (and modTitles)
        newDataKeys.forEach(modCode => { //for each mod in new data
          let isIndd = false;
          displayedDataFromDB.forEach(slot => {
            if (slot.title === modCode) {
              isIndd = true;
            }
          })
          if (!isIndd) {
            additionalModsToProcess.push(newData[modCode]);
            modTitles.push(modCode)
          }
        })
        additionalModsToProcess = this.process(additionalModsToProcess);
        
        displayedDataFromDB = displayedDataFromDB.concat(additionalModsToProcess);
        console.log("displayeddatafromdb dawd", displayedDataFromDB)
        console.log("dd before change", displayedData)
        displayedData = displayedData.concat(displayedDataFromDB);
        displayedData.forEach(data => {
          if (!data.lessonType) { //consult or event slot
            if (!this.checkIfConsultSlotIsInArr(displayedDataFromDB, data)) {
              displayedDataFromDB.push(data);
            }
          }
        });
        console.log('final displayed data',displayedDataFromDB)
        this.setState({
          data: newData,
          displayedData: displayedDataFromDB,
          modTitles: modTitles
        });
    }
  }

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
            result = result.concat(lessons[module][lessonType][classNokeys[0]]); //concat first class no into result
          })
      } else {
        result = result.concat(lessons[module]);
      }
    })
    return result;
  }

  showAlternatives(modCode, lessonType, classNo) {
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
    let classNo = eventData.classNo;
    let lessons = this.state.displayedData;
    let displayedData = [];
    let changed = false;
    for (let i = 0; i < lessons.length; i++) {
      // check if slot chosen matches the modcode and lessontype
      if (!changed && lessons[i].title === modCode &&
        lessons[i].lessonType === lessonType &&
        lessons[i].classNo === classNo) {
        displayedData.push(lessons[i]);
      } else if (lessons[i].title === modCode && lessons[i].lessonType === lessonType){
      } else {
        displayedData.push(lessons[i]);
      }
    }
    return displayedData;
  }

  saveAppointmentsToDatabase() {
    if (this.props.firebase.auth.currentUser) {
      //reseting the database first
      this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('appointments').child('appointmentsArr')
      .set({});
      let displayedData = this.state.displayedData;

      //looping through this.state.displayedData and adding apppointments into db
      displayedData.map(appointment => {
        console.log('appt', appointment)
        if (!appointment.classNo) { //if its a consult slot/other appt slot
          if (appointment.rRule) { //if is a repeating event,
            if (typeof appointment.id === "number") {
              console.log('is repeating, has id')
              this.props.firebase.database.ref('users')
              .child(this.props.firebase.auth.currentUser.uid)
              .child('appointments').child('appointmentsArr')
              .push({
                startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
                endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
                title: appointment.title,
                rRule: appointment.rRule,
                id: appointment.id
              });
            } else {
              console.log('is repeating, no id')
              this.props.firebase.database.ref('users')
              .child(this.props.firebase.auth.currentUser.uid)
              .child('appointments').child('appointmentsArr')
              .push({
                startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
                endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
                title: appointment.title,
                rRule: appointment.rRule,
              });
            }
          } else { //if its not a repeating event
            if (typeof appointment.id === "number") {
              console.log('not repeating, has id')
              this.props.firebase.database.ref('users')
              .child(this.props.firebase.auth.currentUser.uid)
              .child('appointments').child('appointmentsArr')
              .push({
                startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
                endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
                title: appointment.title,
                id: appointment.id
              });
            } else {
              console.log('not repeating, no id', appointment.id)
              this.props.firebase.database.ref('users')
              .child(this.props.firebase.auth.currentUser.uid)
              .child('appointments').child('appointmentsArr')
              .push({
                startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
                endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
                title: appointment.title,
              });
            }
          }
        } else { //if its a module slot
          if (typeof appointment.id === "number") {
            console.log('is lesson, has id')
            this.props.firebase.database.ref('users')
            .child(this.props.firebase.auth.currentUser.uid)
            .child('appointments').child('appointmentsArr')
            .push({
              startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
              endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
              title: appointment.title,
              lessonType: appointment.lessonType,
              classNo: appointment.classNo,
              rRule: appointment.rRule,
              exDate: appointment.exDate,
              id: appointment.id
            });
          } else {
            console.log('is lesson, no id')
            this.props.firebase.database.ref('users')
            .child(this.props.firebase.auth.currentUser.uid)
            .child('appointments').child('appointmentsArr')
            .push({
              startDate: JSON.stringify(appointment.startDate).replace(/^"(.*)"$/, '$1'),
              endDate: JSON.stringify(appointment.endDate).replace(/^"(.*)"$/, '$1'),
              title: appointment.title,
              lessonType: appointment.lessonType,
              classNo: appointment.classNo,
              rRule: appointment.rRule,
              exDate: appointment.exDate,
            });
          }
        }
      });
      this.saveModsData();
    } else {
      window.alert("Please sign in to use this function.");
    }

  }

  saveModsData() {
    let data = this.state.data;
    this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
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
            this.props.firebase.database.ref('users')
            .child(this.props.firebase.auth.currentUser.uid)
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
    window.alert("Data successfully saved");
  }

  render() {
    console.log('dd in render', this.state.displayedData)
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
      <div className="table">
        <ThemeProvider theme={theme}>
          <Paper>
            <Scheduler
              data={this.state.displayedData}
              height={660}       
            >
              <ViewState
                defaultCurrentDate={new Date('2020-08-15')}
                // defaultCurrentDate={new Date()}
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
              />
              <Toolbar
                rootComponent={ToolbarRoot}
              />
              <DateNavigator 
                rootComponent={DateNavRootComponent}
              />
              <ConfirmationDialog buttonComponent={ConfirmationButton}/>
              <Appointments appointmentComponent={this.myAppointment} />
              <AppointmentForm />
              <AllDayPanel 
                cellComponent={allDayCell} 
                titleCellComponent={allDayTitleCell}
              />
            </Scheduler>
          </Paper>
        </ThemeProvider>
        <div className="buttons-div">
          <button id="save" onClick={this.saveAppointmentsToDatabase} className="save-button"><i className="fa fa-save"></i>Save</button>
        </div>
      </div>);
  }
}

export default withFirebase(Table);
