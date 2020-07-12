import React from 'react';
import './YourTimetable.css';
import BackArrow from '../../images/backwardarrow.png';
import FrontArrow from '../../images/forwardarrow.png';
import SearchBar from '../SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';
import Table from '../Timetable/Timetable';
import { withFirebase } from '../Firebase/index';

class YourTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      modulesFromDB: [],
      data: [],
      displayedData: [],
      lessons: [],
      isDataLoaded: false
    }
    this.containsModule = this.containsModule.bind(this);
    this.filterLessons = this.filterLessons.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.addModule = this.addModule.bind(this);
    this.processData = this.processData.bind(this);
    this.readData = this.readData.bind(this);
  }

  // checks if event.data.title is contained in array of modules
  containsModule(title, modArr) {
    for (let i = 0; i < modArr.length; i++) {
      if (modArr[i] === title) {
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
    if (!this.containsModule(module.label, this.state.modules)) {
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

  // reads both displayed data and data
  readData() {
    console.log("before reading data", this.state.displayedData)
    let appointments = [];
    let data = [];
    let modulesFromDB = [];
    let snapshotIsEmpty = false;
    if (this.props.firebase.auth.currentUser) {
      let ref = this.props.firebase.user(this.props.firebase.auth.currentUser.uid).child('appointments');
      ref.on('value', function(snapshot) {
        console.log('dd snapshot.val()', snapshot.val())
        if (snapshot.val()) { //if snapshot is not empty
          snapshotIsEmpty = true;  //snapshot is not empty
          appointments.push(Object.values(snapshot.val()));
        }
      });

      ref.child('modsData').on('value', function(snapshot) {
        console.log('data snapshot.val()', snapshot.val())
        if (snapshot.val()) { //if snapshot is not empty
          snapshotIsEmpty = true;  //snapshot is not empty
          data.push(snapshot.val());
        }
      });

      if (!snapshotIsEmpty) { //if snapshot is empty, finish loading
        console.log('snapshot is empty', snapshotIsEmpty) //loads before snapshot loads
        this.setState({
          isDataLoaded: true
        })
      } else if (appointments[0] && (appointments !== []) && data) { //if snapshot is not empty
        console.log('snapshot is not empty-data', data[0])
        console.log('snapshot is not empty-dd',  Object.values(appointments[0][0]))

        let modulekeys = Object.keys(data[0]); //arr of mod keys
        let data2 = [];
        modulesFromDB = modulekeys;
        modulekeys.forEach(module => { //for each module array
          // console.log("module", module)
          let lessonTypekeys = Object.keys(data[0][module]);
          // console.log("lessonTypekeys", lessonTypekeys)
            lessonTypekeys.forEach(lessonType => { //for each lesson type
            // console.log('lessonType', lessonType)
            let classNokeys = Object.keys(data[0][module][lessonType]);
            // console.log("classNokeys", classNokeys)
            classNokeys.forEach(classNo => {
              // console.log('classNo', classNo)
              let arr = Object.values(data[0][module][lessonType][classNo]);
              // console.log('arr', arr)
              if (!data2.hasOwnProperty(module)) {
                data2[module] = [];
                data2[module][lessonType] = [];
              } else if (!data2[module].hasOwnProperty(lessonType)) {
                data2[module][lessonType] = [];
              }
              data2[module][lessonType][classNo] = [];
              data2[module][lessonType][classNo] = data2[module][lessonType][classNo].concat(Object.values(arr));
            });
          });
        })
        console.log('data', data2)
        console.log('appointments',appointments)
        console.log('appointments[0]',appointments[0])
        console.log('appointments[0][0]',appointments[0][0])
        console.log('Object.values(appointments[0][0])', Object.values(appointments[0][0]))
        this.setState({
          displayedData: Object.values(appointments[0][0]),
          isDataLoaded: true,
          data: data2,
          modulesFromDB: modulesFromDB
        })
      }
    }
  }

  render(){
    console.log("data", this.state.data)
    console.log("dd", this.state.displayedData)
    console.log('lessons', this.state.lessons)

    let data = this.state.data;
    let lessons = this.state.lessons;
    let allData = [];
    let dataKeys = Object.keys(data);
    let lessonsKeys = Object.keys(lessons);
    dataKeys.forEach(key => {
      allData[key] = data[key];
    })
    lessonsKeys.forEach(key => {
      allData[key] = lessons[key];
    })

    let modules = this.state.modules;
    let modulesFromDB = this.state.modulesFromDB;
    console.log("this.state.modules", this.state.modules)
    let allMods = [];
    let modKeys1 = Object.values(modules);
    let modKeys2 = Object.keys(modulesFromDB);
    console.log("modkeys2", modKeys2)
    modKeys2.forEach(key => {
      allMods = allMods.concat([modulesFromDB[key]]);
    })
    
    modKeys1.forEach(key => {
      console.log("key.value", typeof key.value)
      if (!this.containsModule(key.value, this.state.modulesFromDB)) {
        allMods = allMods.concat([key.value]);
      }
    })
    console.log('allMods', allMods)
    return (
      <div className="yourTimetable">
          <h2>Your Timetable</h2>
          <SearchBar action={this.addModule}/>
          <p id="yourModules">Your modules:</p>
            <MyModules modules={allMods} />
          <hr></hr>
          <div className="date-panel">
            <img src={BackArrow} id="back-arrow" alt=''/>
            <h3>Special Term 1</h3>
            <img src={FrontArrow} id="forward-arrow" alt=''/>
          </div>
          <button onClick={this.readData} className="refresh-button"><i className="fa fa-refresh"></i>Refresh appointments</button>
          <div className="table">
            <Table className="table" data={allData} displayedData={this.state.displayedData} modules={allMods} />
          </div>
          <button id="share">Share</button>
          <button id="createEventbtn">Add Event</button>
      </div>
    );
  }
}

export default withFirebase(YourTimetable);
