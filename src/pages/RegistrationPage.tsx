import { useEffect } from 'react';
import RegistrationForm from '../components/registration/RegistrationForm';
import { register } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import type { RegistrationFormData } from '../components/registration/types';

export default function RegistrationPage() {
  const { setUser, isAuthenticated } = useAuth();

  // Redirect already-authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '#/dashboard';
    }
  }, [isAuthenticated]);

  const handleRegistration = async (data: RegistrationFormData) => {
    const authUser = register({
      name: data.step1.fullName,
      email: data.step1.email,
      password: data.step1.password,
      username: data.step2.username,
      bio: data.step2.bio,
    });
    setUser(authUser);
    window.location.hash = '#/dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1
            data-testid="registration-title"
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          >
            Create an Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Fill in the form below to get started.
          </p>
        </div>

        <RegistrationForm onSubmit={handleRegistration} />
      </div>
    </div>
  );
}
