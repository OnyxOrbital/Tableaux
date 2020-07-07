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
export default class Table extends React.Component {
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
      modsColor: ['#95AAE0', '#CB70DD', '#D17373', '#B17542', '#CC5688', '#6E59A7', '#63B586', '#891F1F', '#897F54'],
      modTitles: []
    }
    this.replaceSlot = this.replaceSlot.bind(this);
    this.showAlternatives = this.showAlternatives.bind(this);
    this.process = this.process.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.changeAppointmentChanges = this.changeAppointmentChanges.bind(this);
    this.changeEditingAppointmentId = this.changeEditingAppointmentId.bind(this);
  }



  myAppointment(props) {
    let background = '';
    let titles = this.state.modTitles;
    let colors = this.state.modsColor;
    console.log(colors);
    let current = props.data.title;
    if (current === 'Consult') {
      background = '#7D7684';
    } else if (titles.includes(current) && titles.length < colors.length) { //if mod already in modlist
     background = colors[titles.indexOf(current)];
     console.log('title includes current')
    } else if (titles.length < colors.length) {
     background = colors[titles.length];
     console.log('title length< colors length')
    } else {
      background = colors[titles.length % colors.length];
      console.log('modulo block')
    }
    
    return <Appointments.Appointment {...props} style={{backgroundColor: background}} 
      onClick={(event) => {
        if (this.state.isEditing) {
          let displayedData = this.replaceSlot(event.data.title, event.data.lessonType, event.data);
          this.setState({ 
            displayedData: displayedData,
            isEditing: false
          });
        } else {
          if (event.data.title === "Consult") {
            let result = window.confirm("Confirm booking?");
            if (result) {
              console.log('event.data', event.data)
              this.setState({ 
                redirectTo: true,
                consultData: event.data 
              }); 
            }
          } else {
            let alternatives = this.showAlternatives(event.data.title, event.data.lessonType, event.data.classNo);
            this.setState({ 
              displayedData: this.state.displayedData.concat(alternatives),
              isEditing: true 
            })
          }
      }
    }}/>
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.lessons !== this.state.data) {
      let displayedData = this.state.displayedData;
      let newData = nextProps.lessons;
      let modTitles = this.state.modTitles;
      
      let modKeys = Object.keys(newData);
      modKeys.forEach(key => { //for each mod in new data
        if (!displayedData.hasOwnProperty(key)) {
          displayedData.push(newData[key]);
          modTitles.push(key)
        }
      })

      displayedData = this.process(displayedData);
      this.setState({ 
        data: nextProps.lessons,
        displayedData: displayedData,
        modTitles: modTitles
      });
    }
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

  process(lessons) {
    let result = []; // array of selected lesson slots to be shown
    let modulekeys = Object.keys(lessons); //arr of mod keys
    modulekeys.forEach(module => { //for each module array
      let lessonTypekeys = Object.keys(lessons[module]);
      lessonTypekeys.forEach(lessonType => { //for each lesson type
        let classNokeys = Object.keys(lessons[module][lessonType]);
          result = result.concat(lessons[module][lessonType][classNokeys[0]]); //concat first class no into result
      })
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

  replaceSlot(modCode, lessonType, eventData) {
    let lessons = this.state.displayedData;
    let displayedData = [];
    let changed = false;
    for (let i = 0; i < lessons.length; i++) {
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
      </div>);
  }
} 
