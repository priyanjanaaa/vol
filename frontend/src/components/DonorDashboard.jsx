import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DonorDashboard = () => {
  const [username, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserName(data.username);
        }
      } else {
        navigate("/login"); 
      }
    });

    return () => unsubscribe(); 
  }, [navigate]);

  return (
    <div className="donor-dashboard container mt-5">
      <h2 className="heading">Welcome{ username ? `, ${username}` : '...' }</h2>
      <div className="change-to mt-4">
        <button className="btn btn-success m-2" onClick={() => navigate('/MakeDonation')}>Make donation</button>
        <button className="btn btn-primary m-2" onClick={() => navigate('/DonationHistory')}>Donation History</button>
        <button className="btn btn-warning m-2" onClick={() => navigate('/Profile')}>Profile</button>
        <button className="btn btn-info m-2" onClick={() => navigate('/PickupScheduler')}>Pickup Scheduler</button>
      </div>
    </div>
  );
};

export default DonorDashboard;
