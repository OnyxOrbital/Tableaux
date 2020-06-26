import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import './Timetable.css';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';
import Confirmation from '../Confirmation/Confirmation';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#000000',
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#ebff0d',
    },
    third: {
      darker: '#171a24',
      lighter: 'rgb(33, 38, 54)'
    }
  },
});

const style = theme => ({
  normalCellDark: {
    backgroundColor: fade(theme.palette.third.darker, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  normalCellLight: {
    backgroundColor: fade(theme.palette.third.lighter, 1),
    '&:hover': {
      backgroundColor: fade(theme.palette.primary.main, 0.14),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.16),
    },
  },
  scaleDark: {
    backgroundColor: fade(theme.palette.third.darker, 1),
  },
});

const TimeTableCellBase = ({ classes, ...restProps }) => {
  const { startDate } = restProps;
  const date = new Date(startDate);
  if (date.getDay() === 0 || date.getDay() === 2
  || date.getDay() === 4) {
    return <WeekView.TimeTableCell {...restProps} className={classes.normalCellDark} />;
  } return <WeekView.TimeTableCell {...restProps} className={classes.normalCellLight}/>;
};

const TimeTableCell = withStyles(style, { name: 'TimeTableCell' })(TimeTableCellBase);

const DayScaleCellBase = ({ classes, ...restProps }) => {
  const { startDate, today } = restProps;
  return <WeekView.DayScaleCell {...restProps} className={classes.scaleDark}/>;
};

const DayScaleCell = withStyles(style, { name: 'DayScaleCell' })(DayScaleCellBase);

const TimeScaleLayoutBase = ({ classes, ...restProps }) => {
  const { startDate, today } = restProps;
  return <WeekView.TimeScaleLayout {...restProps} className={classes.scaleDark}/>;
};

const TimeScaleLayout = withStyles(style, { name: 'TimeScaleLayout' })(TimeScaleLayoutBase);


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
      redirectTo: null,
      lessonData: null
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
    return <Appointments.Appointment {...props} onClick={(event) => {
      let result = window.confirm("Confirm booking?");
      // console.log(result);
      // console.log(event.data)
      if (result) {
       this.setState({ 
         redirectTo: true,
         lessonData: event.data });
      } 
      
    }}/>
  }

    render() {
      
        if (this.state.redirectTo) {
          // console.log(this.props.data)
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
                data={schedulerData}
                height={660}
              >
                <ViewState
                  currentDate={currentDate}
                />
                <WeekView
                  startDayHour={8}
                  endDayHour={20}
                  timeTableCellComponent={TimeTableCell}
                  dayScaleCellComponent={DayScaleCell}
                  timeScaleLayoutComponent={TimeScaleLayout}
                  excludedDays={[0]}
                />
                <Appointments appointmentComponent={this.myAppointment} />
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
