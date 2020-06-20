import React from 'react';
import './SearchBar.css';
import Select from 'react-select';

export default class SearchBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchResults: []
      }
    }

    componentDidMount() {
      fetch(`https://api.nusmods.com/v2/2019-2020/moduleList.json`)
        .then(response => response.json())
        .then(searchResults => this.setState({ searchResults: searchResults }));
    }


    render() {
        return (
        //The good one
            // <div className="search">
            //   {/* <input select="options" type="text" id="myInput" onkeyup={this.update} placeholder="Enter module code" /> */}
            //   <select form="form" id="options">
            //     {this.state.searchResults.map(module => <option value={module.moduleCode}>{module.moduleCode}</option>)}
            //   </select>
            // </div>
            
            // search bar a bit laggy
            <Select id="dropdown" placeholder='Enter module code' 
            options={this.state.searchResults.map(module => { return {value: module.moduleCode, label: module.moduleCode}})} 
            onChange={this.props.action} />
        );
    }
}