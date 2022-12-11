import { useState } from "react";
import LoginForm from "unauth/login";
import RegisterForm from "unauth/register";

const MemberForm = () => {
    const [mode,setMode] = useState(false);
    const setModeChange = () =>{
        setMode(!mode)
    }
    return (
      <>
        {!mode?<LoginForm setMode={setModeChange} /> : <RegisterForm setMode={setModeChange} />}
      </>
    );
  };

export default MemberForm;