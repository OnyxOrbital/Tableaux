import React from 'react';
import './Consult.css';

export default class Consult extends React.Component {
    render() {
        return(
            <tr className="tableRow">
                <td>{this.props.consult.name}</td>
                <td>TA</td>
                <td>{this.props.consult.startDate}</td>
                <td>{this.props.consult.endDate}</td>
                <td>Venue</td>
                <td id="status">{this.props.consult.status}</td>
                <td>None</td>
                <td><button className="cancel">Cancel</button></td>
            </tr>
        );
    }
}
