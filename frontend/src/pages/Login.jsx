import React, { useState } from 'react';
import emailIcon from '../assets/email-svgrepo-com.svg';
import lockIcon from '../assets/lock-svgrepo-com.svg';
import loginImage from '../assets/LoginPageImage.jpg';
import logo from '../assets/logo.png';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('/auth/login', formData);
  
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-8 left-8">
        <img src={logo} alt="Logo" className="h-12" />
      </div>      
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-md flex">
          <div className="flex-1 pr-8">
            <div className="text-left pl-6 mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="space-y-8 p-6" onSubmit={handleSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <img
                    src={emailIcon}
                    alt="Email"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <img
                    src={lockIcon}
                    alt="Lock"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center justify-end">
                <a href="/forgot-password" className="text-sm text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Login
                </button>
              </div>
              <div className="text-center pt-4">
                <a href="/signup" className="text-sm text-green-600 hover:text-green-500">
                  Don't have an account? Sign up
                </a>
              </div>
            </form>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center">
            <img
              src={loginImage}
              alt="Healthy lifestyle"
              className="max-w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 