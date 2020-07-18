import React from 'react';
import './YourTimetable.css';
import SearchBar from '../SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';
import Table from '../Timetable/Timetable';
import { withFirebase } from '../Firebase/index';
import ShareDialog from '../ShareDialog/ShareDialog';

class YourTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      modulesFromDB: [],
      data: [],
      dd: [],
      lessons: [],
      isDataLoaded: false
    }
    this.containsModule = this.containsModule.bind(this);
    this.filterLessons = this.filterLessons.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.addModule = this.addModule.bind(this);
    this.processData = this.processData.bind(this);
    this.readData = this.readData.bind(this);
    this.readUsers = this.readUsers.bind(this);
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

  /*onclick on module option in searchbar,
  adds module to this.state.modules,
  fetches more info (including lesson timing) from api
  appends the extended info into search results, calls process data*/
  async addModule(module) {
    console.log('called addModule', this.state.dd)
    // checks for duplicate mod entry
    if (!this.containsModule(module.label, this.state.modules)) {
      let modules = this.state.modules;
      modules.push(module);
      this.setState({ modules: modules });

      let newSearchResults = [];
      await Promise.all(modules.map(module => { //wait should this fetch for all modules or only the new mod added??
        return fetch(`https://api.nusmods.com/v2/2020-2021/modules/${module.label}.json`)
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
    console.log('called processData', this.state.dd)
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
            classNo: slot.classNo,
            rRule: 'FREQ=WEEKLY',
            exDate: '20201205T235959Z',
          }
          arr.push(lesson);
        });
        lessons[timetable[0]] = this.filterLessons(arr);
      }
    });
    console.log('lessons', lessons)
    this.setState({ lessons: lessons });
  }

  filterLessons(arr) { //takes array of lesson objects
    console.log('called filterLessons', this.state.dd)
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
    console.log('lessonTypes', lessonTypes)
    return lessonTypes;
  }

  convertTime(day, oldtime) {
    let time = oldtime.substring(0,2) + ':' + oldtime.substring(2,4);
    switch(day) {
      case 'Monday' :
        return  `2020-08-10T${time}`;
      case 'Tuesday' :
        return `2020-08-11T${time}`;
      case 'Wednesday' :
        return `2020-08-12T${time}`;
      case 'Thursday' :
        return `2020-08-13T${time}`;
      case 'Friday' :
        return `2020-08-14T${time}`;
      default:
        return;
    }
  }

  // reads both displayed data and data
  async readData() {
    console.log("called readData", this.state.dd)
    let appointments = [];
    let data = [];
    let modulesFromDB = [];
    let snapshotIsEmpty = false;
    if (this.props.firebase.auth.currentUser) {
      let ref = this.props.firebase.user(this.props.firebase.auth.currentUser.uid).child('appointments');
      let snapshot = await ref.once('value');
      let value = snapshot.val();
      if (value) { //if snapshot is not empty
        snapshotIsEmpty = true;  //snapshot is not empty
        appointments.push(Object.values(value));
      }

      let ref2 = ref.child('modsData');
      let snapshot2 = await ref2.once('value');
      let value2 = snapshot2.val();
      if (value2) { //if snapshot is not empty
        snapshotIsEmpty = true;  //snapshot is not empty
        data.push(value2);
      }

      if (!snapshotIsEmpty) { //if snapshot is empty, finish loading
        this.setState({
          isDataLoaded: true
        })
      } else if (appointments[0] && (appointments !== []) && data) { //if snapshot is not empty
        let data2 = [];

        if (data[0]) {
          let modulekeys = Object.keys(data[0]); //arr of mod keys
          modulesFromDB = modulekeys;
          modulekeys.forEach(module => { //for each module array
            let lessonTypekeys = Object.keys(data[0][module]);
              lessonTypekeys.forEach(lessonType => { //for each lesson type
              let classNokeys = Object.keys(data[0][module][lessonType]);
              classNokeys.forEach(classNo => {
                let arr = Object.values(data[0][module][lessonType][classNo]);
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
        }
        this.setState({
          dd: Object.values(appointments[0][0]),
          isDataLoaded: true,
          data: data2,
          modules: [],
          modulesFromDB: modulesFromDB
        })
      }
    } else {
      window.alert("Please sign in to use this function.")
    }

  }

  readUsers() {
    console.log('called readUsers')
    let users = [];
    if (this.props.firebase.auth.currentUser) {
        // ref is the users hashcode
      let ref = this.props.firebase.users();
      ref.on('value', function(snapshot) {
        if (snapshot.val()) { //if snapshot is not empty
          snapshot.forEach(user => {
            users.push(user.val().username);
          })
        }
      })
    }
    return users;
  }

  render(){
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
    let allMods = [];
    let modKeys1 = Object.values(modules);
    let modKeys2 = Object.keys(modulesFromDB);
    modKeys2.forEach(key => {
      allMods = allMods.concat([modulesFromDB[key]]);
    })

    modKeys1.forEach(key => {
      if (!this.containsModule(key.value, this.state.modulesFromDB)) {
        allMods = allMods.concat([key.value]);
      }
    })
  
    let dd = this.state.dd;
    return (
      <div className="yourTimetable">
        <h1>Your Timetable</h1>
        <Table className="table" data={allData} dd={dd} modules={allMods} />
        <div className="buttons-div">
          <ShareDialog className="share-button" users={this.readUsers()} />
          <button onClick={this.readData} className="refresh-button"><i className="fa fa-refresh"></i>Refresh Data</button>
        </div>
        <div>
          <hr></hr>
          <SearchBar action={this.addModule}/>
          <p className="your-modules-text">Your modules:</p>
            <MyModules modules={allMods} />
        </div>
      </div>
    );
  }
}

export default withFirebase(YourTimetable);
