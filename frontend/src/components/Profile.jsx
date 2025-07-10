import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile=()=>{
  const[userData,setUserData]=useState({username:"",password:""});
  const[newname,setNewName]=useState('');
  const[newpassword,setNewPassword]=useState('');
  const[message,setMessage]=useState('');
  const navigate=useNavigate();
  const user=auth.currentUser;

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserData({ ...data, email: user.email });
        setNewName(data.username);

        }
      };
      
    }
  )},[]);

 const handleNameUpdate=async ()=>{
  try{
    const userRef=doc(db,"users",user.uid);
    await updateDoc(userRef,{
      username:newname
    });
    setMessage("Name successfully updated");
    setUserData(prev=>({...prev,username:newname}));

  }
  catch{
    setMessage("Error in updating");

  }
 }

 const handlePasswordUpdate=async()=>{
  if(!newpassword){
    return;
  }
  try{
    const currentpassword=prompt("Enter your current pasword");
    const credential=EmailAuthProvider.credential(user.email,currentpassword);
    await reauthenticateWithCredential(user,credential);
    await updatePassword(user,newpassword);
    setMessage("Password updated");

  }
  catch{
    setMessage("Error in updating password");
  }



 }
 return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Your Profile</h3>

        <div className="mb-3">
          <label className="form-label">Email (read-only)</label>
          <input className="form-control" value={userData.email} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={newname}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleNameUpdate}>Update Name</button>
        </div>

        <div className="mb-3">
          <label className="form-label">Change Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn btn-warning mt-2" onClick={handlePasswordUpdate}>Update Password</button>
        </div>

        <button className="btn btn-secondary mt-3" onClick={() => navigate('/DonorDashboard')}>← Back</button>

        {message && <div className="alert alert-info mt-4">{message}</div>}
      </div>
    </div>
  );
  
 
};
export default Profile;