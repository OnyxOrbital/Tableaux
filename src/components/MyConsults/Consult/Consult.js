import React from 'react';

export default class Consult extends React.Component {
    render() {
        return(
            <tr>
                <td>{this.props.consult.name}</td>
                <td>Identity</td>
                <td>{this.props.consult.startDate}</td>
                <td>{this.props.consult.endDate}</td>
                <td>Venue</td>
                <td>{this.props.consult.status}</td>
                <td>Remarks</td>
                <td><button className="cancel">Cancel</button></td>
            </tr>
        );
    }
}