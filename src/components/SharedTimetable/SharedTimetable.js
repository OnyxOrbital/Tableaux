import React from 'react';
import './SharedTimetable.css';
import { Link } from 'react-router-dom';

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
                            <td><Link className="link" to="/SharedTimetables/LianChiu">Lian Chiu</Link></td>
                            <td>TA</td>
                        </tr>
                        <tr className="oddRow">
                        <td><a className="link">Benson Lee</a></td>
                        <td>TA</td>
                        </tr>
                        <tr className="evenRow">
                        <td><a className="link">Michelle Goh</a></td>
                        <td>Student</td>
                        </tr>
                        <tr className="oddRow">
                        <td><a className="link">Jamie Ferguson</a></td>
                        <td>Student</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        );
    }
}