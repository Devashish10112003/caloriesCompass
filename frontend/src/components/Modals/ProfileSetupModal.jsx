import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from '../../utils/axios';

const ProfileSetupModal = ({ isOpen, onClose, onSave, username }) => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: 'Sedentary',
    fitnessGoal: '',
    diet: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user profile data when modal opens
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/profile/');
      if (response.data.success) {
        const userData = response.data.user;
        setFormData({
          height: userData.profile?.height || '',
          weight: userData.profile?.weight || '',
          age: userData.profile?.age || '',
          gender: userData.profile?.gender || '',
          activityLevel: userData.profile?.activityLevel || 'Sedentary',
          fitnessGoal: userData.profile?.fitnessGoal || '',
          diet: userData.profile?.diet || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
    
    // Validate required fields
    if (!formData.height || !formData.weight || !formData.age || 
        !formData.gender || !formData.activityLevel || !formData.fitnessGoal || !formData.diet) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.put('/profile/', {
        height: Number(formData.height),
        weight: Number(formData.weight),
        age: Number(formData.age),
        gender: formData.gender,
        activityLevel: formData.activityLevel,
        fitnessGoal: formData.fitnessGoal,
        diet: formData.diet
      });

      if (response.data.success) {
        onSave(formData);
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg p-6">
          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-gray-900">{username}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Enter height"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex space-x-4">
                  <label className="relative flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.gender === 'male' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <span className={`text-sm font-medium ${
                        formData.gender === 'male' ? 'text-blue-700' : 'text-gray-500'
                      }`}>M</span>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Male</span>
                  </label>
                  <label className="relative flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      formData.gender === 'female' 
                        ? 'bg-pink-100 border-2 border-pink-500' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <span className={`text-sm font-medium ${
                        formData.gender === 'female' ? 'text-pink-700' : 'text-gray-500'
                      }`}>F</span>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">Female</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                required
              >
                <option value="Sedentary">Sedentary (little or no exercise)</option>
                <option value="Lightly Active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="Moderately Active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="Very Active">Very Active (hard exercise 6-7 days/week)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                required
              >
                <option value="">Select a goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Diet Type</label>
              <select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-4"
                required
              >
                <option value="">Select a diet type</option>
                <option value="Veg">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Gluten Free">Gluten Free</option>
              </select>
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
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProfileSetupModal;
