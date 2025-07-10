import { signInWithEmailAndPassword } from "firebase/auth";
import{sendPasswordResetEmail} from "firebase/auth";
import {auth,db} from "../firebase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getDoc, doc } from "firebase/firestore";  


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
    const userCredential=await signInWithEmailAndPassword(auth,email,password);
    const user=userCredential.user;
    const userdocs=await getDoc(doc(db,"users",user.uid));

    if(userdocs){
      const role=userdocs.data().role;
    
    if(role==='volunteer'){
      navigate('/VolunteerDashboard');

    }
    else if(role==='donor'){
      navigate('/DonorDashboard');

    }

    else {
      navigate('/NgoDashboard')

    }
  }
    
      

    }
    catch(e){
      if(e.code==="auth/wrong-password"){
        alert("Wrong password for the username.You can click on forgot password.")
      }
      else if(e.code==="auth/invalid-email"){
        alert("Check your mail id");
      }

      else if(e.code==="auth/user-not-found"){
        alert("Consider creating an acount.");
      }
      else {
        alert(e.message);
      }

    }

  };
  const handlesignup = (e) => {
    e.preventDefault();
    navigate("/Signup");
  };

  const handleforgotpwd = async(e) => {
    e.preventDefault();
    const emailPrompt=prompt("Enter the email to send the rest pwd link to");
    if(!emailPrompt) return;
    try{
      await sendPasswordResetEmail(auth,emailPrompt);
      alert("Password reset link has been sent");
    }
    catch(e){
      if(e.code==="auth/invalid-email"){
        alert("Enter proper email");
      }
      else if(e.code==="auth/user-not-found"){
        alert("Consider signing up first.")
      }
      else{
        alert(e.message);
      }
    }
   


  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
     >
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Login here</h2>
        <form>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 mb-2 bg-success" onClick={handleSubmit}>
            Submit
          </button>

          <button className="btn btn-link w-100 mb-2" type="button" onClick={handleforgotpwd}>
            Forgot Password?
          </button>

          <p className="text-center">Not a registered user?</p>
          <button className="btn btn-outline-secondary w-100" onClick={handlesignup}>
            Sign-up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
