import React from 'react';
import './YourTimetable.css';
import BackArrow from '../../images/backwardarrow.png';
import FrontArrow from '../../images/forwardarrow.png';
import SearchBar from '../SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';
import Table from '../Timetable/Timetable';

export default class YourTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      lessons: []
    }
    this.containsModule = this.containsModule.bind(this);
    this.filterLessons = this.filterLessons.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.addModule = this.addModule.bind(this);
    this.processData = this.processData.bind(this);
  }

  // checks if event.data.title is contained in array of modules
  containsModule(title) {
    let modules = this.state.modules;
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].label === title) {
        return true;
      }
    }

    return false;
  }

  //onclick on module option in searchbar,
  //adds module to module list in state,
  //fetches more info (including lesson timing) from api
  //appends the extended info into search results, calls process data
  async addModule(module) {
    // checks for duplicate mod entry
    if (!this.containsModule(module.label)) {
      let modules = this.state.modules;
      modules.push(module);
      this.setState({ modules: modules });

      let newSearchResults = [];
      await Promise.all(modules.map(module => {
        return fetch(`https://api.nusmods.com/v2/2019-2020/modules/${module.label}.json`)
        .then(response => response.json())
        .then(searchResults => {
          newSearchResults.push(searchResults);
        });
      }));
      this.processData(newSearchResults);
    }
  }

  //converts searchresults into array of lesson timings,
  //stores in this.state.lessons
  processData(searchResults) {
    let lessons = []; // array that stores all mods -> lessontypes -> classnos -> lesson obj
    let timetables = []; //timetable[0] is modcode, timetable[1] is array of lesson objs
    searchResults.forEach(module => {
      let moduleCode = module.moduleCode;
      let semesterData = module.semesterData;
      timetables = timetables.concat(semesterData.map(data => { //timetables is array of timetable arrays
        if (data.semester === 1) {
          return [moduleCode].concat([data.timetable]);
        } else {
          return [];
        }
      }));
    });

    // for each timetable in timetables array
    timetables.forEach(timetable => {
      if (timetable.length > 0) {
        let arr = [];
        timetable[1].forEach(slot => { //for each lesson slot in timetable array
          let lesson = {
            startDate: this.convertTime(slot.day, slot.startTime),
            endDate: this.convertTime(slot.day, slot.endTime),
            title: timetable[0], //module code
            lessonType: slot.lessonType,
            classNo: slot.classNo
          }
          arr.push(lesson);
        });
        lessons[timetable[0]] = this.filterLessons(arr);
      }
    });
    this.setState({ lessons: lessons });
  }

  filterLessons(arr) { //takes array of lesson objects
    let lessonTypes = arr.reduce(function(obj, lesson) {
      if (!obj.hasOwnProperty(lesson.lessonType)){
        obj[lesson.lessonType] = [];
      }
      obj[lesson.lessonType].push(lesson);
      return obj;
    }, []);

    let lessonTypekeys = Object.keys(lessonTypes);
    lessonTypekeys.forEach(lessonType => {
      lessonTypes[lessonType] = lessonTypes[lessonType].reduce(function(obj, lesson){
            if (!obj.hasOwnProperty(lesson.classNo)){
              obj[lesson.classNo] = [];
            }
            obj[lesson.classNo].push(lesson);
            return obj;
          }, []);
    })
    return lessonTypes;
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
      default:
        return;
    }
  }

  render(){
    return (
      <div className="yourTimetable">
          <h2>Your Timetable</h2>
          <SearchBar action={this.addModule}/>
          <p id="yourModules">Your modules:</p>
            <MyModules modules={this.state.modules} />
          <hr></hr>
          <div className="date-panel">
            <img src={BackArrow} id="back-arrow" alt=''/>
            <h3>Special Term 1</h3>
            <img src={FrontArrow} id="forward-arrow" alt=''/>
          </div>
          <div className="table">
            <Table className="table" lessons={this.state.lessons} modules={this.state.modules} />
          </div>
          <button id="share">Share</button>
          <button id="createEventbtn">Add Event</button>
      </div>
    );
  }
}
