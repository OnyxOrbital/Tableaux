import React from 'react';
import './YourTimetable.css';
import SearchBar from '../SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';
import Table from '../Timetable/Timetable';
import { withFirebase } from '../Firebase/index';
import ShareDialog from '../ShareDialog/ShareDialog';
import MoreInfoDialog from '../MoreInfoDialog/MoreInfoDialog';
import ReactLoading from 'react-loading';

class YourTimetable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: [],
      dd: [],
      lessons: [],
      isDataLoaded: false,
      loadUsers: false,
      users: [],
    }
    this.containsModule = this.containsModule.bind(this);
    this.filterLessons = this.filterLessons.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.addModule = this.addModule.bind(this);
    this.processData = this.processData.bind(this);
    this.readData = this.readData.bind(this);
    this.readUsers = this.readUsers.bind(this);
    this.removeModule = this.removeModule.bind(this);
    this.onDisplayedDataChange = this.onDisplayedDataChange.bind(this);
    this.onModsDataChange = this.onModsDataChange.bind(this);

    this.authListener = this.props.firebase.auth.onAuthStateChanged(
      (authUser) => {
        if(authUser) {
          this.readUsers();
          this.ref = this.props.firebase.database.ref('users')
          .child(this.props.firebase.auth.currentUser.uid)
          .child('appointments').child('appointmentsArr');
          this.ref.on('value', this.onDisplayedDataChange)

          this.ref2 = this.props.firebase.database.ref('users')
          .child(this.props.firebase.auth.currentUser.uid)
          .child('appointments').child('modsData');
          this.ref2.on('value', this.onModsDataChange)
        }
      })
  }

  onDisplayedDataChange(snapshot) {
    console.log('called onDisplayedDataChange')
    let appointments = [];
    let value = snapshot.val();
    if (value) {
      appointments.push(Object.values(value));
    }
    if (appointments && appointments[0]) {
      console.log('appointments[0', appointments[0])
      this.setState({
        dd: appointments[0],
        isDataLoaded: true
      });
    } else {
      this.setState({
        dd: [],
        isDataLoaded: true
      });
    }
  }

  onModsDataChange(snapshot) {
    console.log('called onModsDataChange')
    let data = [];
    let modulesFromDB = [];
    let value = snapshot.val();
    if (value) { //if snapshot is not empty
      data.push(value);
      let data2 = [];
      if (data[0]) {
        console.log("data", data)
        console.log('data[0]', data[0])
        /*Transform data from [0: {ACC1002: {Lecture: {..}, Tutorial: {..}}, {ACC1701: {Lecture:{..}..}}]
        into [ACC1002: [Lecture: [v1 :{..},..],
        Tutorial: [v1:{..},..], ACC1701: [Lecture: [v1 :{..},..], Tutorial: [v1:{..},..]] */
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
        isDataLoaded: true,
        lessons: data2, //to override big data arrays from unsaved mods
        modules: modulesFromDB, //to overwrite modules from unsaved mods
      })
    }
  }

  // checks if modCode is contained in array of modules (this.state.modules)
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
    // checks for duplicate mod entry
    if (!this.containsModule(module.label, this.state.modules)) {
      let modules = this.state.modules;
      modules.push(module.label);
      this.setState({
        modules: modules });

      let newSearchResults = [];
      await Promise.all(modules.map(module => { //wait should this fetch for all modules or only the new mod added??
        return fetch(`https://api.nusmods.com/v2/2020-2021/modules/${module}.json`)
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
    // let lessons = []; // array that stores all mods -> lessontypes -> classnos -> lesson obj
    let lessons = this.state.lessons
    let timetables = []; //timetable[0] is modcode, timetable[1] is array of lesson objs
    searchResults.forEach(module => {
      let moduleCode = module.moduleCode;
      let semesterData = module.semesterData;
      timetables = timetables.concat(semesterData.map(data => { //timetables is array of timetable arrays
        if (data.semester === 1) {
          return [moduleCode].concat([data.timetable]); //['acc1002', slots -> [{...}, {...}, ...]]
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
    this.setState({ lessons: lessons });
  }

  /* Transforms the array of lesson objects into
  lessonTypes = [Tutorial: [ V1: [{...}], V2: [{...}], ...], Lecture:[ V1: [{...}], V2: [{...}], ...]] */
  filterLessons(arr) { //arr = [{slot}, {slot}, ...]
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

  // componentDidMount() {
  //   this.readData();
  // }

  // reads both displayed data and data
  async readData() {
    console.log('called readData')
    let appointments = [];
    let data = [];
    let modulesFromDB = [];
    let snapshotIsEmpty = false;
    if (this.props.firebase.auth.currentUser) { //reads data and displayed data from appointments
      let ref = this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
        .child('appointments').child('appointmentsArr');
      let snapshot = await ref.once('value');
      let value = snapshot.val();
      if (value) {
        snapshotIsEmpty = true;
        appointments.push(Object.values(value));
      }

      let ref2 = this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
      .child('appointments').child('modsData');
      let snapshot2 = await ref2.once('value');
      let value2 = snapshot2.val();
      if (value2) { //if snapshot is not empty
        snapshotIsEmpty = true;  //snapshot is not empty
        console.log('value2', value2)
        data.push(value2);
      }

      if (!snapshotIsEmpty) { //if snapshot is empty, finish loading
        this.setState({
          isDataLoaded: true
        })
      } else if (appointments && appointments[0] && data) { //if snapshot is not empty
        let data2 = [];

        if (data[0]) {
          /*Transform data from [0: {ACC1002: {Lecture: {..}, Tutorial: {..}}, {ACC1701: {Lecture:{..}..}}]
          into [ACC1002: [Lecture: [v1 :{..},..],
          Tutorial: [v1:{..},..], ACC1701: [Lecture: [v1 :{..},..], Tutorial: [v1:{..},..]] */
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
          dd: appointments[0],
          isDataLoaded: true,
          lessons: data2, //to overwrite big data arrays from unsaved mods
          modules: modulesFromDB, //to overwrite modules from unsaved mods
        })
        window.alert("Data successfully loaded");
      }
    } else {
      window.alert("Please sign in to use this function.")
    }

  }

  async readUsers() {
    console.log('called read users')
    let users = [];
    if (this.props.firebase.auth.currentUser) {
      // ref is the users hashcode
      let ref = this.props.firebase.database.ref().child('users');
      let snapshot = await ref.once('value');
      let value = snapshot.val();
      if (value) { //if snapshot is not empty
        console.log('value', value)
        Object.values(value).forEach(user => {
          users.push(user.username);
        })
      }
    }
    console.log('users from read users', users)
    console.log("done loading")
    this.setState({
      users: users,
      loadedUsers: true,
    })
    // return users;
  }

  removeModule(module) {
    //remove mod from database
    this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('appointments')
      .child('appointmentsArr')
      .once('value', snapshot => {
        snapshot.forEach(child => {
          console.log(child.val().title)
          if (child.val().title === module) {
            child.ref.remove();
          }
        })
      });
      this.props.firebase.database.ref('users')
      .child(this.props.firebase.auth.currentUser.uid)
      .child('appointments')
      .child('modsData')
      .child(module)
      .remove()

    //remove mod from displayeddata
    let lessons = this.state.lessons;
    let newLessons = [];
    let modules = this.state.modules;
    let lessonsKeys = Object.keys(lessons); //keys of mods from search bar and database
    lessonsKeys.forEach(key => {
      if (key !== module) {
        newLessons[key] = lessons[key];
      }
    });
    let allMods = [];
    modules.forEach(modCode => {
      if (modCode !== module) {
        allMods = allMods.concat([modCode]);
      }
    });
    this.setState({
      lessons: newLessons,
      modules: allMods,
    })
  }

  render(){
    let dd = this.state.dd;
    let lessons = this.state.lessons; //data of unsaved data from search bar and database
    let allData = [];
    let lessonsKeys = Object.keys(lessons); //keys of mods from search bar and database
    lessonsKeys.forEach(key => {
      allData[key] = lessons[key];
    })

    let modules = this.state.modules; //mod code array of mods from search bar and database
    let allMods = [];
    modules.forEach(modCode => {
      allMods = allMods.concat([modCode]);
    });

    if (this.props.firebase.auth.currentUser) {
      if (this.state.loadedUsers) {
        console.log("reached loaded user")
        console.log("dd passed as props", dd)
        console.log("allData passed as props", allData)
        return (
          <div className="yourTimetable">
            <div className="header">
              <h1>Your Timetable</h1>
              <MoreInfoDialog />
            </div>
            <Table className="table" data={allData} dd={dd} modules={allMods} />
            <div className="buttons-div">
            <ShareDialog className="share-button" users={this.state.users} />
              <button onClick={() => {this.readData()}} className="refresh-button"><i className="fa fa-refresh"></i>Refresh Data</button>
            </div>
            <div>
              <hr></hr>
              <SearchBar action={this.addModule}/>
              <p className="your-modules-text">Your modules:</p>

                {/* <MyModules modules={allMods} /> */}
                <div className="MyModules">{allMods.map(module => {
                  return (
                  <div className="Module-information">
                    <h3>{module}</h3>
                    <button onClick={() => this.removeModule(module)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                  </div>);
                })}</div>
            </div>
          </div>
        );
      } else {
        return <ReactLoading className="spinner" type='spin' color='white' height={'5%'} width={'5%'} />;
      }
    } else {
      return (
        <div className="yourTimetable">
          <div className="header">
            <h1>Your Timetable</h1>
            <MoreInfoDialog />
          </div>
          <Table className="table" data={allData} dd={dd} modules={allMods} />
          <div className="buttons-div">
            <ShareDialog className="share-button" users={this.state.users} />
            <button onClick={this.readData} className="refresh-button"><i className="fa fa-refresh"></i>Refresh Data</button>
          </div>
          <div>
            <hr></hr>
            <SearchBar action={this.addModule}/>
            <p className="your-modules-text">Your modules:</p>

              {/* <MyModules modules={allMods} /> */}
              <div className="MyModules">{allMods.map(module => {
                return (
                <div className="Module-information">
                  <h3>{module}</h3>
                  <button onClick={() => this.removeModule(module)}><i className="fa fa-trash-o" aria-hidden="true"></i></button>
                </div>);
              })}</div>
          </div>
        </div>
      );
    }

  }
}

export default withFirebase(YourTimetable);
