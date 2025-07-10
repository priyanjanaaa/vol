

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DashboardCards = ({ title, value }) => (
  <div className="card text-center mb-3 shadow-sm">
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">{value}</p>
    </div>
  </div>
);

const VolunteerDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setUserStats] = useState({
    totalAccepted: 0,
    tasksCompleted: 0,
    badge: "",
  });
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("Logged in UID:", currentUser.uid);
        await fetchtasksstats(currentUser.uid);
        await fetchfeedback(currentUser.uid);
      }
    });
  }, []);

  const fetchfeedback = async (uid) => {
    try {
      const q = query(
        collection(db, "feedback"),
        where("volunteerId", "==", uid)
      );
      const snapshot = await getDocs(q);
      const fb = snapshot.docs.map((doc) => doc.data());
      console.log("Fetched feedback:", fb);
      setFeedbacks(fb);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const fetchtasksstats = async (uid) => {
    try {
      const q = query(
        collection(db, "requests"),
        where("assignedTo", "==", uid)
      );
      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map((doc) => doc.data());
      console.log("Fetched tasks:", tasks);

      const completed = tasks.filter((t) => t.status === "Completed").length;
      const accepted = tasks.filter(
        (t) => t.status === "Accepted" || t.status === "Completed"
      ).length;

      let badge = "Bronze";
      if (completed >= 10) badge = "Gold";
      else if (completed > 5) badge = "Silver";

      setUserStats({
        totalAccepted: accepted,
        tasksCompleted: completed,
        badge,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDownload = async () => {
    const data = `Number of Accepted tasks: ${stats.totalAccepted}
Number of Completed Tasks: ${stats.tasksCompleted}
Badge: ${stats.badge}`;

    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "task_summary.txt";
    link.click();
  };

  return (
    <div className="container mt-5">
  <div className="row">
    {/* Left side - Stats */}
    <div className="col-md-6">
      <DashboardCards title="Total Accepted" value={stats.totalAccepted} />
      <DashboardCards title="Total Completed" value={stats.tasksCompleted} />
      <DashboardCards title="Badge" value={stats.badge} />
    </div>

    {/* Right side - Feedback */}
    <div className="col-md-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-center">Feedback</h5>
          {feedbacks.length === 0 ? (
            <p className="text-center">No feedbacks for you!</p>
          ) : (
            feedbacks.map((fb, i) => (
              <p key={i} className="text-wrap">
                ⭐ {fb.rating} - {fb.comment}
              </p>
            ))
          )}
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default VolunteerDashboard;
