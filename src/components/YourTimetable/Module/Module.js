import React from 'react';
import './Module.css';

export default class Module extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.removeModule = this.removeModule.bind(this);
    // }

    //add remove module function

    render() {
        return(
            <div className="Module">
                <div className="Module-information">
                    <h3>{this.props.module}</h3>
                </div>
                {/* <button className="Module-action" onClick={this.removeModule}>-</button> */}
            </div>
        );
    }
}