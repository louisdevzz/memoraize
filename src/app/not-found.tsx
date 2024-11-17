import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-pink-50">
      <div className="text-center px-6">
        <div className="relative">
          <h1 className="text-[12rem] font-bold text-gray-200 select-none floating">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="backdrop-blur-md bg-white/30 rounded-xl p-8 shadow-xl">
              <h2 style={{ 
                background: 'linear-gradient(to right, #4F46E5, #EC4899)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }} className="text-3xl font-bold">Page Not Found</h2>
              <p className="mt-4 text-gray-600 max-w-md">
                Oops! It seems like you've ventured into uncharted territory. 
                The page you're looking for has gone on vacation.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 mt-6 px-2 py-3 bg-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl w-48"
              >
                <FiHome 
                  size={20} 
                  style={{ 
                    stroke: 'url(#gradient)',
                    transition: 'transform 0.3s ease',
                    transform: 'rotate(-10deg)',
                  }}
                  className="hover:scale-110 transform hover:rotate-0 transition-transform duration-300" 
                />
                <span style={{ 
                  background: 'linear-gradient(to right, #4F46E5, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }} className='font-semibold'>Take Me Home</span>
                
                {/* SVG gradient definition */}
                <svg width="0" height="0">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 