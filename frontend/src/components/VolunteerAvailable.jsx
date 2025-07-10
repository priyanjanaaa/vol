
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const VolunteerAvailable = () => {
  const [availabletasks, setAvailableTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      if (currentuser) fetchTasks();
    });
  }, []);

  const handleAccept = async (taskId) => {
    const taskRef = doc(db, "requests", taskId);
    await updateDoc(taskRef, {
      status: "Accepted",
      assignedTo: user.uid,
    });
    fetchTasks();
  };

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "requests"));
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.status === "Available" ||
        data.availability === "Available"
      ) {
        tasks.push({ id: doc.id, ...data });
      }
    });
    setAvailableTasks(tasks);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available tasks that you can grab!</h2>
      {availabletasks.length === 0 ? (
        <p className="text-center">No task to select from</p>
      ) : (
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {availabletasks.map((task) => (
            <div
              className="card shadow p-3 text-center d-flex flex-column justify-content-between"
              key={task.id}
              style={{ width: "280px" }}
            >
              <div className="card-body">
                <p className="mb-2">
                  <strong>Item:</strong> {task.item}
                </p>
                <p className="mb-2">
                  <strong>Quantity:</strong> {task.quantity}
                </p>
                <p className="mb-3">
                  <strong>Location:</strong> {task.location}
                </p>
              </div>
              <button
                className="btn btn-success w-100 mt-auto"
                onClick={() => handleAccept(task.id)}
              >
                Accept Task
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerAvailable;
