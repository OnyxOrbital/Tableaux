
// import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
// import { compose } from 'recompose';
 
// import { withFirebase } from '../Firebase';
// import * as ROUTES from '../../constants/routes';
 
import React from 'react';
 
import { withFirebase } from '../Firebase';
 
const SignInButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignIn}>
    Sign In
  </button>
);
 
export default withFirebase(SignInButton);

// const SignInPage = () => (
//   <div>
//     <h1>SignIn</h1>
//     <SignInForm />
//   </div>
// );
 
// const INITIAL_STATE = {
//   email: '',
//   password: '',
//   error: null,
// };
 
// class SignInFormBase extends Component {
//   constructor(props) {
//     super(props);
 
//     this.state = { ...INITIAL_STATE };
//   }
 
//   onSubmit = event => {
//     const { email, password } = this.state;
 
//     this.props.firebase
//       .doSignInWithEmailAndPassword(email, password)
//       .then(() => {
//         this.setState({ ...INITIAL_STATE });
//         this.props.history.push(ROUTES.HOME);
//       })
//       .catch(error => {
//         this.setState({ error });
//       });
 
//     event.preventDefault();
//   };
 
//   onChange = event => {
//     this.setState({ [event.target.name]: event.target.value });
//   };
 
//   render() {
//     const { email, password, error } = this.state;
 
//     const isInvalid = password === '' || email === '';
 
//     return (
//       <form onSubmit={this.onSubmit}>
//         <div class='login'>
//           <h1>Login</h1>
//           <hr/>

//           <div class="email">
//             <label for="email"><strong>NUS Email</strong></label>
//             <br/>
//             <div class="emailbox">
//               <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Enter NUS Email" id="email" required/>
//               <p><strong>@u.nus.edu</strong></p>
//             </div>
//           </div>


//           <div class="password">
//             <label for="password"><strong>Password</strong></label>
//             <br/>
//             <input name="password" value={password} onChange={this.onChange} type="password" placeholder="Enter Password" required/>
//           </div>

//           {/* <div class="remember">
//             <label>
//               <input type="checkbox" name="remember" id="remember"/> Remember me
//             </label>
//           </div> */}
// {/* 
//           <div class="submission"> 
//             <a type="button" id="loginbtn">Login</a>
//             <a type="button" id="cancelbtn" href="../Homepage/yourTimetable.html">Cancel</a>
//           </div> */}

//           <button disabled={isInvalid} type="submit">
//           Sign In
//           </button>
 
//           {error && <p>{error.message}</p>}

//         </div>
//       </form>
//     );
//   }
// }
 
// const SignInForm = compose(
//   withRouter,
//   withFirebase,
// )(SignInFormBase);
 
// export default SignInPage;
 
// export { SignInForm };
