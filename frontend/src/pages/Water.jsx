import React, { useState, useEffect } from 'react';
import { BeakerIcon } from '@heroicons/react/24/outline';
import WaterLogModal from '../components/Modals/WaterLogModal';
import axios from '../utils/axios';
import { useAppContext } from '../context/AppContext';

const Water = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(0);
  const [waterLogs, setWaterLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger, triggerUpdate } = useAppContext();

  useEffect(() => {
    fetchWaterData();
  }, [updateTrigger]);

  const fetchWaterData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching water data...');
      
      try {
        const waterResponse = await axios.get('/water/getDailyWaterIntake');
        console.log('Water response:', waterResponse.data);
        
        if (waterResponse.data.success) {
          const logs = waterResponse.data.dailyWaterLogs;
          setWaterLogs(logs);
          const total = logs.reduce((sum, log) => sum + log.amount, 0);
          setWaterIntake(total);
        } else {
          console.error('Water response not successful:', waterResponse.data);
          setError('Failed to fetch water logs: ' + (waterResponse.data.message || 'Unknown error'));
        }
      } catch (waterError) {
        console.error('Error fetching water logs:', waterError);
        setError('Failed to fetch water logs: ' + (waterError.message || 'Unknown error'));
      }
      
      try {
        const profileResponse = await axios.get('/profile/');
        console.log('Profile response:', profileResponse.data);
        
        if (profileResponse.data.success && profileResponse.data.user && profileResponse.data.user.profile) {
          setDailyGoal(profileResponse.data.user.profile.goals.waterGoal);
        } else {
          console.error('Profile response not successful or missing data:', profileResponse.data);
          setError('Failed to fetch water goal: ' + (profileResponse.data.message || 'Unknown error'));
        }
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
        setError('Failed to fetch water goal: ' + (profileError.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error in fetchWaterData:', error);
      setError('Failed to fetch water data: ' + (error.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogWater = async (amount) => {
    try {
        const response = await axios.post('/water/log', { amount });
        if (response.data.success) {
            setWaterIntake(response.data.totalWaterIntake); // Using the returned value
          
            const newLog = {
                amount,
                dateLogged: new Date()
            };
            setWaterLogs(prev => [newLog, ...prev]);
            
            triggerUpdate();
        }
    } catch (error) {
        console.error('Error logging water:', error);
    }
};

  const bottleHeight = 400; // Height of the bottle in pixels
  const fillHeight = (waterIntake / dailyGoal) * bottleHeight;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading water data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-lg">{error}</p>
        <button 
          onClick={fetchWaterData}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-top justify-center p-4 h-full">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold text-gray-900">Water Intake Tracker</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <BeakerIcon className="h-5 w-5" />
            <span>Add Water</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 h-[90%]">
          <div className="flex flex-col items-center justify-center h-full ">
            <div className="relative w-32 h-[400px] border-4 border-blue-200 rounded-b-3xl rounded-t-lg overflow-hidden">
              <div
                className="absolute bottom-0 w-full bg-blue-400 transition-all duration-500"
                style={{ height: `${fillHeight}px` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-blue-400 opacity-80"></div>
              </div>
              <div className="absolute right-0 h-full w-1 bg-blue-200">
                {[0, 25, 50, 75, 100].map((level) => (
                  <div
                    key={level}
                    className="absolute right-0 w-2 h-0.5 bg-blue-300"
                    style={{ bottom: `${level}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {waterIntake}ml / {dailyGoal}ml
              </p>
              <p className="text-sm text-gray-600">
                {(Math.round(((waterIntake / dailyGoal) * 100)>100) ? 100: (waterIntake / dailyGoal) * 100).toFixed(2) }% of daily goal
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Water Log</h2>
            {waterLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No water logged today</p>
            ) : (
              <div className="space-y-4">
                {waterLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <BeakerIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">{log.amount}ml</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.dateLogged).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <WaterLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogWater={handleLogWater}
      />
    </div>
  );
};

export default Water;
