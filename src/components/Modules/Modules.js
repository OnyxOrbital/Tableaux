import React from 'react';
import {
    Link
  } from 'react-router-dom'
import './Modules.css';
import ReactLoading from 'react-loading';

// list of all modules in module tab
export default class Modules extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        moduleListResults: []
      }
  }

  componentDidMount() {
    fetch(`https://api.nusmods.com/v2/2020-2021/moduleList.json`)
      .then(response => response.json())
      .then(moduleListResults => this.setState({ moduleListResults: moduleListResults }));
  }

  render(){
    if (this.state.moduleListResults && this.state.moduleListResults.length > 0) {
      return (
        <div className="AllModules">
          <h1>Modules</h1>
          <ul>
            {this.state.moduleListResults.map(module => {
              return (
                <li key={module.moduleCode}>
                  <Link to={`/Modules/${module.moduleCode}`}>{module.moduleCode} {module.title}</Link>
                </li>)})}
          </ul>
        </div>);
    } else {
      return (
        <div className="AllModules">
          <h1>Modules</h1>
          <ReactLoading className="spinner" type='spin' color='white' height={'5%'} width={'5%'} />
        </div>); 
    }
  }
}
