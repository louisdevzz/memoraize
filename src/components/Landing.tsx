'use client';

import Image from "next/image";
import Header from "./Header";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';

export default function Landing() {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check for session cookie and get user data
    const checkAuth = async () => {
        try {
            console.log('Checking auth...');
            const response = await fetch('/api/auth/user');
            // console.log('Auth response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
            } else {
                // console.log('Auth failed:', await response.text());
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsLoggedIn(false);
        }
    };

    checkAuth();
    
    // Reduce the check frequency to avoid too many requests
    const authInterval = setInterval(checkAuth, 10000); // Check every 10 seconds

    return () => {
      clearInterval(authInterval);
    };
}, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 overflow-hidden">
        <motion.div
          className="fixed top-20 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="fixed bottom-20 right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="container mx-auto px-4 py-8 md:py-16 relative">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <motion.div 
              className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >              
              <motion.h1 
                className="text-4xl lg:text-7xl font-bold leading-tight"
                whileInView={{ 
                  backgroundPosition: ["0%", "100%"],
                  transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                Learn smarter,
                <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 
                  bg-clip-text text-transparent block">remember longer,</span>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 
                  bg-clip-text text-transparent">succeed faster.</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg lg:text-xl text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Experience the future of learning with AI-powered flashcards, adaptive 
                learning paths, and intelligent memory techniques.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  href={isLoggedIn ? "/flashcards/create" : "/register"} 
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl 
                    hover:bg-indigo-700 transition w-full sm:w-auto text-center"
                >
                  Start Learning Free
                </Link>
                <Link 
                  href="/explore" 
                  className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 
                    rounded-xl hover:bg-indigo-50 transition w-full sm:w-auto text-center"
                >
                  Explore Lessons
                </Link>
              </motion.div>
              
              {/* Stats */}
              <motion.div 
                className="flex justify-center lg:justify-start gap-12 lg:gap-16 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div>
                  <h3 className="text-3xl font-bold text-indigo-600">95%</h3>
                  <p className="text-gray-600">Learning Efficiency</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-indigo-600">AI</h3>
                  <p className="text-gray-600">Powered Learning</p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold gradient-text">24/7</h3>
                  <p className="text-sm lg:text-base text-gray-600">Study Assistant</p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Content - 3D Elements */}
            <motion.div 
              className="flex-1 relative h-[300px] lg:h-auto w-full max-w-[320px] lg:max-w-none mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="floating">
                {/* Main Card */}
                <div className="w-64 lg:w-80 h-40 lg:h-48 bg-white rounded-2xl shadow-2xl p-6 transform rotate-6 absolute right-0 top-0">
                  <div className="space-y-4">
                    <div className="w-12 h-2 bg-indigo-200 rounded"></div>
                    <div className="w-24 h-2 bg-pink-200 rounded"></div>
                  </div>
                </div>
                
                {/* Decorative Cards */}
                <div className="w-64 lg:w-80 h-40 lg:h-48 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl shadow-xl p-6 transform -rotate-6 absolute right-4 top-4">
                </div>
                <div className="w-64 lg:w-80 h-40 lg:h-48 bg-white rounded-2xl shadow-lg p-6 transform rotate-12 absolute right-8 top-8">
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -left-10 w-16 lg:w-20 h-16 lg:h-20 bg-yellow-200 rounded-full opacity-50 floating"></div>
              <div className="absolute bottom-10 right-10 w-12 lg:w-16 h-12 lg:h-16 bg-pink-200 rounded-full opacity-50 floating"></div>
              <div className="absolute top-40 left-20 w-10 lg:w-12 h-10 lg:h-12 bg-indigo-200 rounded-lg opacity-50 floating"></div>
            </motion.div>
          </div>
          
          {/* Feature Preview */}
          <motion.div 
            className="mt-16 lg:mt-32 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">AI-Powered Learning Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              <motion.div 
                className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/file.svg" alt="AI Flashcards" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Intelligent Flashcards</h3>
                <p className="text-gray-600 text-sm lg:text-base">AI-generated cards adapt to your learning style</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-pink-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/globe.svg" alt="Smart Learning" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Adaptive Learning</h3>
                <p className="text-gray-600 text-sm lg:text-base">Personalized study paths powered by AI</p>
              </motion.div>
              
              <motion.div 
                className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition sm:col-span-2 md:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/window.svg" alt="Analytics" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Smart Analytics</h3>
                <p className="text-gray-600 text-sm lg:text-base">AI-driven insights and progress tracking</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
