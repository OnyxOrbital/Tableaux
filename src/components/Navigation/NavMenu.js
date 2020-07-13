import React from 'react';
import './NavMenu.css';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class NavMenu extends React.Component {
  constructor() {
    super();
    
    this.state = {
      showMenu: false,
    };
    
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }
  
  showMenu(event) {
    event.preventDefault();
    
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  
  closeMenu(event) {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });  
  }

  render() {
    return (
      <div className="navMenu">
        <button onClick={this.showMenu}>
          <i className="fa fa-bars" style={{fontSize: '40px'}}></i>
        </button>
        {
          this.state.showMenu
            ? (
              <div
                className="menu"
                ref={(element) => {
                  this.dropdownMenu = element;
                }}
              >
              <Link to={ROUTES.YOUR_TIMETABLE}><i class="fa fa-calendar-o" style={{fontSize: '25px'}}></i><p>Your Timetable</p></Link>
              <Link to={ROUTES.MODULES}><i class="fa fa-graduation-cap" style={{fontSize: '25px'}}></i><p>Modules</p></Link>
              <Link to={ROUTES.SHARED_TIMETABLE}><i class="fa fa-share-alt" style={{fontSize: '25px'}}></i><p>Shared Timetables</p></Link>
              <Link to={ROUTES.MY_CONSULTS}><i class="fa fa-users" style={{fontSize: '25px'}}></i><p>My Consults</p></Link>
              <Link to={ROUTES.PROFILE}><i class="fa fa-user-circle" style={{fontSize: '25px'}}></i><p>Profile</p></Link>
              </div>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}

export default withRouter(NavMenu);