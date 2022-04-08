import React, {useState} from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

import './App.css';


function App() {

  const clientId = "290601369459-19et5v76677pj4jlg3ro9t40aul5h0qk.apps.googleusercontent.com";

  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);

  const onLoginSuccess= (res) =>{
    console.log('Login Success:', res.profileObj);
    setShowloginButton(false);
    setShowlogoutButton(true);
  }

  const onLoginFailure=(res)=>{
    console.log('Login Failed', res);
  }

  const onSignoutSuccess=()=>{
    alert("You have been logged out successfully");
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
  }

  return (
    <div className='g-signin'>
      { showloginButton ?
      <GoogleLogin
        clientId={clientId}
        buttonText="Sign In"
        onSuccess={onLoginSuccess}
        onFailure={onLoginFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
      : null}

      { showlogoutButton ?
      <GoogleLogout
        clientId={clientId}
        buttonText="Sign Out"
        onLogoutSuccess={onSignoutSuccess}
      >

      </GoogleLogout>
      : null }
    </div>
  );
}

export default App;