import React from 'react';
import './SearchBar.css';
import Select from 'react-select';
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { withFirebase } from '../../Firebase';


class SearchBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchResults: [],
        // queryText: '',
        // menuIsOpen: false
      }
      // this.search = this.search.bind(this);
      // this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
      fetch(`https://api.nusmods.com/v2/2019-2020/moduleList.json`)
        .then(response => response.json())
        .then(searchResults => this.setState({ searchResults: searchResults }));
    }

    // .endAt(queryText+"/uf8ff")
    // handleInputChange(queryText) {
    //   // console.log(`queryText is ${queryText}`)
    //   const dbRef = this.props.firebase.database.ref('modules');
    //   let searchResults = [];
    //   dbRef.orderByChild('module_code').startAt(queryText).on('value', snapshot => {
    //     console.log(snapshot.val());
    //     snapshot.forEach((child) => {
    //       // console.log(child.key, child.val()); 
    //       searchResults.push(child.val());
    //       // console.log("searchResults",searchResults);
    //     });
    //     // snapshot.val().map(module => searchResults.push(module));
    //  });
    //   console.log("searchResults",searchResults);
    //   // dbRef.orderByChild('module_code').startAt(queryText).endAt(queryText+"/uf8ff").on('value', snapshot => {
    //   //    searchResults = snapshot.val()
    //   // });
    //   this.setState(
    //     { 
    //       searchResults: searchResults,
    //       menuIsOpen: true 
    //     });

    //     console.log("menu", this.state.menuIsOpen);
    //   // dbRef.orderByChild('module_code').limitToFirst(5).on('value', snapshot => {
    //   //   console.log(snapshot.val());
    //   // });
    //   // console.log(`queryText is ${this.state.queryText}`);
    //   // console.log(`menuOpen is ${this.state.menuIsOpen}`);
    //   // console.log(`search results is ${this.state.searchResults}`);
    // }


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
            // onChange={this.handleChange}
            onChange={this.props.action} 
            // onInputChange={() => { this.setState({ menuIsOpen: true })}}
            //  menuIsOpen={this.state.menuIsOpen}
            />
        );
    }
}

export default withFirebase(SearchBar);