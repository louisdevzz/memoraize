'use client';

import Image from "next/image";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const demoData = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 75 },
    { name: 'Wed', score: 85 },
    { name: 'Thu', score: 78 },
    { name: 'Fri', score: 90 },
    { name: 'Sat', score: 88 },
    { name: 'Sun', score: 95 },
];

const ResultsPage = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50">
                <div className="container mx-auto px-4 py-16">
                    {/* Header Section */}
                    <motion.div 
                        className="text-center mb-16 mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            Results & Analytics
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Your personalized learning analytics dashboard is under construction. 
                            Track your progress with advanced insights.
                        </p>
                        <div className="mt-4">
                            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full font-semibold animate-pulse">
                                Coming Soon
                            </span>
                        </div>
                    </motion.div>

                    {/* Analytics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { 
                                title: 'Progress Tracking', 
                                value: '85%',
                                icon: '/chart-line.svg'
                            },
                            { 
                                title: 'Performance Metrics', 
                                value: '92%',
                                icon: '/chart-bar.svg'
                            },
                            { 
                                title: 'Learning Patterns', 
                                value: '78%',
                                icon: '/brain.svg'
                            },
                            { 
                                title: 'Achievement Stats', 
                                value: '95%',
                                icon: '/trophy.svg'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow relative overflow-hidden"
                            >
                                <div className="absolute top-2 right-2">
                                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                        Coming Soon
                                    </span>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Image 
                                        src={feature.icon}
                                        alt={feature.title} 
                                        width={24} 
                                        height={24}
                                        className="brightness-0 invert"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
                                <p className="text-2xl font-bold text-indigo-600 mt-2">{feature.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart Preview */}
                    <motion.div 
                        className="mt-12 bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="inline-block px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold">
                                Preview Coming Soon
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-center mb-6">Weekly Learning Progress</h2>
                        <div className="h-[300px] w-full relative">
                            <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-gray-400">Coming Soon</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={demoData}
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2}/>
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="monotone" 
                                        dataKey="score" 
                                        stroke="#6366f1"
                                        fill="url(#colorScore)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {['Daily Progress', 'Weekly Stats', 'Monthly Report', 'Yearly Overview'].map((stat) => (
                                <span 
                                    key={stat}
                                    className="px-3 py-1 bg-gray-50 rounded-full text-indigo-600 text-sm"
                                >
                                    {stat}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

export default ResultsPage; 