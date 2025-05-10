import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FireIcon, CubeIcon, CakeIcon, BeakerIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import { useAppContext } from '../context/AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const DailyProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [goals, setGoals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger } = useAppContext();

  useEffect(() => {
    fetchProgressData();
  }, [updateTrigger]);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/progress/getDailyProgress');
      if (response.data.success) {
        setProgressData(response.data.dailyProgress);
        setGoals(response.data.goals);
      } else {
        setError('Failed to fetch progress data');
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setError('Failed to fetch progress data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error || !progressData || !goals) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-lg">No progress data available</p>
        <button 
          onClick={fetchProgressData}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Calories',
      progress: Math.min((progressData.totalCalories / goals.calorieGoal) * 100, 100),
      fill: '#FF6B6B',
      consumed: progressData.totalCalories,
      target: goals.calorieGoal
    },
    {
      name: 'Protein',
      progress: Math.min((progressData.totalProtein / goals.proteinGoal) * 100, 100),
      fill: '#4ECDC4',
      consumed: progressData.totalProtein,
      target: goals.proteinGoal
    },
    {
      name: 'Carbs',
      progress: Math.min((progressData.totalCarbs / goals.carbGoal) * 100, 100),
      fill: '#45B7D1',
      consumed: progressData.totalCarbs,
      target: goals.carbGoal
    },
    {
      name: 'Fats',
      progress: Math.min((progressData.totalFats / goals.fatGoal) * 100, 100),
      fill: '#96CEB4',
      consumed: progressData.totalFats,
      target: goals.fatGoal
    }
  ];

  const getChartOptions = (color) => ({
    cutout: '87%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  });

  const getChartData = (progress, color) => ({
    datasets: [{
      data: [progress, 100 - progress],
      backgroundColor: [color, '#E5E7EB'],
      borderWidth: 0,
      circumference: 360,
      rotation: 0,
      borderRadius: [5, 0] 
    }]
  });

  return (
    <div className="p-4">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Progress</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {chartData.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="h-56 relative">
                <div className="absolute inset-0 flex items-center justify-center ">
                  <Doughnut
                    data={getChartData(item.progress, item.fill)}
                    options={getChartOptions(item.fill)}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-bold" style={{ color: item.fill }}>
                      {Math.round(item.progress)}%
                    </p>
                    <p className="text-base text-gray-600">
                      {index === 0 ? `${item.consumed.toFixed(2)} of ${item.target.toFixed(2)} kcal` :
                       `${item.consumed.toFixed(2)} of ${item.target.toFixed(2)} g`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                {index === 0 && <FireIcon className="h-7 w-7 text-orange-500" />}
                {index === 1 && <CubeIcon className="h-7 w-7 text-blue-500" />}
                {index === 2 && <CakeIcon className="h-7 w-7 text-green-500" />}
                {index === 3 && <BeakerIcon className="h-7 w-7 text-purple-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyProgress; 