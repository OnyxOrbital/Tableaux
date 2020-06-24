import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

const currentDate = '2020-06-22';
const schedulerData = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // searchResults: [],
      // lessons: []
    }
    // this.fetchData = this.fetchData.bind(this);
    // this.processData = this.processData.bind(this);
  }

  // componentDidMount() {
  //   fetch(`https://api.nusmods.com/v2/2019-2020/{moduleList}.json`)
  //     .then(response => response.json())
  //     .then(searchResults => this.setState({ searchResults: searchResults }));
  // }

  // setNewState(oldState, newState) {
  //   this.setState({ oldState: newState });
  // }

  // componentDidMount() {
  //   let modules = this.props.modules;
  //   let newSearchResults = this.state.searchResults;

  //   console.log('modules', this.props.modules )
  //   modules.forEach(module => {
  //     console.log('module', module)
      // fetch(`https://api.nusmods.com/v2/2019-2020/${module.label}.json`)
      // .then(response => response.json())
      // .then(searchResults => {
      //   console.log('search results 0', searchResults)
      //   newSearchResults.push(searchResults);
      // });
  //   });

  //   // this sets the state of searchResults to contain all the module info
  //   this.setState({ searchResults: newSearchResults });
  //   console.log('new search results', newSearchResults)
  //   console.log('search results 1', this.state.searchResults)
  // //   setNewState(searchResults, newSearchResults);
  //   this.processData();
  // }
  
  // processData() {
  //   console.log('called process Data');
  //   let searchResults = this.state.searchResults;
  //   let lessons = [];
  //   console.log('search results', searchResults)
  //   searchResults.map(module => {
  //     console.log('reached here')
  //     let timetable = module.semesterData.timetable;
  //     timetable.map(slot => {
  //       let lesson = {
  //         startDate: slot.startTime,
  //         endDate: slot.endTime,
  //         title: module.moduleCode
  //       }
  //       console.log('test');
  //       lessons.push(lesson);
  //     });
  //   });
    
  //   this.setState({ lessons: lessons });
  // }

    render() {
        // this.fetchData();
        console.log(this.props.lessons)
        return (          
            <Paper>
              <Scheduler
                data={this.props.lessons}
              >
                <ViewState
                  currentDate={currentDate}
                />
                <WeekView
                  startDayHour={8}
                  endDayHour={20}
                />
                <Appointments />
              </Scheduler>
            </Paper>);
    }
} 
