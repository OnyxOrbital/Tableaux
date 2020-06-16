import React from 'react';
import './SharedTimetable.css';

export default class SharedTimetable extends React.Component {
    render() {
        return (
            <div className="sharedTimetables">
            <h2>Shared Timetables</h2>

            <div className="sharedList">
                <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Identity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="evenRow">
                        <td><a href="lianchiuTT.html">Lian Chiu</a></td>
                        <td>TA</td>
                    </tr>
                    <tr className="oddRow">
                    <td><a href="lianchiuTT.html">Benson Lee</a></td>
                    <td>TA</td>
                    </tr>
                    <tr className="evenRow">
                    <td><a href="michellegohTT.html">Michelle Goh</a></td>
                    <td>Student</td>
                    </tr>
                    <tr className="oddRow">
                    <td><a href="michellegohTT.html">Jamie Ferguson</a></td>
                    <td>Student</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        );
    }
}