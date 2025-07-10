import React,{useState,useEffect} from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { onAuthStateChanged } from 'firebase/auth';

const PickupScheduler=()=>{
  const[donations,setDonations]=useState([]);
  const[user,setUser]=useState(null);
  const[messages,setMessages]=useState('');
  const [updates, setUpdates] = useState({});
  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(currentuser)=>{
      if(currentuser){
        setUser(currentuser);
        fetchDetails(currentuser);
      }
      else{
        setUser(null);
      }
    })
    return ()=>unsubscribe();
  },[])
  

  const fetchDetails=async (currentuser)=>{
    if(!currentuser) return;
    const donRef=collection(db,'users',currentuser.uid,'donations');
    const snapshot=await getDocs(donRef);
    const donationList=snapshot.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }));
    setDonations(donationList);

  }



  const handleReschedule=async(id,newtime,newdate)=>{
    const donRef=doc(db,"users",user.uid,"donations",id);
    
    try{
      await updateDoc(donRef,{
        pickuptime:`${newdate} ${newtime}`,
        status:'rescheduled'
      })

      setMessages("Successfully Rescheduled");
      fetchDetails(user);


    }catch{
      setMessages("Failed to Reschedule");

    }
  }

  const handleCancel=async(id)=>{
    const donRef=doc(db,"users",user.uid,"donations",id);
    
    try{
      await deleteDoc(donRef);
      setMessages("successfully cancelled donation!");
      fetchDetails(user);
    }
    catch{
      setMessages("Failed to Cancel the donation");

    }
  };

   return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Pickup Scheduler</h3>

        {donations.length === 0 ? (
          <p>No pickups found</p>
        ) : (
          donations.map((donation) => (
            <div key={donation.id} className="border rounded p-3 mb-3">
              <h5>Item: {donation.item}</h5>
              <p>Quantity: {donation.quantity}</p>
              <p>Pickup Time: {donation.pickuptime}</p>
              <div className="row">
                <div className="col-md-5">
                  <input
                    type="date"
                    className="form-control"
                    value={updates[donation.id]?.newDate || ''}
                    onChange={(e) =>
                      setUpdates((prev) => ({
                        ...prev,
                        [donation.id]: {
                          ...prev[donation.id],
                          newDate: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="time"
                    className="form-control"
                    value={updates[donation.id]?.newTime || ''}
                    onChange={(e) =>
                      setUpdates((prev) => ({
                        ...prev,
                        [donation.id]: {
                          ...prev[donation.id],
                          newTime: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-md-2 d-flex">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() =>
                      handleReschedule(
                        donation.id,
                        updates[donation.id]?.newTime,
                        updates[donation.id]?.newDate
                      )
                    }
                  >
                    Reschedule
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(donation.id)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {messages && <div className="alert alert-info mt-4">{messages}</div>}
      </div>
    </div>
  );
};

export default PickupScheduler;