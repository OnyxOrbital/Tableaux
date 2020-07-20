import React from 'react';
import './MyModules.css';
import Module from '../Module/Module';

export default class MyModules extends React.Component {
  render() {
    return (
      <div className="MyModules">
        {this.props.modules.map(module => {
          return <Module key={module} module={module} 
          />
        })}
      </div>
    );
  }
}
