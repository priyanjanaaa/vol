import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import { auth,db } from "../firebase";

import { setDoc, doc } from "firebase/firestore";  

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const userCredential=await createUserWithEmailAndPassword(auth,email,password);
      const user=userCredential.user;
      await sendEmailVerification(user);
      await setDoc(doc(db,"users",user.uid),{
        email,
        username,
        role,
        createdAt: new Date(),
      });
      
      navigate('/');
    }
    catch(e){
      if(e.code==="auth/email-already-in-use"){
        alert("Email already in use");
      }
      alert(e.message);
    }

    
  };

  const handlealr = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100" >
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "500px",minHeight: "500px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="volunteer">Volunteer</option>
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          <button className="btn btn-success w-100 mb-2" type="button" onClick={handleSubmit}>
            Create Account
          </button>

          <p className="text-center">Already have an account? You can just login</p>
          <button className="btn btn-outline-secondary w-100" onClick={handlealr}>
            Go back to login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
