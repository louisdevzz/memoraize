'use client';
import { useEffect, useState,useCallback } from 'react';
import { FiEdit, FiTrash2, FiBook, FiLayers, FiGrid, FiList, FiSearch, FiFolder, FiTrash } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import Header from '@/components/Header';
import Landing from '@/components/Landing';

export default function Home() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLessons = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

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

  const getRandomColor = () => {
    const colors = [
      'bg-[#FFB4B4] hover:bg-[#FFB4B4]/80', // soft pink
      'bg-[#B4D4FF] hover:bg-[#B4D4FF]/80', // soft blue
      'bg-[#BFFFA1] hover:bg-[#BFFFA1]/80', // soft green
      'bg-[#FFE4A1] hover:bg-[#FFE4A1]/80', // soft yellow
      'bg-[#E4B4FF] hover:bg-[#E4B4FF]/80', // soft purple
      'bg-[#B4FFE4] hover:bg-[#B4FFE4]/80', // soft mint
      'bg-[#FFC8DD] hover:bg-[#FFC8DD]/80', // rose pink
      'bg-[#A2D2FF] hover:bg-[#A2D2FF]/80', // sky blue
      'bg-[#CDB4DB] hover:bg-[#CDB4DB]/80', // lavender
      'bg-[#FFE5D9] hover:bg-[#FFE5D9]/80', // peach
      'bg-[#D4E4BC] hover:bg-[#D4E4BC]/80', // sage
      'bg-[#F0DBFF] hover:bg-[#F0DBFF]/80', // light violet
      'bg-[#FFCFD2] hover:bg-[#FFCFD2]/80', // salmon pink
      'bg-[#B9FBC0] hover:bg-[#B9FBC0]/80', // mint cream
      'bg-[#FBF8CC] hover:bg-[#FBF8CC]/80', // light yellow
      'bg-[#C8E7FF] hover:bg-[#C8E7FF]/80', // baby blue
      'bg-[#FFE4E1] hover:bg-[#FFE4E1]/80', // misty rose
      'bg-[#D4F0F0] hover:bg-[#D4F0F0]/80', // powder blue
      'bg-[#FCE1E4] hover:bg-[#FCE1E4]/80', // piggy pink
      'bg-[#E8F3D6] hover:bg-[#E8F3D6]/80', // light sage
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


  return (
    // <div className='bg-gray-50'>
    //   <Header />
    //   <main className="min-h-screen p-4 container mx-auto">
    //     <div className="flex flex-col items-center gap-4 bg-white rounded-md p-4"> 
    //       <div className='flex flex-row justify-between items-center w-full border-b pb-2'>
    //         <h1 className='text-2xl font-bold'>My Lessons</h1>
    //         <div className='flex gap-2'>
    //           <button className="border px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-50">
    //             <FiFolder size={16} />
    //             New folder
    //           </button>
    //           <button className="border px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-50">
    //             <FiTrash size={16} />
    //             Recycle Bin
    //           </button>
    //           <div className="relative flex items-center">
    //             <input 
    //               type="text" 
    //               placeholder="Search my activities..." 
    //               className="border rounded px-3 py-1.5 pr-8"
    //             />
    //             <FiSearch size={16} className="absolute right-2 text-gray-400" />
    //           </div>
    //           <div className="flex gap-1">
    //             <button className="border p-1.5 rounded hover:bg-gray-50">
    //               <FiGrid size={16} />
    //             </button>
    //             <button className="border p-1.5 rounded hover:bg-gray-50">
    //               <FiList size={16} />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-5">
    //         {lessons.length === 0 && (
    //           <div className="col-span-full text-center text-gray-500 py-10">
    //             No lessons found.
    //           </div>
    //         )}
    //         {lessons.map((lesson: any) => (
    //           <div 
    //             key={lesson._id}
    //             className={`${getRandomColor()} min-h-[12rem] rounded-md p-3 relative cursor-pointer shadow-sm transition-all duration-300`}
    //             onClick={() => window.location.href = `/flashcards/${lesson.slug}`}
    //           >
    //             <div className="flex items-center gap-2 mb-2">
    //               <FiBook size={20} className="text-gray-700" />
    //               <span className="font-semibold text-gray-800">{lesson.title}</span>
    //             </div>
    //             <div className="flex items-center gap-2 text-gray-600 mb-2">
    //               <FiLayers size={16} />
    //               <span className="text-sm">Click to study</span>
    //             </div>
    //             <p className="text-sm text-gray-700 line-clamp-2 mb-8">
    //               {lesson.description || 'No description available'}
    //             </p>
    //             <div className="absolute bottom-3 right-3 flex gap-2">
    //               <button 
    //                 className="p-2 hover:bg-black/10 rounded-full transition-colors duration-300"
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   window.location.href = `/flashcards/edit/${lesson.slug}`;
    //                 }}
    //               >
    //                 <FiEdit size={16} className="text-gray-700" />
    //               </button>
    //               <button 
    //                 className="p-2 hover:bg-black/10 rounded-full transition-colors duration-300"
    //                 onClick={(e) => {
    //                   e.stopPropagation();
    //                   setLessonToDelete(lesson);
    //                   setIsDeleteModalOpen(true);
    //                 }}
    //               >
    //                 <FiTrash2 size={16} className="text-red-500" />
    //               </button>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //     <Modal
    //       isOpen={isDeleteModalOpen}
    //       onClose={() => {
    //         setIsDeleteModalOpen(false);
    //         setLessonToDelete(null);
    //       }}
    //       onConfirm={async () => {
    //         try {
    //           const token = localStorage.getItem('token');
    //           const response = await fetch(`/api/flashcards/${lessonToDelete.slug}`, {
    //             method: 'DELETE',
    //             headers: {
    //               'Authorization': `Bearer ${token}`
    //             }
    //           });

    //           if (!response.ok) {
    //             throw new Error('Failed to delete lesson');
    //           }

    //           // Refresh the lessons list
    //           fetchLessons();
    //           setIsDeleteModalOpen(false);
    //           setLessonToDelete(null);
    //         } catch (error) {
    //           console.error('Error deleting lesson:', error);
    //           alert('Failed to delete lesson');
    //         }
    //       }}
    //       title="Delete Lesson"
    //       message="Are you sure you want to delete this lesson? This action cannot be undone."
    //     />
    //   </main>
    // </div>
    <Landing />
  );
}
