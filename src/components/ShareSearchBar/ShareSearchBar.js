import React from 'react';
// import './ShareSearchBar.css';
import Select from 'react-select';
import { withFirebase } from '../Firebase';


class ShareSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }
  }

 async componentDidMount() {
    if (this.props.users) {
      let users = await this.props.users.then(result => result);
      console.log("this.props.users", this.props.users)
      console.log('users in sharesearchbar', users)
      this.setState({ users: users});
    }
  }

  render() {
    if (this.state.users) {
      return (
        <Select id="searchBar" placeholder='Enter username'
        options={this.state.users.map(user => { return {value: user, label: user}})}
        onChange={this.props.action}
        openMenuOnClick={false}
        theme={(theme) => ({
        ...theme,
        borderRadius: 5,
        colors: {
        neutral0: '#171a24',
        neutral20: '#e2dce3',
        neutral40: '#F1C944',
        neutral50: '#e2dce3',
        text: '#F1C944',
        primary25: 'rgb(61, 71, 102)',
        primary: '#F1C944',
        },
      })}
        />
      );
    } else {
      return <p style={{color: 'red'}}>Please wait for data to load...</p>
    }
  }
}

export default withFirebase(ShareSearchBar);
