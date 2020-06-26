import React from 'react';
import './Confirmation.css';
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
    this.setState({ redirect: true });
  }

  cancel() {
    this.setState({ cancel: true });
  }

  uncancel() {
    this.setState({ cancel: null });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/MyConsults' />;
    }

    if (this.state.cancel) {    
      return null;
    }

    return (
      <div id='container' className='custom-ui'>
        <h1>{this.props.message}</h1>
        <button onClick={this.confirm}>Confirm</button>
        <button onClick={this.cancel}>Cancel</button>
      </div>
    );
  }
}