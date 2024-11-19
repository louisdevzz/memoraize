'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/'); // Redirect after successful login
      } else {
        // Handle error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[380px] p-6 sm:p-8 space-y-4 sm:space-y-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Welcome Back to <span className="gradient-text">BrainCards</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1.5 text-gray-600 text-sm sm:text-base">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-gray-600 text-sm sm:text-base">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition text-sm sm:text-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2.5 sm:p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 text-sm sm:text-base mt-2"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="space-y-4">
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Don't have an account? {' '}
            <Link className="text-indigo-600 hover:text-indigo-700 font-medium" href="/register">
              Register
            </Link>
          </p>

          <div className="pt-2">
            <Link 
              href="/" 
              className="group flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 text-sm transition-all duration-300 border border-gray-200 hover:border-indigo-600/30 rounded-xl p-3 hover:bg-indigo-50/50"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="transform transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-200 rounded-full opacity-50 floating"></div>
        <div className="absolute -bottom-6 -right-6 w-10 h-10 sm:w-16 sm:h-16 bg-pink-200 rounded-full opacity-50 floating"></div>
      </div>
    </div>
  );
};

export default LoginPage;
