'use client';

import Image from "next/image";
import Header from "@/components/Header";
import { motion } from "framer-motion";

const activities = [
    {
        title: 'Quiz Games',
        description: 'Test your knowledge with interactive quizzes',
        icon: '/brain.svg',
        demoContent: (
            <motion.div 
                className="bg-indigo-50/50 p-4 rounded-lg mt-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className="space-y-3">
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                    >
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500"></div>
                        <span className="text-sm text-gray-600">What is the capital of France?</span>
                    </motion.div>
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                    >
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500 bg-purple-500"></div>
                        <span className="text-sm font-medium text-purple-600">Paris</span>
                    </motion.div>
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: 5 }}
                    >
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500"></div>
                        <span className="text-sm text-gray-600">London</span>
                    </motion.div>
                </div>
            </motion.div>
        )
    },
    {
        title: 'Memory Match',
        description: 'Match pairs to improve your memory',
        icon: '/chart-line.svg',
        demoContent: (
            <motion.div 
                className="grid grid-cols-2 gap-2 mt-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {[1, 2, 3, 4].map((item) => (
                    <motion.div 
                        key={item}
                        className="aspect-square bg-indigo-50/50 rounded-lg 
                                 flex items-center justify-center cursor-pointer"
                        whileHover={{ 
                            scale: 1.1,
                            rotate: 5,
                            backgroundColor: "rgba(139, 92, 246, 0.1)" 
                        }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <span className="text-2xl text-purple-400">?</span>
                    </motion.div>
                ))}
            </motion.div>
        )
    },
    {
        title: 'Word Puzzles',
        description: 'Solve word puzzles and expand vocabulary',
        icon: '/trophy.svg',
        demoContent: (
            <motion.div 
                className="bg-indigo-50/50 p-4 rounded-lg mt-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className="flex justify-center gap-1">
                    {['P', 'R', 'O', 'G', 'R', 'A', 'M'].map((letter, idx) => (
                        <motion.div 
                            key={idx}
                            className="w-8 h-8 bg-white rounded flex items-center justify-center font-medium text-purple-600"
                            whileHover={{ 
                                scale: 1.2,
                                y: -5,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            initial={{ y: 0 }}
                        >
                            {letter}
                        </motion.div>
                    ))}
                </div>
                <p className="text-sm text-center text-gray-600 mt-2">Unscramble the word</p>
            </motion.div>
        )
    }
];

const ActivitiesPage = () => {
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
                            Interactive Activities
                        </motion.h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Exciting new learning activities are on their way! We're crafting engaging 
                            exercises to help you master your studies.
                        </p>
                        <motion.div 
                            className="mt-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm">
                                Coming Soon
                            </span>
                        </motion.div>
                    </motion.div>
                    
                    {/* Activity Preview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                whileHover={{ y: -5 }}
                                className="relative"
                            >
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl transform rotate-6 opacity-10"
                                    whileHover={{ 
                                        rotate: 12,
                                        scale: 1.05,
                                        opacity: 0.15
                                    }}
                                />
                                <div className="relative bg-white rounded-2xl shadow-sm p-6 backdrop-blur-sm">
                                    <motion.span 
                                        className="absolute right-4 top-4 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        Coming Soon
                                    </motion.span>
                                    <motion.div 
                                        className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Image 
                                            src={activity.icon}
                                            alt={activity.title}
                                            width={28} 
                                            height={28}
                                            className="brightness-0 invert"
                                        />
                                    </motion.div>
                                    <h3 className="font-bold text-xl mb-2">{activity.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{activity.description}</p>
                                    {activity.demoContent}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Section */}
                    <div className="flex justify-center gap-4 mt-12 flex-wrap">
                        {['AI-Powered', 'Interactive', 'Personalized', 'Engaging'].map((feature, index) => (
                            <motion.span 
                                key={feature}
                                className="px-4 py-2 bg-white rounded-full text-purple-600 text-sm font-medium shadow-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ 
                                    scale: 1.1,
                                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)"
                                }}
                            >
                                {feature}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ActivitiesPage;