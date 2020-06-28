import React from 'react';
import './YourTimetable.css';
import BackArrow from '../../images/backwardarrow.png';
import FrontArrow from '../../images/forwardarrow.png';
import Timetable from '../TimtableOld/Timetable';
import SearchBar from '../TopPanel/SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';
import Table from '../Timetable/Timetable';

export default class YourTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      lessons: []
    }
    this.convertTime = this.convertTime.bind(this);
    this.addModule = this.addModule.bind(this);
    this.processData = this.processData.bind(this);
  }

  async addModule(module) {
    let modules = this.state.modules;
    console.log('module list', modules)
    modules.push(module);
    this.setState({ modules: modules });

    let newSearchResults = [];
    console.log('modules', modules)
    let data = await Promise.all(modules.map(module => {
      console.log('module', module)
      return fetch(`https://api.nusmods.com/v2/2019-2020/modules/${module.label}.json`)
      .then(response => response.json())
      .then(searchResults => {
        console.log('search results 0', searchResults)
        newSearchResults.push(searchResults);
      });
    }));

    console.log('new search results', newSearchResults)
    this.processData(newSearchResults);
  }

  processData(searchResults) {
    let lessons = [];
    let timetables = [];
    searchResults.forEach(module => {
      let moduleCode = module.moduleCode;
      let semesterData = module.semesterData;
      timetables = timetables.concat(semesterData.map(data => {
        if (data.semester == 1) {
          return [moduleCode].concat([data.timetable]);
        } else {
          return [];
        }
      }));
    });

    timetables.forEach(timetable => {
      if (timetable.length > 0) {
        timetable[1].forEach(slot => {
          let lesson = {
            startDate: this.convertTime(slot.day, slot.startTime),
            endDate: this.convertTime(slot.day, slot.endTime),
            title: timetable[0]
          }
          lessons.push(lesson);
        });
      }
    });
    this.setState({ lessons: lessons });
  }

  convertTime(day, oldtime) {
    let time = oldtime.substring(0,2) + ':' + oldtime.substring(2,4);
    switch(day) {
      case 'Monday' :
        return  `2020-06-22T${time}`;
      case 'Tuesday' :
        return `2020-06-23T${time}`;
      case 'Wednesday' :
        return `2020-06-24T${time}`;
      case 'Thursday' :
        return `2020-06-25T${time}`;
      case 'Friday' :
        return `2020-06-26T${time}`;
    }
  }

  render(){
    return (
      <div className="yourTimetable">
        <div className="timetable">
          <SearchBar action={this.addModule}/>
          <p id="yourModules">Your modules:</p>
            <MyModules modules={this.state.modules} />
          <hr></hr>
          <div className="date-panel">
            <img src={BackArrow} id="back-arrow"/>
            <h3>Special Term 1</h3>
            <img src={FrontArrow} id="forward-arrow"/>
          </div>
          <div className="table">
            <Table lessons={this.state.lessons} />
          </div>
          <button id="share">Share</button>
          <button id="createEventbtn">Add Event</button>
        </div>
      </div>
    );
  }
}
