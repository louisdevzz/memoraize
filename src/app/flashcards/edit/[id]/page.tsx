'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Flashcard {
    front: string;
    back: string;
}

interface LessonForm {
    title: string;
    description: string;
    flashcards: Flashcard[];
}

const EditFlashcardPage = () => {
    const router = useRouter();
    const params = useParams();
    const slug = params.id as string;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<LessonForm>({
        title: '',
        description: '',
        flashcards: [{ front: '', back: '' }]
    });

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch(`/api/flashcards/${slug}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const lesson = await response.json();
                    setFormData({
                        title: lesson.title,
                        description: lesson.description,
                        flashcards: lesson.flashcards
                    });
                } else {
                    throw new Error('Failed to fetch lesson');
                }
            } catch (error) {
                console.error('Error fetching lesson:', error);
                router.push('/');
            }
        };

        fetchLesson();
    }, [slug, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFlashcardChange = (index: number, field: 'front' | 'back', value: string) => {
        setFormData(prev => {
            const updatedFlashcards = [...prev.flashcards];
            updatedFlashcards[index] = {
                ...updatedFlashcards[index],
                [field]: value
            };
            return {
                ...prev,
                flashcards: updatedFlashcards
            };
        });
    };

    const addFlashcard = () => {
        setFormData(prev => ({
            ...prev,
            flashcards: [...prev.flashcards, { front: '', back: '' }]
        }));
    };

    const removeFlashcard = (index: number) => {
        setFormData(prev => ({
            ...prev,
            flashcards: prev.flashcards.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('/api/flashcards', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    slug
                }),
            });

            if (response.ok) {
                router.push('/');
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update lesson');
            }
        } catch (error) {
            console.error('Error updating lesson:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if(isLoading){
        return <div className="min-h-screen flex justify-center items-center">
            <div className='loader'></div>
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Edit Lesson</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows={3}
                        required
                    />
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Flashcards</h2>
                    {formData.flashcards.map((flashcard, index) => (
                        <div key={index} className="p-4 border rounded space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Card {index + 1}</span>
                                {formData.flashcards.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFlashcard(index)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1">Tiếng Anh (English)</label>
                                <input
                                    type="text"
                                    value={flashcard.front}
                                    onChange={(e) => handleFlashcardChange(index, 'front', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Tiếng Việt (Vietnamese)</label>
                                <input
                                    type="text"
                                    value={flashcard.back}
                                    onChange={(e) => handleFlashcardChange(index, 'back', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addFlashcard}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 text-gray-600"
                    >
                        + Add Flashcard
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Update Lesson'}
                </button>
            </form>
        </div>
    );
};

export default EditFlashcardPage;