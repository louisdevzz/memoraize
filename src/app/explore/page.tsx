'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ILesson } from '@/models/Lesson';
import { FiBook, FiLayers, FiAward, FiBookOpen, FiClipboard, FiCompass, FiDatabase, FiEdit3, FiGlobe } from 'react-icons/fi';
import Header from '@/components/Header';

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
            'bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200',
            'bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200',
            'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200',
            'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
            'bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const getRandomIcon = () => {
        const icons = [
            { icon: FiBook, color: 'text-indigo-600 bg-indigo-100' },
            { icon: FiAward, color: 'text-pink-600 bg-pink-100' },
            { icon: FiBookOpen, color: 'text-purple-600 bg-purple-100' },
            { icon: FiClipboard, color: 'text-blue-600 bg-blue-100' },
            { icon: FiCompass, color: 'text-cyan-600 bg-cyan-100' },
        ];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 pt-16">
                <div className="container mx-auto px-4 py-8 relative">
                    {/* Header Section */}
                    <div className="text-center mb-12 relative">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                            Explore <span className="gradient-text">Flashcards</span>
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                            Discover and learn from a variety of flashcard sets created by our community
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-200 rounded-full opacity-50 floating hidden lg:block"></div>
                        <div className="absolute top-0 right-0 w-10 h-10 sm:w-16 sm:h-16 bg-pink-200 rounded-full opacity-50 floating hidden lg:block"></div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {lessons.map((lesson) => {
                            const IconComponent = getRandomIcon();
                            return (
                                <Link 
                                    key={lesson.slug} 
                                    href={`/flashcards/${lesson.slug}`}
                                    className={`${getRandomColor()} group backdrop-blur-md rounded-2xl p-6 relative block transition-all duration-300 hover:shadow-xl border border-white/50 hover:border-white/80`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2.5 rounded-xl ${IconComponent.color} transition-colors duration-300`}>
                                            <IconComponent.icon size={24} className="shrink-0" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1 group-hover:text-gray-900">
                                            {lesson.title}
                                        </h2>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-6 group-hover:text-gray-700">
                                        {lesson.description}
                                    </p>

                                    <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-sm text-gray-500 group-hover:text-gray-600">
                                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full">
                                            <FiBookOpen size={16} />
                                            <span>{lesson.flashcards.length} cards</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full">
                                            <FiClipboard size={16} />
                                            <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {lessons.length === 0 && (
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-white/50">
                            <div className="text-gray-600 mb-4">No public flashcard sets available yet.</div>
                            <Link 
                                href="/create/template" 
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors duration-300"
                            >
                                <FiEdit3 size={18} />
                                Create your first set
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Explorer;