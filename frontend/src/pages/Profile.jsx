import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import ProfileSetupModal from '../components/Modals/ProfileSetupModal';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: '',
    fitnessGoal: '',
    diet: '',
    goals: {
      calorieGoal: 0,
      proteinGoal: 0,
      carbGoal: 0,
      fatGoal: 0,
      waterGoal: 0
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTrigger, triggerUpdate } = useAppContext();

  useEffect(() => {
    fetchUserProfile();
  }, [updateTrigger]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('/profile/');  
      if (response.data.success) {
        const userData = response.data.user;
        setProfile({
          name: userData.username || '',
          email: userData.email || '',
          height: userData.profile?.height || '',
          weight: userData.profile?.weight || '',
          age: userData.profile?.age || '',
          gender: userData.profile?.gender || '',
          activityLevel: userData.profile?.activityLevel || '',
          fitnessGoal: userData.profile?.fitnessGoal || '',
          diet: userData.profile?.diet || '',
          goals: userData.profile?.goals || {
            calorieGoal: 0,
            proteinGoal: 0,
            carbGoal: 0,
            fatGoal: 0,
            waterGoal: 0,
          },
        });
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await axios.put('/profile/', updatedProfile);
      if (response.data.success) {
        setProfile(updatedProfile);
        setIsModalOpen(false);
        
        triggerUpdate();
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
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
          onClick={fetchUserProfile}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{profile.name || 'User Profile'}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile.email || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-medium">{profile.height ? `${profile.height} cm` : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">{profile.weight ? `${profile.weight} kg` : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{profile.age ? `${profile.age} years` : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Activity Level</p>
              <p className="font-medium">{profile.activityLevel ? profile.activityLevel : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fitness Goal</p>
              <p className="font-medium">{profile.fitnessGoal ? profile.fitnessGoal : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Diet Type</p>
              <p className="font-medium">{profile.diet ? profile.diet : 'Not set'}</p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-lg font-semibold text-green-600">{profile.goals.calorieGoal} kcal</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-lg font-semibold text-blue-600">{profile.goals.proteinGoal}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-lg font-semibold text-yellow-600">{profile.goals.carbGoal}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fats</p>
                <p className="text-lg font-semibold text-red-600">{profile.goals.fatGoal}g</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Water</p>
                <p className="text-lg font-semibold text-blue-500">{profile.goals.waterGoal}ml</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleProfileUpdate}
        username={profile.name}
      />
    </div>
  );
};

export default Profile;    