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
              <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
                Learn smarter,
                <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 
                  bg-clip-text text-transparent block">remember longer,</span>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 
                  bg-clip-text text-transparent">succeed faster.</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600">
                Experience the future of learning with AI-powered flashcards, adaptive 
                learning paths, and intelligent memory techniques.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/register" 
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
                  Explore AI Features
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-12 lg:gap-16 pt-8">
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
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 lg:mb-8">AI-Powered Learning Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/file.svg" alt="AI Flashcards" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Intelligent Flashcards</h3>
                <p className="text-gray-600 text-sm lg:text-base">AI-generated cards adapt to your learning style</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-pink-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/globe.svg" alt="Smart Learning" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Adaptive Learning</h3>
                <p className="text-gray-600 text-sm lg:text-base">Personalized study paths powered by AI</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Image src="/window.svg" alt="Analytics" width={24} height={24} className="lg:w-8 lg:h-8" />
                </div>
                <h3 className="font-bold mb-2">Smart Analytics</h3>
                <p className="text-gray-600 text-sm lg:text-base">AI-driven insights and progress tracking</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
