import React from 'react';
import {
    BrowserRouter as Router,
    Link
  } from 'react-router-dom'
import './Modules.css';

// list of all modules in module tab
export default class Modules extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        moduleListResults: []
      }
  }

  componentDidMount() {
    fetch(`https://api.nusmods.com/v2/2019-2020/moduleInfo.json`)
      .then(response => response.json())
      .then(moduleListResults => this.setState({ moduleListResults: moduleListResults }));
  }

  render(){
    return (
      <div className="container">
        <h1>Modules</h1>
        <ul>
          {this.state.moduleListResults.map(module => {
            return (
              <li key={module.moduleCode}>
                <Link to={`/Modules/${module.moduleCode}`}>{module.moduleCode}</Link>
              </li>)})}
        </ul>
      </div>);
  }
}
