import Image from "next/image";
import Header from "./Header";
import Link from "next/link";

export default function Landing() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-16 relative">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
              {/* <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl lg:text-2xl font-bold text-white">B</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold">BrainCards</h2>
              </div> */}
              
              <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
                Learn Anything with
                <span className="gradient-text block">Interactive Cards</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 px-4 lg:px-0">
                Transform your learning journey with interactive flashcards, engaging games, 
                and powerful memory techniques.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/login" className="px-6 py-3 lg:px-8 lg:py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition w-full sm:w-auto">
                  Get Started Free
                </Link>
                <Link href="/explore" className="px-6 py-3 lg:px-8 lg:py-4 border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition w-full sm:w-auto">
                  Explore Lessons
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 lg:gap-12 pt-6 lg:pt-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold">1M+</h3>
                  <p className="text-sm lg:text-base text-gray-600">Active Users</p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold">50+</h3>
                  <p className="text-sm lg:text-base text-gray-600">Learning Games</p>
                </div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold">100K+</h3>
                  <p className="text-sm lg:text-base text-gray-600">Flashcard Sets</p>
                </div>
              </div>
            </div>
            
            {/* Right Content - 3D Elements */}
            <div className="flex-1 relative h-[300px] lg:h-auto w-full max-w-[320px] lg:max-w-none mx-auto">
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
            </div>
          </div>
          
          {/* Feature Preview */}
          <div className="mt-16 lg:mt-32 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">Learn Through Play</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/file.svg" alt="Flashcards" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Smart Flashcards</h3>
                <p className="text-gray-600 text-sm lg:text-base">Create and study with AI-powered flashcards</p>
              </div>
              
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-pink-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/globe.svg" alt="Games" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Learning Games</h3>
                <p className="text-gray-600 text-sm lg:text-base">Make learning fun with interactive games</p>
              </div>
              
              <div className="bg-white p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/window.svg" alt="Progress" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Track Progress</h3>
                <p className="text-gray-600 text-sm lg:text-base">Monitor your learning journey</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
