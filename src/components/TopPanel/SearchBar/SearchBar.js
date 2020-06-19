import React from 'react';
import './SearchBar.css';
// import searchIcon from '../../../images/search-icon.gif';
// import SearchResults from '../SearchResults/SearchResults';
// import nusmods from '../../../nusmods';
// import moduleCodes from './moduleCodes.json';
// import Select from 'react-virtualized-select';
// import createFilterOptions from 'react-select-fast-filter-options';
import Select from 'react-select';

export default class SearchBar extends React.Component {
    // constructor(props) {
    //   super(props);
    //   // this.state = {
    //   //   modCode: ''
    //   // }
    //   // this.search = this.search.bind(this);
    //   this.handleTermChange = this.handleTermChange.bind(this);
    // }
  
    // search() {
    //   this.props.onSearch(this.state.modCode);
    // }

    // handleTermChange(event) {
    //   this.setState({ modCode: event.target.value });
    // }
    constructor(props) {
      super(props);
      this.state = {
        searchResults: []
      }
      // this.search = this.search.bind(this);
    }

    // search() {
    //   nusmods.search().then(searchResults => {
    //     this.setState({searchResults: searchResults})
    //   });
    // }

    componentDidMount() {
      fetch(`https://api.nusmods.com/v2/2019-2020/moduleList.json`)
        .then(response => response.json())
        // .then(jsonResponse => {
        //   jsonResponse.map(module => {
        //     return {
        //       value: module.moduleCode, 
        //       label: module.title
        //   };
        //   })})
        .then(searchResults => this.setState({ searchResults: searchResults }));
    }

    // update() {
    //   // Declare variables
    //   var input, filter, ul, li, a, i, txtValue;
    //   input = document.getElementById('myInput');
    //   filter = input.value.toUpperCase();
    //   ul = document.getElementById("myUL");
    //   li = ul.getElementsByTagName('li');
    
    //   // Loop through all list items, and hide those who don't match the search query
    //   for (i = 0; i < li.length; i++) {
    //     txtValue = li[i].innerHTML;
    //     // txtValue = li.textContent || li.innerText;
    //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //       li[i].style.display = "";
    //     } else {
    //       li[i].style.display = "none";
    //     }
    //   }
    // }

    render() {
        // this.search();
        return (
        // <div className="search">
        //   <img src={searchIcon} id="searchimg"/>
        //   <input onChange={this.handleTermChange} type="text" placeholder="Search" id="searchinput" name="search" onKeyPress={event => {
        //         if (event.key === 'Enter') {
        //           this.search()
        //         }
        //       }}/>
        //   <SearchResults searchResults={this.props.searchResults} />
        // </div>);

        //The good one
            // <div className="search">
            //   {/* <input select="options" type="text" id="myInput" onkeyup={this.update} placeholder="Enter module code" /> */}
            //   <select form="form" id="options">
            //     {this.state.searchResults.map(module => <option value={module.moduleCode}>{module.moduleCode}</option>)}
            //   </select>
            // </div>
            
            // <div className="search">
            //   <input type="text" id="myInput" onkeyup={this.update} placeholder="Enter module code" />
            //   <ul id="myUL">
            //     {this.state.searchResults.map(module => <li>{module.moduleCode}</li>)}
            //   </ul>
            // </div>
            // <Select
            //   name="university"
            //   value="one"
            //   options={this.state.searchResults}
            //   filterOptions={createFilterOptions(this.state.searchResults)}
            //   onChange={val => console.log(val)}
            // />
            
            // search bar a bit laggy
            <Select id="dropdown" placeholder='Enter module code' 
            options={this.state.searchResults.map(module => { return {value: module.moduleCode, label: module.moduleCode}})} 
            onChange={this.props.action} />
        );
    }
}