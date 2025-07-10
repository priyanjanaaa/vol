

import { useState } from 'react';
import './App.css';
import Login from './components/login';
import Signup from './components/signup';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navibar from './components/NavBar';
import VolunteerAvailable from './components/VolunteerAvailable';
import VolunteerDashboard from './components/VolunteerDashboard';
import VolunteerNav from './components/VolunteerNav';
import DonorDashboard from './components/DonorDashboard';
import MakeDonation from './components/MakeDonation';
import DonationHistory from './components/DonationHistory';
import Profile from './components/Profile';
import PickupScheduler from './components/PickupScheduler';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();
  const showVolunteerNav = location.pathname.startsWith("/Volunteer");

  return (
    <>
      {showVolunteerNav ? <VolunteerNav /> : <Navibar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/VolunteerAvailable" element={<VolunteerAvailable />} />
        <Route path="/VolunteerDashboard" element={<VolunteerDashboard />}></Route>
        <Route path="/DonorDashboard" element={<DonorDashboard />}></Route>
        <Route path="/MakeDonation" element={<MakeDonation />} />
        <Route path="/DonationHistory" element={<DonationHistory />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
        <Route path="/PickupScheduler" element= {<PickupScheduler />}></Route>

      </Routes>
    </>
  );
}

export default AppWrapper;
