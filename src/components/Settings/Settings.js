import React from 'react';
import './Settings.css';
import SignOutButton from '../SignOut/SignOut';

export default class Settings extends React.Component {
    render() {
        return (
            <div className="button">
                <SignOutButton />
            </div>
        );
    }
}