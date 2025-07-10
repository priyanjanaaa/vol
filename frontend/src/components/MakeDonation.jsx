import { useNavigate } from "react-router-dom";
import react,{useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db, auth } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const MakeDonation=()=>{
  const[item,setItem]=useState('');
  const[quantity,setQuantity]=useState('');
  const[pickuptime,setPickUpTime]=useState('');
  const[pickupdate,setPickUpDate]=useState('');
  const[message,setMessage]=useState('');

  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const user=auth.currentUser;
      if(!user||!quantity||!pickuptime||!pickupdate){
        return;
      }
      if(user){
        const donationId=uuidv4();
        const donRef=doc(db,"users",user.uid,"donations",donationId);

        await setDoc(donRef,{
          item,
          quantity:parseInt(quantity),
          pickuptime:`${pickupdate} ${pickuptime}`,
          status:'pending',
          Time:new Date()

          
        });

        setItem('');
        setQuantity('');
        setPickUpDate('');
        setPickUpTime('');
        setMessage("Successful submission");

      }
    }
  catch{
    setMessage("Error");

    }
    


  }
  


return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="mb-4 text-center">Make a Donation</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Item</label>
            <input
              type="text"
              className="form-control"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="e.g., Clothes, Food"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 5"
            />
          </div>

         
          <div className="mb-3">
            <label className="form-label">Pickup Date</label>
            <input
              type="date"
              className="form-control"
              value={pickupdate}
              onChange={(e) => setPickUpDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Pickup Time</label>
            <input
              type="time"
              className="form-control"
              value={pickuptime}
              onChange={(e) => setPickUpTime(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Submit Donation</button>
        </form>

        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default MakeDonation;