import React from 'react';
import './YourTimetable.css';
import BackArrow from '../../images/backwardarrow.png';
import FrontArrow from '../../images/forwardarrow.png';
import Timetable from '../Timetable/Timetable';
import SearchBar from '../TopPanel/SearchBar/SearchBar';
import MyModules from '../YourTimetable/MyModules/MyModules';

export default class YourTimetable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modules: []
        }
        this.addModule = this.addModule.bind(this);
    }

    addModule(module) {
        let modules = this.state.modules;
        modules.push(module);
        this.setState({ modules: modules });
        console.log(modules)
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
            <SearchBar handleChange={this.addModule}/>
            {/* <input type="text" placeholder="Add module to timetable" id="addModule" name="addModule"/> */}
            <hr></hr>
            <p id="yourModules">Your modules:</p>

            <MyModules
                modules={this.state.modules} />
            <p id="totalMCs">Total MCs: 0 MCs</p>
            </div>
      </div>
    );
    }
}
