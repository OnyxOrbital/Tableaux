import React from 'react';
import './MyModules.css';
import Module from '../Module/Module';

export default class MyModules extends React.Component {
    //define remove track function
    render() {
        return (
            <div className="MyModules">
               {this.props.modules.map(module => {
                   return <Module module={module} 
                //    onRemove={this.removeTrack}
                   />
               })}
            </div>
        );
    }
}
