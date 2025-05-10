import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import logo from '../assets/logo.png';
import heroImage from '../assets/heroImage.png';

const Landing = () => {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="absolute top-8 left-8">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-bold text-white mb-6 min-h-[48px]">
              <TypeAnimation
                sequence={[
                  'Welcome to Calories Compass',
                  2000,
                ]}
                wrapper="span"
                speed={30}
                style={{ display: 'inline-block' }}
                repeat={0}
              />
            </h1>
            <p className="text-xl text-gray-200 mb-8 min-h-[28px]">
              <TypeAnimation
                sequence={[
                  'Track your nutrition, stay hydrated, and achieve your health goals',
                  2000,
                ]}
                wrapper="span"
                speed={30}
                style={{ display: 'inline-block' }}
                repeat={0}
              />
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
