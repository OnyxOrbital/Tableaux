import React from 'react';
import './YourTimetable.css';
import BackArrow from '../../images/backwardarrow.png';
import FrontArrow from '../../images/forwardarrow.png';

export class YourTimetable extends React.Component {
    render(){
    return (
        <div className="yourTimetable">
            <div className="date-panel">
            <img src={BackArrow} id="back-arrow"/>
            <h3>Special Term 1</h3>
            <img src={FrontArrow} id="forward-arrow"/>
            </div>
            <div className="timetable">
            <table>
                <thead>
                <tr>
                    <th> </th>
                    <th colspan="2">0800</th>
                    <th colspan="2">0900</th>
                    <th colspan="2">1000</th>
                    <th colspan="2">1100</th>
                    <th colspan="2">1200</th>
                    <th colspan="2">1300</th>
                    <th colspan="2">1400</th>
                    <th colspan="2">1500</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="oddcol-1" colspan="2">MON</td>
                    <td className="evencol" colspan="2"> </td>
                    <td className="oddcol" colspan="2"> </td>
                    <td className="evencol" colspan="2"> </td>
                    <td className="oddcol" colspan="2"> </td>
                    <td className="evencol" colspan="2"> </td>
                    <td className="oddcol" colspan="2"> </td>
                    <td className="evencol" colspan="2"> </td>
                    <td className="oddcol" colspan="2"> </td>
                </tr>
                <tr>
                <td className="oddcol-1" colspan="2">TUE</td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                </tr>
                <tr>
                <td className="oddcol-1" colspan="2">WED</td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                </tr>
                <tr>
                <td className="oddcol-1" colspan="2">THU</td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                </tr>
                <tr>
                <td className="oddcol-1" colspan="2">FRI</td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                <td className="evencol" colspan="2"> </td>
                <td className="oddcol" colspan="2"> </td>
                </tr>
            </tbody>
            </table>
            <a id="share" href="../Login/login.html">Share</a>
            <a id="createEventbtn" href="createEventSlot.html">Add Event</a>
            <input type="text" placeholder="Add module to timetable" id="addModule" name="addModule"/>
            <hr></hr>
            <p id="yourModules">Your modules:</p>
            <p>No modules to show.</p>
            <p id="totalMCs">Total MCs: 0 MCs</p>
            </div>
      </div>
    );
    }
}