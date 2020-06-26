import React from 'react';
import './Timetable.css';

export default class Timetable extends React.Component {
    render(){
        return (
            <table>
                <thead>
                    <tr>
                        <th> </th>
                        <th colspan="2">0800</th>
                        <th colspan="2">0900</th>
                        <th colspan="2">1000</th>
                        <th colspan="2">1100</th>
                        <th colspan="2">1200</th>
                        <th colspan="2">1300</th>
                        <th colspan="2">1400</th>
                        <th colspan="2">1500</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="Mon">
                        <td className="oddcol-1" colspan="2">MON</td>
                        <td className="evencol" id='0800'>mon1</td>
                        <td className="oddcol" id='0830'>mon2</td>
                        <td className="evencol" id='0900'>mon3</td>
                        <td className="oddcol" id='0930'>mon4</td>
                        <td className="evencol" id='1000'>mon5</td>
                        <td className="oddcol" id='1030'>mon6</td>
                        <td className="evencol" id='1100'>mon7</td>
                        <td className="oddcol" id='1130'>mon8</td>
                        <td className="evencol" id='1200'>mon9</td>
                        <td className="oddcol" id='1230'>mon10</td>
                        <td className="evencol" id='1300'>mon11</td>
                        <td className="oddcol" id='1330'>mon12</td>
                        <td className="evencol" id='1400'>mon13</td>
                        <td className="oddcol" id='1430'>mon14</td>
                        <td className="evencol" id='1500'>mon15</td>
                        <td className="oddcol" id='1530'>mon16</td>
                    </tr>
                    <tr className="Tues">
                        <td className="oddcol-1" colspan="2">TUE</td>
                        <td className="evencol">tues1</td>
                        <td className="oddcol">tues2</td>
                        <td className="evencol">tues3</td>
                        <td className="oddcol">tues4</td>
                        <td className="evencol">tues5</td>
                        <td className="oddcol">tues6</td>
                        <td className="evencol">tues7</td>
                        <td className="oddcol">tues8</td>
                        <td className="evencol">tues9</td>
                        <td className="oddcol">tues10</td>
                        <td className="evencol">tues11</td>
                        <td className="oddcol">tues12</td>
                        <td className="evencol">tues13</td>
                        <td className="oddcol">tues14</td>
                        <td className="evencol">tues15</td>
                        <td className="oddcol">tues16</td>
                    </tr>
                    <tr className="Wed">
                        <td className="oddcol-1" colspan="2">WED</td>
                        <td className="evencol">wed1</td>
                        <td className="oddcol">wed2</td>
                        <td className="evencol">wed3</td>
                        <td className="oddcol">wed4</td>
                        <td className="evencol">wed5</td>
                        <td className="oddcol">wed6</td>
                        <td className="evencol">wed7</td>
                        <td className="oddcol">wed8</td>
                        <td className="evencol">wed9</td>
                        <td className="oddcol">wed10</td>
                        <td className="evencol">wed11</td>
                        <td className="oddcol">wed12</td>
                        <td className="evencol">wed13</td>
                        <td className="oddcol">wed14</td>
                        <td className="evencol">wed15</td>
                        <td className="oddcol">wed16</td>
                    </tr>
                    <tr className="Thurs">
                        <td className="oddcol-1" colspan="2">THU</td>
                        <td className="evencol">thurs1</td>
                        <td className="oddcol">thurs2</td>
                        <td className="evencol">thurs3</td>
                        <td className="oddcol">thurs4</td>
                        <td className="evencol">thurs5</td>
                        <td className="oddcol">thurs6</td>
                        <td className="evencol">thurs7</td>
                        <td className="oddcol">thurs8</td>
                        <td className="evencol">thurs9</td>
                        <td className="oddcol">thurs10</td>
                        <td className="evencol">thurs11</td>
                        <td className="oddcol">thurs12</td>
                        <td className="evencol">thurs13</td>
                        <td className="oddcol">thurs14</td>
                        <td className="evencol">thurs15</td>
                        <td className="oddcol">thurs16</td>
                    </tr>
                    <tr className="Fri">
                        <td className="oddcol-1" colspan="2">FRI</td>
                        <td className="evencol">fri1</td>
                        <td className="oddcol">fri2</td>
                        <td className="evencol">fri3</td>
                        <td className="oddcol">fri4</td>
                        <td className="evencol">fri5</td>
                        <td className="oddcol">fri6</td>
                        <td className="evencol">fri7</td>
                        <td className="oddcol">fri8</td>
                        <td className="evencol">fri9</td>
                        <td className="oddcol">fri10</td>
                        <td className="evencol">fri11</td>
                        <td className="oddcol">fri12</td>
                        <td className="evencol">fri13</td>
                        <td className="oddcol">fri14</td>
                        <td className="evencol">fri15</td>
                        <td className="oddcol">fri16</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
