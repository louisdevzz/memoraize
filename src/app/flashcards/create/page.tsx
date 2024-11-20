'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Flashcard, FlashcardType } from '@/models/Lesson';
import { IoAdd, IoClose, IoArrowBack } from 'react-icons/io5';
import Header from '@/components/Header';
import Select from '@/components/Select';

const CreateFlashcardPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        flashcards: [createEmptyFlashcard()],
        visibility: 'private' as 'public' | 'private'
    });
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<{ [key: number]: boolean }>({});
    const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
    const [error, setError] = useState<string>('');

    function createEmptyFlashcard(): Flashcard {
        return {
            type: 'text' as FlashcardType,
            front: '',
            back: '',
            options: [],
            correctOption: '',
            imageUrl: '',
            audioUrl: ''
        } as Flashcard;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFlashcardChange = (index: number, field: string, value: any) => {
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

    const handleTypeChange = (index: number, type: FlashcardType) => {
        setFormData(prev => {
            const updatedFlashcards = [...prev.flashcards];
            updatedFlashcards[index] = {
                ...createEmptyFlashcard(),
                type
            } as Flashcard;
            return {
                ...prev,
                flashcards: updatedFlashcards
            };
        });
    };

    const addOption = (flashcardIndex: number) => {
        setFormData(prev => {
            const updatedFlashcards = [...prev.flashcards];
            const flashcard = updatedFlashcards[flashcardIndex] as any;
            flashcard.options = [...(flashcard.options || []), ''];
            return {
                ...prev,
                flashcards: updatedFlashcards
            };
        });
    };

    const handleOptionChange = (flashcardIndex: number, optionIndex: number, value: string) => {
        setFormData(prev => {
            const updatedFlashcards = [...prev.flashcards];
            const flashcard = updatedFlashcards[flashcardIndex] as any;
            flashcard.options[optionIndex] = value;
            return {
                ...prev,
                flashcards: updatedFlashcards
            };
        });
    };

    const removeOption = (flashcardIndex: number, optionIndex: number) => {
        setFormData(prev => {
            const updatedFlashcards = [...prev.flashcards];
            const flashcard = updatedFlashcards[flashcardIndex] as any;
            flashcard.options = flashcard.options.filter((_: any, i: number) => i !== optionIndex);
            return {
                ...prev,
                flashcards: updatedFlashcards
            };
        });
    };

    const addFlashcard = () => {
        setFormData(prev => ({
            ...prev,
            flashcards: [...prev.flashcards, createEmptyFlashcard()]
        }));
    };

    const removeFlashcard = (index: number) => {
        setFormData(prev => ({
            ...prev,
            flashcards: prev.flashcards.filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = async (index: number, file: File, fileType: 'image' | 'audio') => {
        try {
            setUploadingFiles(prev => ({ ...prev, [index]: true }));
            if (fileType === 'image') {
                setImageLoading(prev => ({ ...prev, [index]: true }));
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileType', fileType);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            handleFlashcardChange(index, fileType === 'image' ? 'imageUrl' : 'audioUrl', data.url);
        } catch (error) {
            console.error(`Error uploading ${fileType}:`, error);
        } finally {
            setUploadingFiles(prev => ({ ...prev, [index]: false }));
        }
    };

    const renderFlashcardFields = (flashcard: Flashcard, index: number) => {
        switch (flashcard.type) {
            case 'image':
                return (
                    <>
                        <div>
                            <label className="block mb-1">Image</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    //@ts-ignore
                                    ref={(el) => fileInputRefs.current[index] = el}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleFileUpload(index, file, 'image');
                                        }
                                    }}
                                />
                                <div className="flex gap-4 items-center">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRefs.current[index]?.click()}
                                        disabled={uploadingFiles[index]}
                                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {uploadingFiles[index] ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Choose Image'
                                        )}
                                    </button>
                                    {flashcard.imageUrl && (
                                        <div className="relative w-24 h-24 bg-gray-100 rounded-md">
                                            {(imageLoading[index] || uploadingFiles[index]) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                            <img
                                                src={flashcard.imageUrl}
                                                alt="Uploaded preview"
                                                className={`w-full h-full object-cover rounded-md transition-opacity duration-200 ${
                                                    imageLoading[index] ? 'opacity-0' : 'opacity-100'
                                                }`}
                                                onLoad={() => setImageLoading(prev => ({ ...prev, [index]: false }))}
                                                onError={() => {
                                                    setImageLoading(prev => ({ ...prev, [index]: false }));
                                                    console.error('Error loading image');
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleFlashcardChange(index, 'imageUrl', '');
                                                    setImageLoading(prev => ({ ...prev, [index]: false }));
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <IoClose size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {!flashcard.imageUrl && (
                                    <input
                                        type="url"
                                        placeholder="Or paste image URL"
                                        value={flashcard.imageUrl}
                                        onChange={(e) => handleFlashcardChange(index, 'imageUrl', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1">Description</label>
                            <input
                                type="text"
                                value={flashcard.front}
                                onChange={(e) => handleFlashcardChange(index, 'front', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Answer</label>
                            <input
                                type="text"
                                value={flashcard.back}
                                onChange={(e) => handleFlashcardChange(index, 'back', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </>
                );

            case 'multipleChoice':
                return (
                    <>
                        <div>
                            <label className="block mb-1">Question</label>
                            <input
                                type="text"
                                value={flashcard.front}
                                onChange={(e) => handleFlashcardChange(index, 'front', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Answer</label>
                            <input
                                type="text"
                                value={flashcard.back}
                                onChange={(e) => handleFlashcardChange(index, 'back', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block mb-1">Options</label>
                            {(flashcard as any).options.map((option: string, optionIndex: number) => (
                                <div key={optionIndex} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                        className="flex-1 p-2 border rounded"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index, optionIndex)}
                                        className="p-2 text-red-500"
                                    >
                                        <IoClose />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addOption(index)}
                                className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 text-gray-600"
                            >
                                Add Option
                            </button>
                        </div>
                        <div>
                            <label className="block mb-1">Correct Option</label>
                            <select
                                value={(flashcard as any).correctOption}
                                onChange={(e) => handleFlashcardChange(index, 'correctOption', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select correct option</option>
                                {(flashcard as any).options.map((option: string, i: number) => (
                                    <option key={i} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </>
                );

            case 'audio':
                return (
                    <>
                        <div>
                            <label className="block mb-1">Audio File</label>
                            <div className="space-y-2">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    className="hidden"
                                    //@ts-ignore
                                    ref={(el) => fileInputRefs.current[index] = el}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleFileUpload(index, file, 'audio');
                                        }
                                    }}
                                />
                                <div className="flex gap-4 items-center">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRefs.current[index]?.click()}
                                        disabled={uploadingFiles[index]}
                                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {uploadingFiles[index] ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Choose Audio File'
                                        )}
                                    </button>
                                    {flashcard.audioUrl && (
                                        <div className="flex items-center gap-2">
                                            <audio 
                                                controls 
                                                src={flashcard.audioUrl}
                                                className="h-8"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleFlashcardChange(index, 'audioUrl', '')}
                                                className="p-1 bg-red-500 text-white rounded-full"
                                            >
                                                <IoClose size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {!flashcard.audioUrl && (
                                    <input
                                        type="url"
                                        placeholder="Or paste audio URL"
                                        value={flashcard.audioUrl}
                                        onChange={(e) => handleFlashcardChange(index, 'audioUrl', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1">Description</label>
                            <input
                                type="text"
                                value={flashcard.front}
                                onChange={(e) => handleFlashcardChange(index, 'front', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Answer</label>
                            <input
                                type="text"
                                value={flashcard.back}
                                onChange={(e) => handleFlashcardChange(index, 'back', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </>
                );

            default: // text
                return (
                    <>
                        <div>
                            <label className="block mb-1">Question</label>
                            <input
                                type="text"
                                value={flashcard.front}
                                onChange={(e) => handleFlashcardChange(index, 'front', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Answer</label>
                            <input
                                type="text"
                                value={flashcard.back}
                                onChange={(e) => handleFlashcardChange(index, 'back', e.target.value)}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </>
                );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validate flashcards
            const invalidFlashcards = formData.flashcards.filter(flashcard => {
                if (!flashcard.front || !flashcard.back) return true;
                if (flashcard.type === 'multipleChoice' && 
                    (!flashcard.options?.length || !flashcard.correctOption)) return true;
                if (flashcard.type === 'image' && !flashcard.imageUrl) return true;
                if (flashcard.type === 'audio' && !flashcard.audioUrl) return true;
                return false;
            });

            if (invalidFlashcards.length > 0) {
                throw new Error('Please fill in all required fields for each flashcard');
            }

            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for sending cookies
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    flashcards: formData.flashcards,
                    visibility: formData.visibility
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(data.error || 'Failed to create flashcard set');
            }

            router.push(`/flashcards/${data.slug}`);
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred');
            console.error('Error creating flashcard set:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const visibilityOptions = [
        { value: 'private', label: 'Private - Only you can see this', icon: '🔒' },
        { value: 'public', label: 'Public - Anyone can see this', icon: '🌎' }
    ];

    const cardTypeOptions = [
        { value: 'text', label: 'Basic Card', icon: '📝' },
        { value: 'image', label: 'Image Card', icon: '🖼️' },
        { value: 'multipleChoice', label: 'Multiple Choice', icon: '📋' },
        { value: 'audio', label: 'Audio Card', icon: '🎵' }
    ];

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
                                Create New Flashcard Set
                            </h1>
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full"></div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="max-w-2xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 border border-white/50 relative z-10">
                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="block mb-2 text-gray-700 font-medium">Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block mb-2 text-gray-700 font-medium">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label="Visibility"
                                            value={formData.visibility}
                                            onChange={(value) => handleInputChange({
                                                target: { name: 'visibility', value }
                                            } as any)}
                                            options={visibilityOptions}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Flashcards Section */}
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 border border-white/50 z-0">
                                <h2 className="text-xl font-semibold mb-6 text-gray-800">Flashcards</h2>
                                <div className="space-y-6">
                                    {formData.flashcards.map((flashcard, index) => (
                                        <div key={index} className="bg-white/90 rounded-xl p-6 space-y-4 shadow-sm border border-gray-100">
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
                                            <div className="relative">
                                                <Select
                                                    label="Card Type"
                                                    value={flashcard.type}
                                                    onChange={(value) => handleTypeChange(index, value as FlashcardType)}
                                                    options={cardTypeOptions}
                                                    required
                                                />
                                            </div>
                                            {renderFlashcardFields(flashcard, index)}
                                        </div>
                                    ))}
                                    
                                    <button
                                        type="button"
                                        onClick={addFlashcard}
                                        className="w-full p-4 border-2 border-dashed border-indigo-200 rounded-xl hover:border-indigo-400 
                                            text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-2 transition-all duration-300"
                                    >
                                        <IoAdd size={20} />
                                        Add Flashcard
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
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
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl 
                                        hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium 
                                        shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Set'
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

export default CreateFlashcardPage;