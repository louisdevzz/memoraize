'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ILesson } from '@/models/Lesson';
import { FiBook, FiLayers, FiAward, FiBookOpen, FiClipboard, FiCompass, FiDatabase, FiEdit3, FiGlobe } from 'react-icons/fi';

const Explorer = () => {
    const [lessons, setLessons] = useState<ILesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPublicLessons = async () => {
            try {
                const response = await fetch('/api/flashcards?visibility=public');
                if (response.ok) {
                    const data = await response.json();
                    setLessons(data);
                }
            } catch (error) {
                console.error('Error fetching public lessons:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicLessons();
    }, []);

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

    const getRandomIcon = () => {
        const icons = [
            { icon: FiBook, color: 'text-blue-600' },
            { icon: FiAward, color: 'text-yellow-600' },
            { icon: FiBookOpen, color: 'text-green-600' },
            { icon: FiClipboard, color: 'text-red-600' },
            { icon: FiCompass, color: 'text-indigo-600' },
            { icon: FiDatabase, color: 'text-pink-600' },
            { icon: FiEdit3, color: 'text-teal-600' },
            { icon: FiGlobe, color: 'text-cyan-600' },
        ];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center pt-10 px-4 sm:px-6 md:px-8 lg:px-12 min-h-screen">
            <h1 className="text-4xl font-bold mb-8 text-center">Explore Flashcards</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 w-full max-w-[1400px]">
                {lessons.map((lesson) => {
                    const IconComponent = getRandomIcon();
                    return (
                        <Link 
                            key={lesson.slug} 
                            href={`/flashcards/${lesson.slug}`}
                            className={`${getRandomColor()} min-h-[10rem] sm:min-h-[12rem] rounded-lg p-4 sm:p-6 relative block transition-all duration-300 shadow-sm hover:shadow-md`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <IconComponent.icon size={18} className={`${IconComponent.color} shrink-0`} />
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-1">{lesson.title}</h2>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <FiLayers size={16} />
                                <span className="text-sm">Click to study</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2 mb-8">
                                {lesson.description}
                            </p>
                            <div className="absolute bottom-3 left-6 right-6 flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FiBookOpen size={16} />
                                    <span>{lesson.flashcards.length} cards</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClipboard size={16} />
                                    <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                
                {lessons.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-10">
                        No public flashcard sets available yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explorer;