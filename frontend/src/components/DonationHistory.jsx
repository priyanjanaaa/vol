import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const DonationHistory=()=>{
  const[donation,setDonation]=useState([]);
  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,async(user)=>{
      if(user){
        const refdoc=collection(db,"users",user.uid,"donations");
        const snap=await getDocs(refdoc);
        const donationList=snap.docs.map(doc=>({id:doc.id,...doc.data()}));
        setDonation(donationList);

  }});
 
  return ()=>unsubscribe();
  
  },[])


  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Your Donation History</h2>
      <div className="row">
        {donation.length === 0 && <p className="text-center">No donations yet.</p>}
        {donation.map((donation) => (
          <div className="col-md-4 mb-4" key={donation.id}>
            <div className="card shadow p-3">
              <h5 className="card-title">{donation.item}</h5>
              <p className="card-text"><strong>Quantity:</strong> {donation.quantity}</p>
              <p className="card-text"><strong>Pickup:</strong> {donation.pickuptime}</p>
              <p className="card-text"><strong>Status:</strong> {donation.status}</p>
              <p className="card-text text-muted"><small>{new Date(donation.Time.seconds * 1000).toLocaleString()}</small></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationHistory;