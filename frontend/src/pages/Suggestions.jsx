import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState({
    meals: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/recommend-meal/');
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      } else {
        setError('Failed to fetch suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading suggestions...</p>
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
          onClick={fetchSuggestions}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Meal Suggestions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.meals.map((meal, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {meal.image && (
              <img 
                src={meal.image} 
                alt={meal.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-medium text-gray-800 text-sm">{meal.name}</h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{meal.description}</p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span className="mr-4">Calories: {meal.calories}</span>
              <span>Protein: {meal.protein}g</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
