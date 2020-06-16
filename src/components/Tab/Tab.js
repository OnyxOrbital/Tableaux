// import React from 'react';
// import './Tab.css';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import { YourTimetable } from '../YourTimetable/YourTimetable';
// import { Modules } from '../Modules/Modules';
// import { SharedTimetable } from '../SharedTimetable/SharedTimetable';
// import { MyConsults } from '../MyConsults/MyConsults';
// import { Settings } from '../Settings/Settings';
// import yourTimetableIcon from '../../images/my-timetable-grey.gif';
// import modulesIcon from '../../images/all-modules-grey.gif';
// import sharedTimetablesIcon from '../../images/shared-timetables-grey.gif';
// import myConsultationIcon from '../../images/my-consultations-grey.gif';
// import settingsIcon from '../../images/settings-grey.gif';

// export class Tab extends React.Component {
//   render() {
//     return (
//       <div>
//         <img src={this.props.icon} />
//         <p>{this.props.tabName}</p>
//       </div>
//     );
//   }
// }

// export class MainTab extends React.Component {
//     render(){
//         return (
//  <Tabs defaultIndex={0}>
//       <TabList className="tabList">
//         <Tab className="tab"><img src={yourTimetableIcon}/>Your Timetable</Tab>
//         <Tab className="tab"><img src={modulesIcon}/>Modules</Tab>
//         <Tab className="tab"><img src={sharedTimetablesIcon}/>Shared Timetables</Tab>
//         <Tab className="tab"><img src={myConsultationIcon}/>My Consultations</Tab>
//         <Tab className="tab"><img src={settingsIcon}/>Settings</Tab>
//       </TabList>
   
//       <TabPanel>
//         <YourTimetable />
//       </TabPanel>
//       <TabPanel>
//         <Modules />
//       </TabPanel>
//       <TabPanel>
//           <SharedTimetable />
//       </TabPanel>
//       <TabPanel>
//           <MyConsults />
//       </TabPanel>
//       <TabPanel>
//           <Settings />
//       </TabPanel>
//     </Tabs> 
//     );
//     }
// }