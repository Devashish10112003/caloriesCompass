import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Drawer from '../components/Drawer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FireIcon, CubeIcon, CakeIcon, BeakerIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import axios from '../utils/axios';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const location = useLocation();
  const { updateTrigger } = useAppContext();
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyWaterGoal, setDailyWaterGoal] = useState(0);
  const [meals, setMeals] = useState([]);
  const [progressData, setProgressData] = useState({
    calories: { consumed: 0, target: 2000, percentage: 0 },
    protein: { consumed: 0, target: 100, percentage: 0 },
    carbs: { consumed: 0, target: 300, percentage: 0 },
    fats: { consumed: 0, target: 80, percentage: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [updateTrigger]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const waterResponse = await axios.get('/water/getDailyWaterIntake');
      if (waterResponse.data.success) {
        const logs = waterResponse.data.dailyWaterLogs;
        const total = logs.reduce((sum, log) => sum + log.amount, 0);
        setWaterIntake(total);
      }

      const progressResponse = await axios.get('/progress/getDailyProgress');
      if (progressResponse.data.success) {
        const progress = progressResponse.data.dailyProgress;
        const goals = progressResponse.data.goals;
        
        setDailyWaterGoal(goals.waterGoal);
        
        setProgressData({
          calories: {
            consumed: progress.totalCalories,
            target: goals.calorieGoal,
            percentage: Math.min((progress.totalCalories / goals.calorieGoal) * 100, 100),
          },
          protein: {
            consumed: progress.totalProtein,
            target: goals.proteinGoal,
            percentage: Math.min((progress.totalProtein / goals.proteinGoal) * 100, 100),
          },
          carbs: {
            consumed: progress.totalCarbs,
            target: goals.carbGoal,
            percentage: Math.min((progress.totalCarbs / goals.carbGoal) * 100, 100),
          },
          fats: {
            consumed: progress.totalFats,
            target: goals.fatGoal,
            percentage: Math.min((progress.totalFats / goals.fatGoal) * 100, 100),
          }
        });
      }

      const mealResponse = await axios.get('/meal/today');
      if (mealResponse.data.success) {
        setMeals(mealResponse.data.meals);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (location.pathname !== '/dashboard') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex flex-1 relative">
          <Drawer />
          <div className="flex-1">
            <div className="p-6 h-screen overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex flex-1 relative">
          <Drawer />
          <div className="flex-1">
            <div className="p-6 h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex flex-1 relative">
          <Drawer />
          <div className="flex-1">
            <div className="p-6 h-screen flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg">{error}</p>
                <button 
                  onClick={fetchDashboardData}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const waterPercentage = Math.round((waterIntake / dailyWaterGoal) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 relative">
        <Drawer />
        <div className="flex-1">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 h-[700px] flex flex-col justify-between overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="h-6 w-6 text-green-500" /> Daily Progress
                </h2>
                <div className="space-y-6 flex-1 flex flex-col justify-center overflow-y-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-orange-100 rounded-full p-2">
                      <FireIcon className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium text-sm">Calories</span>
                        <span className="font-bold text-orange-600 text-sm">{progressData.calories.consumed.toFixed(2)} / {progressData.calories.target.toFixed(2)} kcal</span>
                      </div>
                      <div className="w-full h-2 bg-orange-100 rounded-full">
                        <div className="h-2 bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${progressData.calories.percentage.toFixed(2)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                      <CubeIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium text-sm">Protein</span>
                        <span className="font-bold text-blue-600 text-sm">{progressData.protein.consumed.toFixed(2)} / {progressData.protein.target.toFixed(2)} g</span>
                      </div>
                      <div className="w-full h-2 bg-blue-100 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progressData.protein.percentage.toFixed(2)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                      <CakeIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium text-sm">Carbs</span>
                        <span className="font-bold text-green-600 text-sm">{progressData.carbs.consumed.toFixed(2)} / {progressData.carbs.target.toFixed(2)} g</span>
                      </div>
                      <div className="w-full h-2 bg-green-100 rounded-full">
                        <div className="h-2 bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progressData.carbs.percentage.toFixed(2)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 bg-purple-100 rounded-full p-2">
                      <BeakerIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-700 font-medium text-sm">Fats</span>
                        <span className="font-bold text-purple-600 text-sm">{progressData.fats.consumed.toFixed(2)} / {progressData.fats.target.toFixed(2)} g</span>
                      </div>
                      <div className="w-full h-2 bg-purple-100 rounded-full">
                        <div className="h-2 bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progressData.fats.percentage.toFixed(2)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-8 h-[700px] flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <BeakerIcon className="h-6 w-6 text-blue-500" /> Water Intake
                </h2>
                <div className="flex flex-col items-center flex-1 justify-center">
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="10"
                        strokeDasharray={`${(waterIntake / dailyWaterGoal * 100 || 0) * 3.54} 283`}
                        strokeDashoffset="70.75"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dasharray 0.5s' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <BeakerIcon className="h-10 w-10 text-blue-500 mb-2" />
                      <span className="text-3xl font-bold text-blue-600">{Math.round((waterIntake / dailyWaterGoal * 100)>100? 100:(waterIntake / dailyWaterGoal * 100) ) || 0}%</span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{waterIntake}ml <span className="text-gray-400">/</span> {dailyWaterGoal}ml</p>
                  <p className="text-sm text-blue-500 mt-2 italic">Stay hydrated for better health!</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-8 h-[700px] flex flex-col justify-between">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CakeIcon className="h-6 w-6 text-pink-400" /> Today's Meals
                </h2>
                <div className="flex-1 flex flex-col justify-center">
                  {meals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg width="80" height="80" fill="none" viewBox="0 0 24 24" className="mb-4">
                        <circle cx="12" cy="12" r="10" fill="#F3F4F6" />
                        <path d="M8 15h8M9 12h6M10 9h4" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <p className="text-gray-400 text-lg font-medium">No meals logged today</p>
                      <p className="text-gray-400 text-sm mt-1">Start logging your meals to see them here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meals.slice(0, 3).map((meal, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg shadow-sm">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                            <img
                              src={meal.image ? `http://localhost:5000/${meal.image}` : 'https://via.placeholder.com/56'}
                              alt={meal.mealName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{meal.mealName}</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>{meal.dateLogged ? new Date(meal.dateLogged).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                              {meal.calories} kcal
                            </span>
                          </div>
                        </div>
                      ))}
                      {meals.length > 3 && (
                        <p className="text-sm text-blue-600 text-center mt-2">
                          +{meals.length - 3} more meals
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
