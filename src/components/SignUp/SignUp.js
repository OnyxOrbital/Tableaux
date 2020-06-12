import React from 'react';
 
const SignUp = () => (
  <form action="" method="">
    <div class='register'>
      <h1>Register Now</h1>
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
        <br />
        <input type="text" placeholder="Enter Password" name="psword" required/>
        </div>

      <div class="psw-repeat">
        <label for="psw-repeat"><strong>Confirm Password</strong></label>
        <br />
        <input type="password" placeholder="Repeat Password" name="psw-repeat" required/>
      </div>

      <p>Already have an account? Login here.</p>
      <p id="t-pline">By creating an account you agree to our Terms and Privacy.
      </p>

      <div class="remember">
        <label>
          <input type="checkbox" name="remember" id="remember"/> Remember me
        </label>
      </div>

      <div class="submission">
        <a type="submit" id="registerbtn">Register</a>
        <a type="button" id="cancelbtn" href="../Homepage/yourTimetable.html">Cancel</a>
      </div>

    </div>
  </form>
);
 
export default SignUp;