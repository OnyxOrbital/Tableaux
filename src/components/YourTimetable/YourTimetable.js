import React from 'react';
import './YourTimetable.css';
import BackArrow from '../../images/backwardarrow.png';
import FrontArrow from '../../images/forwardarrow.png';
import Timetable from '../Timetable/Timetable';
import SearchBar from '../TopPanel/SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';
import Table from '../Scheduler/Scheduler';

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
        // let response = await fetch(`https://api.nusmods.com/v2/2019-2020/modules/${module.label}.json`);
        // let searchResults = await newSearchResults.push(response.json());
        // newSearchResults.push(searchResults);
      }));
  
      // this sets the state of searchResults to contain all the module info
    //   this.setState({ searchResults: newSearchResults });
      console.log('new search results', newSearchResults)
    //   console.log('search results 1', this.state.searchResults)
    //   setNewState(searchResults, newSearchResults);
      this.processData(newSearchResults);
    }


  
    processData(searchResults) {
      console.log('called process Data');
      // let searchResults = this.state.searchResults;
      let lessons = [];
      let timetables = [];
      // let moduleCode = "";
      console.log('search results', searchResults)
      searchResults.forEach(module => {
        console.log('reached here')
        // moduleCode = module.moduleCode;
        let moduleCode = module.moduleCode;
        let semesterData = module.semesterData;
        timetables = timetables.concat(semesterData.map(data => {
          if (data.semester == 1) {
            // console.log('timetable',[module.moduleCode].concat([data.timetable]))
            return [moduleCode].concat([data.timetable]);
          } else {
            return [];
          }
        }));

        console.log('timetables', timetables);
      });
        
      timetables.forEach(timetable => {
        if (timetable.length > 0) {
          timetable[1].forEach(slot => {
              let lesson = {
                startDate: this.convertTime(slot.day, slot.startTime),
                endDate: this.convertTime(slot.day, slot.endTime),
                title: timetable[0]
              }
              // console.log('lesson',lesson);
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
            <div className="date-panel">
            <img src={BackArrow} id="back-arrow"/>
            <h3>Special Term 1</h3>
            <img src={FrontArrow} id="forward-arrow"/>
            </div>
            <div className="timetable">
            <Timetable modules={this.state.modules}/>
            
            <a id="share" href="../Login/login.html">Share</a>
            <a id="createEventbtn" href="createEventSlot.html">Add Event</a>
            <SearchBar action={this.addModule}/>
            {/* <input type="text" placeholder="Add module to timetable" id="addModule" name="addModule"/> */}
            <hr></hr>
            <p id="yourModules">Your modules:</p>

            <MyModules
                modules={this.state.modules} />
            <p id="totalMCs">Total MCs: 0 MCs</p>
            <Table lessons={this.state.lessons} />
            </div>
      </div>
    );
    }
}
