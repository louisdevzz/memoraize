'use client';
import Link from 'next/link';
import { useEffect, useState,useCallback } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchLessons = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      //console.log('token', token);
      setLoading(true);
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/flashcards/byUser', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  //console.log(lessons);
  if(loading){
    return <div className="min-h-screen flex justify-center items-center">
      <div className='loader'></div>
    </div>;
  }
  if(lessons.length === 0){
    return <div>No lessons found</div>;
  }

  return (
    <main className="min-h-screen p-24">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Welcome to Flashcards</h1>
        
        {!isLoggedIn && (
          <div className="flex flex-row justify-end w-full gap-4">
            <Link href="/login">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                Register
              </button>
            </Link>
          </div>
        )}
        
        {isLoggedIn && (
          <div className="flex flex-row justify-end w-full gap-4">
            <Link href="/flashcards/create">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Create Flashcard
              </button>
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 w-full">
          {lessons.map((lesson: any) => (
            <div 
              key={lesson._id}
              className="bg-gray-200 h-48 rounded-md p-3 relative cursor-pointer"
              onClick={() => window.location.href = `/flashcards/${lesson.slug}`}
            >
              <span>{lesson.title}</span>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button 
                  className="p-2 hover:bg-gray-300 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/flashcards/edit/${lesson.slug}`;
                  }}
                >
                  <FiEdit size={16} />
                </button>
                <button 
                  className="p-2 hover:bg-gray-300 rounded-full text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add your delete logic here
                    console.log(`Delete flashcard ${lesson._id}`);
                  }}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
