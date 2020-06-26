import React from 'react';
// import './MyModules.css';
import Consult from '../Consult/Consult';

export default class ConsultList extends React.Component {
    //define remove track function
    render() {
        return (
            <div className="MyModules">
              {this.props.consults.map(consult => {
                   return <Consult consult={consult} />
               })}
            </div>
        );
    }
}
