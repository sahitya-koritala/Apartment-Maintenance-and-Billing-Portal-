import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Flats from './pages/Flats';
import Bills from './pages/Bills';
import Payments from './pages/Payments';
import Notices from './pages/Notices';
import Complaints from './pages/Complaints';
import Feedback from './pages/Feedback';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className={user ? "app-layout" : ""}>
      {user && <Sidebar />}
      
      <main className={user ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/flats" element={user?.role === 'admin' ? <Flats /> : <Navigate to="/" />} />
          <Route path="/bills" element={user ? <Bills /> : <Navigate to="/" />} />
          <Route path="/payments" element={user?.role === 'admin' ? <Payments /> : <Navigate to="/" />} />
          <Route path="/notices" element={user ? <Notices /> : <Navigate to="/" />} />
          <Route path="/complaints" element={user ? <Complaints /> : <Navigate to="/" />} />
          <Route path="/feedback" element={user ? <Feedback /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
