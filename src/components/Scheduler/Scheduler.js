import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2018-11-01';
const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      lessons: []
    }
    this.fetchData = this.fetchData.bind(this);
    this.processData = this.processData.bind(this);
  }

  // componentDidMount() {
  //   fetch(`https://api.nusmods.com/v2/2019-2020/{moduleList}.json`)
  //     .then(response => response.json())
  //     .then(searchResults => this.setState({ searchResults: searchResults }));
  // }

  fetchData() {
    let modules = this.props.modules;
    let newSearchResults = this.state.searchResults;

    modules.map(module => {
      fetch(`https://api.nusmods.com/v2/2019-2020/${module.label}.json`)
      .then(response => response.json())
      .then(searchResults => {
        newSearchResults.push(searchResults);
      });
    });

    // this sets the state of searchResults to contain all the module info
    this.setState({ searchResults: newSearchResults });
    this.processData();
  }
  
  processData() {
    let searchResults = this.state.searchResults;
    let lessons = [];
    searchResults.map(module => {
      let timetable = module.semesterData.timetable;
      timetable.map(slot => {
        let lesson = {
          startDate: slot.startTime,
          endDate: slot.endTime,
          title: module.moduleCode
        }
        lessons.push(lesson);
      });
    });
    
    this.setState({ lessons: lessons });
  }

    render() {
        this.fetchData();

        return (
          
            <Paper>
              <Scheduler
                data={this.state.lessons}
              >
                <ViewState
                  currentDate={currentDate}
                />
                <WeekView
                  startDayHour={8}
                  endDayHour={15}
                />
                <Appointments />
              </Scheduler>
            </Paper>
          );
    }
} 
