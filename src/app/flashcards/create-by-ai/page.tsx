'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdAutorenew } from "react-icons/md";
import Header from "@/components/Header";

const CreateByAI = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        category: "",
        topic: "",
        prompt: "",
        title: "",
        description: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            title: name === 'topic' ? value : prev.title,
            description: name === 'category' ? `Flashcards about ${prev.topic} in ${value}` : prev.description,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Generate flashcards using OpenAI
            const generateResponse = await fetch('/api/flashcards/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!generateResponse.ok) {
                throw new Error('Failed to generate flashcards');
            }

            const { flashcards } = await generateResponse.json();

            // Create the lesson with generated flashcards
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const createResponse = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: formData.topic,
                    description: `Flashcards about ${formData.topic} in ${formData.category}`,
                    flashcards,
                }),
            });

            if (createResponse.ok) {
                router.push('/');
            } else {
                throw new Error('Failed to create lesson');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate flashcards. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 pt-16">
                <div className="container mx-auto px-4 py-4 sm:py-8 relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

                    {/* Title Section */}
                    <div className="text-center mb-8 relative">
                        {/* Small decorative circles */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-200 rounded-full opacity-50 floating"></div>
                        <div className="absolute top-0 right-0 w-10 h-10 sm:w-16 sm:h-16 bg-pink-200 rounded-full opacity-50 floating animation-delay-1000"></div>
                        
                        <div className="relative inline-block">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                                Create Flashcards with AI
                            </h1>
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full"></div>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mt-4">
                            Let AI help you generate flashcards based on your topic and requirements
                        </p>
                    </div>

                    {/* Main Form */}
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 text-gray-700 font-medium">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                            placeholder="e.g., Learning English, Learning Spanish, Learning French"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-gray-700 font-medium">
                                            Topic <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="topic"
                                            value={formData.topic}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                            placeholder="e.g., English Vocabulary, Spanish Vocabulary, French Vocabulary"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-gray-700 font-medium">
                                            Custom Prompt (Optional)
                                        </label>
                                        <textarea
                                            name="prompt"
                                            value={formData.prompt}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                            placeholder="e.g., Create 5 flashcards about English Vocabulary focusing on Animals"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="px-6 py-3 text-indigo-600 hover:text-indigo-700 font-medium rounded-xl 
                                        hover:bg-indigo-50 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl 
                                        hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium 
                                        shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <MdAutorenew size={20} />
                                            Generate Flashcards
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateByAI;