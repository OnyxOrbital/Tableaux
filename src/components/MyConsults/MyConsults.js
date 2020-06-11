import React from 'react';
import './MyConsults.css';

export class MyConsults extends React.Component {
  render(){
    return (
      <div>
        <div className="consultsList">
        <h2>My Consults</h2>
  
        <table>
          <tr>
            <th>Name</th>
            <th>Identity</th>
            <th>Date</th>
            <th>Time</th>
            <th>Venue</th>
            <th>Status</th>
            <th>Remarks</th>
            <th></th>
          </tr>
          <tr className="evenRow">
            <td><a href="lianchiuTT.html">Lian Chiu</a></td>
            <td>TA</td>
            <td>11/06/2020</td>
            <td>15:00</td>
            <td>S17, 05-12</td>
            <td className="status">Confirmed</td>
            <td>Bring chapter 6 materials</td>
            <td className="cancelbox">
              <a className="cancel" href="editBooking.html">Cancel</a>
            </td>
          </tr>
          <tr className="oddRow">
            <td><a href="lianchiuTT.html">Benson Lee</a></td>
            <td>TA</td>
            <td>15/07/2020</td>
            <td>11:00</td>
            <td>LT27</td>
            <td className="status">Pending</td>
            <td>-</td>
            <td className="cancelbox">
              <a className="cancel" href="editBooking.html">Cancel</a>
            </td>
          </tr>
          <tr className="evenRow">
            <td><a href="michellegohTT.html">Michelle Goh</a></td>
            <td>Student</td>
            <td>16/09/2020</td>
            <td>10:00</td>
            <td>COM1</td>
            <td className="status">Confirmed</td>
            <td>-</td>
            <td className="cancelbox">
              <a className="cancel" href="editBooking.html">Cancel</a>
            </td>
          </tr>
          <tr>
            <td><a href="michellegohTT.html">Jamie Ferguson</a></td>
            <td>Student</td>
            <td>16/09/2020</td>
            <td>17:00</td>
            <td>COM2</td>
            <td className="status">Pending</td>
            <td>-</td>
            <td className="pendingbox">
              <button className="pending">Accept</button>
              <button className="pending">Decline</button>
            </td>
          </tr>
        </table>
      </div>
  
      <div id="acceptModal" className="modal">
        <span onclick="document.getElementById('acceptModal').style.display='none'" className="close" title="Close Modal">&times;</span>
        <form className="modal-content" action="">
          <div className="container">
            <h1>Accept Booking</h1>
            <p>Are you sure you want to accept the booking?</p>
  
            <div className="clearfix">
              <button type="button" className="yesbtn" id="yesbtn-accept">Yes</button>
              <button type="button" className="nobtn" id="nobtn-accept">No</button>
            </div>
          </div>
        </form>
      </div>
  
      <div id="declineModal" className="modal">
        <span onclick="document.getElementById('declineModal').style.display='none'" className="close" title="Close Modal">&times;</span>
        <form className="modal-content" action="">
          <div className="container">
            <h1>Decline Booking</h1>
            <p>Are you sure you want to decline the booking?</p>
  
            <div className="clearfix">
              <button type="button" className="yesbtn" id="yesbtn-decline">Yes</button>
              <button type="button" className="nobtn" id="nobtn-decline">No</button>
            </div>
          </div>
        </form>
      </div> 
      </div> 
    );
  }
}