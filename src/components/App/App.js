import React from 'react';
import './App.css';
import { MainTab } from '../Tab/Tab';
import TopPanel from '../TopPanel/TopPanel';


class App extends React.Component {
  render(){
    return (
      <div>
        <TopPanel />
        <MainTab />
      </div>
    );
  }
}

export default App;
