import React, { useState } from 'react';
import profileIcon from '../assets/profile-svgrepo-com.svg';
import emailIcon from '../assets/email-svgrepo-com.svg';
import lockIcon from '../assets/lock-svgrepo-com.svg';
import lockIcon2 from '../assets/lock-svgrepo-com (2).svg';
import signupImage from '../assets/SignupPageImage.jpg';
import logo from '../assets/logo.png';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/auth/signup', {
        email: formData.email,
        username: formData.name,
        password: formData.password,
      });

      if (response.status === 201) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-8 left-8">
        <img src={logo} alt="Logo" className="h-12" />
      </div>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-lg shadow-md flex">
          <div className="flex-1 pr-8">
            <div className="text-left pl-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up</h2>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            <form className="space-y-6 p-6" onSubmit={handleSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
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
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <img
                    src={lockIcon2}
                    alt="Lock"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Register
                </button>
              </div>
              <div className="text-center">
                <a href="/login" className="text-sm text-green-600 hover:text-green-500">
                  I am already member
                </a>
              </div>
            </form>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center">
            <img
              src={signupImage}
              alt="Healthy lifestyle"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 