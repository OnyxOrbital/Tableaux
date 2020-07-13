import React from 'react';
import './Consult.css';

export default class Consult extends React.Component {
    render() {
        return(
            <tr className="tableRow">
                <td>{this.props.consult.username}</td>
                <td>{this.props.consult.identity}</td>
                <td>{this.props.consult.startDate}</td>
                <td>{this.props.consult.endDate}</td>
                <td>Venue</td>
                <td id="status">{this.props.consult.status}</td>
                <td>None</td>
                {this.props.consult.identity === "Student" ?
                  (<div>
                    <td><button className="cancel">Accept</button></td>
                    <td><button className="cancel">Decline</button></td>
                  </div>):
                  (<td><button className="cancel">Cancel</button></td>)
                }
                
            </tr>
        );
    }
}
