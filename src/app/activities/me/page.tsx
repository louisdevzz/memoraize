'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ILesson } from '@/models/Lesson';
import { FiBook, FiBookOpen, FiClipboard, FiEdit3, FiAward, FiStar, FiUser, FiHeart, FiCoffee, FiCode, FiMusic, FiGlobe, FiLock, FiUnlock } from 'react-icons/fi';
import {FaRobot} from "react-icons/fa"
import Header from '@/components/Header';
import { motion } from 'framer-motion';

const MyLessons = () => {
    const [lessons, setLessons] = useState<ILesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchLessons = useCallback(async () => {
        try {
            setIsLoading(true);
            
            const response = await fetch('/api/flashcards/byUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    router.push('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                if (data.error === 'Not authenticated') {
                    router.push('/login');
                    return;
                }
                throw new Error(data.error);
            }

            if (Array.isArray(data)) {
                setLessons(data);
            }

        } catch (error) {
            console.error('Error fetching lessons:', error);
            router.push('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    const getRandomColor = () => {
        const colors = [
            { gradient: 'from-purple-500 to-indigo-500', hover: 'hover:from-purple-600 hover:to-indigo-600' },
            { gradient: 'from-indigo-500 to-blue-500', hover: 'hover:from-indigo-600 hover:to-blue-600' },
            { gradient: 'from-blue-500 to-cyan-500', hover: 'hover:from-blue-600 hover:to-cyan-600' },
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const getRandomIcon = () => {
        const icons = [
            { icon: FiBook, color: 'text-purple-500' },
            { icon: FiAward, color: 'text-indigo-500' },
            { icon: FiStar, color: 'text-blue-500' },
            { icon: FiHeart, color: 'text-pink-500' },
            { icon: FiCode, color: 'text-cyan-500' },
            { icon: FiGlobe, color: 'text-emerald-500' },
            { icon: FiMusic, color: 'text-violet-500' },
            { icon: FiCoffee, color: 'text-amber-500' },
        ];
        return icons[Math.floor(Math.random() * icons.length)];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 flex items-center justify-center">
                <div className="loader" />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50">
                {/* Floating Background Elements */}
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

                <div className="container mx-auto px-4 py-16 relative">
                    {/* Header Section */}
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <motion.h1 
                            className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4 mt-10"
                            whileInView={{ 
                                backgroundPosition: ["0%", "100%"],
                                transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                            }}
                        >
                            My Flashcards
                        </motion.h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Manage and review your personal collection of flashcard sets
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <motion.div 
                                className="mt-8"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link 
                                    href="/flashcards/create" 
                                    className="inline-flex items-center gap-2 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                                >
                                    <FiEdit3 size={18} />
                                    Create New Set
                                </Link>
                            </motion.div>
                            <motion.div 
                                className="mt-8"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Link 
                                    href="/flashcards/create-by-ai" 
                                    className="inline-flex items-center gap-2 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                                >
                                    <FaRobot size={18} />
                                    Create by AI
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Lessons Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {lessons.map((lesson, index) => {
                            const colors = getRandomColor();
                            const IconComponent = getRandomIcon();
                            return (
                                <motion.div
                                    key={lesson.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative group/card"
                                >
                                    <div 
                                        className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-3xl 
                                               opacity-0 group-hover/card:opacity-10 transition-all duration-300 
                                               transform rotate-6 group-hover/card:rotate-12 pointer-events-none`}
                                    />
                                    <Link href={`/flashcards/${lesson.slug}`}>
                                        <motion.div 
                                            className="relative bg-white rounded-2xl shadow-sm p-6 backdrop-blur-sm 
                                                      border border-white/50 h-full transition-all duration-300
                                                      hover:shadow-lg hover:-translate-y-1"
                                        >
                                            <div className="flex items-center gap-4 mb-4">
                                                <motion.div 
                                                    className={`w-14 h-14 bg-gradient-to-r ${colors.gradient} rounded-xl 
                                                              flex items-center justify-center transition-transform duration-300 
                                                              group-hover/card:scale-110`}
                                                >
                                                    <IconComponent.icon className="text-white text-2xl" />
                                                </motion.div>
                                                <div>
                                                    <div 
                                                        className="text-xs font-medium text-purple-600 bg-purple-50 
                                                                 px-2 py-1 rounded-full inline-block mb-1"
                                                    >
                                                        {lesson.visibility === 'public' ? (
                                                            <>
                                                                <FiUnlock className="inline mr-1" />
                                                                Public Set
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiLock className="inline mr-1" />
                                                                Private Set
                                                            </>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-xl line-clamp-1">{lesson.title}</h3>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>

                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <div 
                                                    className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 
                                                             rounded-full text-sm text-gray-500 transition-transform 
                                                             duration-300 hover:scale-105"
                                                >
                                                    <FiBookOpen size={16} />
                                                    <span>{lesson.flashcards.length} cards</span>
                                                </div>
                                                <div 
                                                    className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 
                                                             rounded-full text-sm text-gray-500 transition-transform 
                                                             duration-300 hover:scale-105"
                                                >
                                                    <FiClipboard size={16} />
                                                    <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div
                                                className={`absolute bottom-4 right-4 p-2 rounded-full 
                                                          bg-gradient-to-r ${colors.gradient} transition-transform 
                                                          duration-300 group-hover/card:scale-110`}
                                            >
                                                <FiBookOpen className="text-white" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {lessons.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-white/50 max-w-2xl mx-auto"
                        >
                            <div className="text-gray-600 mb-4">You haven't created any flashcard sets yet.</div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link 
                                    href="/create/template" 
                                    className="inline-flex items-center gap-2 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                                >
                                    <FiEdit3 size={18} />
                                    Create your first set
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyLessons;