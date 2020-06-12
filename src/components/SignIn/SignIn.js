import React from 'react';
 
const SignIn = () => (
  <form action="" method="">
    <div class='login'>
      <h1>Login</h1>
      <hr/>

      <div class="email">
        <label for="email"><strong>NUS Email</strong></label>
        <br/>
        <div class="emailbox">
          <input type="text" placeholder="Enter NUS Email" id="email" name="email" required/>
          <p><strong>@u.nus.edu</strong></p>
        </div>
      </div>


      <div class="psword">
        <label for="psword"><strong>Password</strong></label>
        <br/>
        <input type="password" placeholder="Enter Password" name="psword" required/>
        </div>

      <div class="register">
        <p>Don't have an account? Sign up here.</p>
      </div>
      <div class="remember">
        <label>
          <input type="checkbox" name="remember" id="remember"/> Remember me
        </label>
      </div>

      <div class="submission"> 
        <a type="button" id="loginbtn">Login</a>
        <a type="button" id="cancelbtn" href="../Homepage/yourTimetable.html">Cancel</a>
      </div>

    </div>
  </form>
);
 
export default SignIn;