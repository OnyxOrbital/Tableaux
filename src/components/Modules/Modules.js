import React from 'react';
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
            this.state.moduleListResults.map(module => { 
                return (
                    <div key={module.moduleCode} className="module">
                        <h2><a href="">{module.moduleCode} + " " + {module.title}</a></h2>
                        <h3>{module.department} + " | " + {module.moduleCredit}</h3>
                        <h3>{module.description}</h3>
                        <h3><strong>Preclusions</strong></h3>
                        <h3>{module.preclusion}</h3>
                    </div>
                );
            })
        );
    }
}
