import React from 'react';
import './SearchBar.css';
import Select from 'react-select';
import { withFirebase } from '../Firebase';


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
    }
  }

  componentDidMount() {
    fetch(`https://api.nusmods.com/v2/2019-2020/moduleList.json`)
      .then(response => response.json())
      .then(searchResults => this.setState({ searchResults: searchResults }));
  }

  render() {
    return (
      // search bar a bit laggy
      <Select id="searchBar" placeholder='Enter module code'
      options={this.state.searchResults.map(module => { return {value: module.moduleCode, label: module.moduleCode}})}
      onChange={this.props.action}
      theme={(theme) => ({
      ...theme,
      borderRadius: 5,
      colors: {
      // ...theme.colors,
      // danger: '#171a24',
      neutral0: '#171a24',
      neutral20: '#e2dce3',
      neutral40: '#F1C944',
      neutral50: '#e2dce3',
      text: '#F1C944',
      primary25: 'rgb(61, 71, 102)',
      primary: '#F1C944',
      // rgb(61, 71, 102)
      },
    })}
    // maxMenuHeight={}
      />
    );
  }
}

export default withFirebase(SearchBar);
