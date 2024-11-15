'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdAutorenew } from "react-icons/md";

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
        <div className="flex flex-col items-center pt-10 px-20 h-screen">
            <div className="flex flex-row-reverse gap-10 justify-center items-center w-full max-w-2xl">
                <h1 className="text-4xl font-bold">Create by AI</h1>
                <Link 
                    href="/" 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                    <MdArrowBack size={20} />
                    Return Home
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-10 space-y-6">
                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter category (e.g., Learning English, Learning Spanish, Learning French)"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                        Topic
                    </label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter topic (e.g., English Vocabulary, Spanish Vocabulary, French Vocabulary)"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                        Custom Prompt (Optional)
                    </label>
                    <textarea
                        id="prompt"
                        name="prompt"
                        value={formData.prompt}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Enter custom prompt (e.g., Create 5 flashcards about English Vocabulary about the topic of Animals)"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
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
            </form>
        </div>
    );
};

export default CreateByAI;