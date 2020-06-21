import React from 'react';
import './ModuleInfo.css';
import { withRouter } from 'react-router-dom';

// for module info page
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
            <div key={module.moduleCode} className="module">
                <h1>{module.moduleCode}</h1>
                <h1>{module.title}</h1>
                <ul>
                    <li>{module.department}</li>
                    <li>{module.faculty}</li>
                    <li>{module.moduleCredit}</li>
                </ul>
                <hr />
                <h3><p>{module.description}</p></h3>
                <h3><strong>Preclusion</strong></h3>
                <h3>{module.preclusion}</h3>
            </div>
        );
    }
}

export default ModuleInfo;
