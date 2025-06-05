import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Water from './pages/Water';
import Meal from './pages/Meal';
import DailyProgress from './pages/DailyProgress';
import Suggestions from './pages/Suggestions';
import NotFound from './pages/NotFound';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="progress" element={<DailyProgress />} />
            <Route path="meal" element={<Meal />} />
            <Route path="water" element={<Water />} />
            <Route path="profile" element={<Profile />} />
            <Route path="suggestions" element={<Suggestions />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AppProvider>
  );
}

export default App;
