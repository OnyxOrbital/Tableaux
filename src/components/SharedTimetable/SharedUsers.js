import React from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';

 class SharedUsers extends React.Component {
  render() {
    return (
      <div>
          <ul>
          {this.props.users ? this.props.users.map(user => {
            console.log('user[1]', user[1])
              return (
              <li>
                <Link to={{
                  pathname: `/SharedTimetables/${user[0].replace(/\s/g, "")}`, 
                  props: {
                    displayedData: user[2],
                    username: user[0],
                    uid: user[1]
                    }
                  }}>{user[0]}</Link>
              </li>)}) : (<li>You have no friends :(</li>)}
          </ul>
      </div>
    );
  }
}

export default withFirebase(SharedUsers);