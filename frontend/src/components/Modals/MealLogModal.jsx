import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

const MealLogModal = ({ isOpen, onClose, onSave }) => {
  const [mealData, setMealData] = useState({
    mealName: '',
    portionSize: '',
    image: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(mealData);
    setMealData({
      mealName: '',
      portionSize: '',
      image: null
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg p-6">
          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">Log Your Meal</Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meal Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMealData({ ...mealData, image: e.target.files[0] })}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Meal Name</label>
              <input
                type="text"
                value={mealData.mealName}
                onChange={(e) => setMealData({ ...mealData, mealName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                placeholder="e.g., Chicken Salad"
                required
                
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="text"
                value={mealData.portionSize}
                onChange={(e) => setMealData({ ...mealData, portionSize: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                placeholder="e.g., 1 bowl, 2 slices, 200g"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Meal
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default MealLogModal; 

//update the meal.jsx file and this file to save images.