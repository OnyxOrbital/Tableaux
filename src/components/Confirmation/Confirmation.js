import React from 'react';
import './Confirmation.css';
import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router-dom';

export default class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            cancel: null
        }
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.uncancel = this.uncancel.bind(this);
    }

    confirm() {
        // console.log(this.props.path)
        // // useHistory.push('/MyConsults');
        // return <Redirect to='/MyConsults' />;
        this.setState({ redirect: true });
    }

    cancel() {
        this.setState({ cancel: true });
    }

    uncancel() {
        this.setState({ cancel: null });
    }
    render() {
        // return confirmAlert({
        //     customUI: ({ onClose }) => {
            if (this.state.redirect) {
                return <Redirect to='/MyConsults' />;
            }

            if (this.state.cancel) {    
              return null;
            }

            // this.uncancel();

              return (
                <div id='container' className='custom-ui'>
                  <h1>{this.props.message}</h1>
                  <button onClick={this.confirm}>Confirm</button>
                  {/* <Link to={this.props.path}>Confirm</Link> */}
                  <button onClick={this.cancel}>Cancel</button>
                </div>
              );
        //     }
        //   });
    }
  }