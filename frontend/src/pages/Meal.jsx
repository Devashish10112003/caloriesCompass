import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import MealLogModal from '../components/Modals/MealLogModal';
import axios from '../utils/axios';
import { useAppContext } from '../context/AppContext';

const Meal = () => {
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger, triggerUpdate } = useAppContext();

  const fetchMeals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get('/meal/today');
      if (res.data.success) {
        setMeals(res.data.meals || []);
      } else {
        setError('Failed to fetch meals');
      }
    } catch (err) {
      console.error('Failed to fetch meals:', err);
      setError('Failed to fetch meals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [updateTrigger]); 

  const handleAddMeal = async (mealData) => {
    try {
      const formData = new FormData();
      formData.append('mealName', mealData.mealName);
      formData.append('portionSize', mealData.portionSize);
      
      if (mealData.image) {
        formData.append('image', mealData.image);
      }
      
      await axios.post('/meal/log', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      fetchMeals();
      
      triggerUpdate();
    } catch (err) {
      console.error('Failed to add meal:', err);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await axios.delete(`/meal/${id}`);
      setMeals(meals.filter(meal => meal._id !== id));
      
      triggerUpdate();
    } catch (err) {
      console.error('Failed to delete meal:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meals...</p>
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
          onClick={fetchMeals}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 h-full">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Today's Meals</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-4 w-4 md:h-5 w-5" />
            <span>Add Meal</span>
          </button>
        </div>

        <div className="flex flex-col gap-y-4 h-[calc(100vh-12rem)] overflow-y-auto">
          {meals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4V7m0 0V5a2 2 0 10-4 0v2m4 0a2 2 0 104 0V5a2 2 0 10-4 0v2z" />
            </svg>
            <span className="text-lg">No meals found for today.</span>
          </div>
          ) : (
            meals.map(meal => (
              <div key={meal._id} className="bg-white rounded-lg shadow p-4 sm:p-6 sm:h-48 h-auto">
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="w-full sm:w-32 h-32 mx-auto sm:mx-0 rounded-lg overflow-hidden">
                  <img
                    src={meal.image ? `http://localhost:5000/${meal.image}` : 'https://via.placeholder.com/150'}
                    alt={meal.mealName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{meal.mealName}</h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {meal.dateLogged ? new Date(meal.dateLogged).toLocaleTimeString() : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base sm:text-lg font-semibold text-green-600">{meal.calories} kcal</span>
                      <button 
                        onClick={() => handleDeleteMeal(meal._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete meal"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500">Protein</p>
                      <p className="text-sm sm:text-lg font-semibold text-blue-600">{meal.protein}g</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500">Carbs</p>
                      <p className="text-sm sm:text-lg font-semibold text-green-600">{meal.carbs}g</p>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500">Fats</p>
                      <p className="text-sm sm:text-lg font-semibold text-yellow-600">{meal.fats}g</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      <MealLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMeal}
      />
    </div>
  );
};

export default Meal;

//add the functionality to select one meal for detailed view and update the meal.