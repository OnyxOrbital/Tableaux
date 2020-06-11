import React from 'react';
import './SearchBar.css';
import searchIcon from '../../../images/search-icon.gif';

export class SearchBar extends React.Component {
    render() {
        return (
        <div className="search">
        <img src={searchIcon} id="searchimg"/>
        <input type="text" placeholder="Search" id="searchinput" name="search"/>
      </div>);
    }
}