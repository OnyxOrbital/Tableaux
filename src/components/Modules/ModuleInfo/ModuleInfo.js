import React from 'react';
import './ModuleInfo.css';

class ModuleInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      module: []
    }
  }

  render() {
    let moduleCode = this.props.match.params.moduleCode;

    fetch(`https://api.nusmods.com/v2/2019-2020/modules/${moduleCode}.json`)
      .then(response => response.json())
      .then(module => this.setState({ module: module }));

    let module = this.state.module;
    return (
        <div className="module" key={module.moduleCode}>
            <h1>{module.moduleCode} {module.title}</h1>
            <div className="details">
                <p>{module.department}</p>
                <p>{module.faculty}</p>
                <p>{module.moduleCredit}MC</p>
            </div>
            <hr />
            <h3><p>{module.description}</p></h3>
            <h3 id="preclusion"><strong>Preclusion</strong></h3>
            <h3>{module.preclusion}</h3>
        </div>
    );
  }
}

export default ModuleInfo;