'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoHomeOutline, IoPencilOutline, IoSchoolOutline, IoTrashOutline, IoVolumeHighOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Link from 'next/dist/client/link';
import Image from 'next/image';
import { Flashcard } from '@/models/Lesson';
import Modal from '@/components/Modal';

interface Lesson {
    slug: string;
    flashcards: Flashcard[];
}


const FlashcardPage = () => {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const [currentCard, setCurrentCard] = useState(0);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [phonetic, setPhonetic] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [showImageAnswer, setShowImageAnswer] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const fetchLessons = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            setIsLoading(true);
            setError(null);

            if (!token) {
                router.push('/login');
                return;
            }

            // First, fetch the lesson details
            const response = await fetch(`/api/flashcards/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        
            if (!response.ok) {
                throw new Error('Failed to fetch lesson');
            }

            const data = await response.json();
            
            if (!data) {
                setError('Lesson not found');
                return;
            }
            
            setLessons([data]);

            // Check if the current user is the owner
            const userResponse = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setIsOwner(userData.id === data.userId);
            }

        } catch (error) {
            console.error('Error fetching lessons:', error);
            setError('Failed to load lesson');
        } finally {
            setIsLoading(false);
        }
    }, [router, id]);
    
    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    //console.log(lessons);

    const speakText = useCallback((text: string) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speech.rate = 0.9; // Slightly slower for better clarity
        
        speech.onstart = () => setSpeaking(true);
        speech.onend = () => setSpeaking(false);
        speech.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(speech);
    }, []);

    const getPhonetic = useCallback(async (word: string) => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await response.json();
            if (data[0]?.phonetic) {
                setPhonetic(data[0].phonetic);
            } else if (data[0]?.phonetics[0]?.text) {
                setPhonetic(data[0].phonetics[0].text);
            } else {
                setPhonetic('');
            }
        } catch (error) {
            console.error('Error fetching phonetic:', error);
            setPhonetic('');
        }
    }, []);

    const flashcards = lessons[0]?.flashcards || [];

    useEffect(() => {
        if (flashcards[currentCard]?.front) {
            getPhonetic(flashcards[currentCard].front);
        }
    }, [currentCard, flashcards, getPhonetic]);

    useEffect(() => {
        if (flashcards[currentCard]?.type === 'image') {
            setImageLoading(true);
        }
    }, [currentCard, flashcards]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/flashcards/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                router.push('/');
            } else {
                throw new Error('Failed to delete lesson');
            }
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert('Failed to delete lesson');
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevCard();
            } else if (e.key === 'ArrowRight') {
                nextCard();
            } else if (e.key === ' ' && 
                flashcards[currentCard].type !== 'multipleChoice' && 
                flashcards[currentCard].type !== 'image') {
                setIsFlipped(!isFlipped);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentCard, isFlipped, flashcards]);

    useEffect(() => {
        // Reset state when component mounts or id changes
        setCurrentCard(0);
        setIsFlipped(false);
        setShowAnswer(false);
        setSelectedOption('');
        setUserAnswer('');
        setShowImageAnswer(false);
        
        // Cleanup function when component unmounts
        return () => {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
        };
    }, [id]); // Only run when id changes or component mounts/unmounts

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
                <p className="text-red-500">{error}</p>
                <Link href="/">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Return Home
                    </button>
                </Link>
            </div>
        );
    }

    if (lessons.length === 0) {
        return <div className="min-h-screen flex justify-center items-center">
            No lessons found
        </div>;
    }

    const renderFlashcardContent = (flashcard: Flashcard, side: 'front' | 'back') => {
        const content = side === 'front' ? flashcard.front : flashcard.back;

        switch (flashcard.type) {
            case 'image':
                return (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                        <div className="relative w-full">
                            <Image 
                                src={flashcard.imageUrl} 
                                alt={content}
                                width={300}
                                height={300}
                                className="rounded-lg mx-auto"
                                onLoadingComplete={() => setImageLoading(false)}
                            />
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                                    <div className="loader-sm"></div>
                                </div>
                            )}
                            <p className="text-sm mt-2 text-center">{content}</p>
                        </div>
                        
                        <div className="w-full flex gap-2">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Enter your answer"
                                className="flex-1 p-3 border rounded-lg"
                                disabled={showImageAnswer}
                            />
                            <button
                                onClick={() => setShowImageAnswer(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 whitespace-nowrap"
                                disabled={showImageAnswer}
                            >
                                Check
                            </button>
                        </div>

                        {showImageAnswer && (
                            <div className={`w-full p-4 rounded-lg text-center ${
                                userAnswer.toLowerCase() === flashcard.back.toLowerCase()
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {userAnswer.toLowerCase() === flashcard.back.toLowerCase() 
                                    ? '✅ Correct!' 
                                    : `❌ Incorrect. The correct answer is: ${flashcard.back}`
                                }
                            </div>
                        )}
                    </div>
                );
            
            case 'multipleChoice':
                if (side === 'front') {
                    return (
                        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                            <p className="title text-lg font-semibold text-center">{content}</p>
                            <div className="flex flex-col gap-3 w-full">
                                {flashcard.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`w-full p-4 rounded-lg text-center transition-all transform hover:scale-105
                                            ${showAnswer 
                                                ? option === flashcard.correctOption
                                                    ? 'bg-green-100 border-2 border-green-500'
                                                    : selectedOption === option
                                                        ? 'bg-red-100 border-2 border-red-500'
                                                        : 'bg-gray-100'
                                                : selectedOption === option
                                                    ? 'bg-blue-100 border-2 border-blue-500'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }
                                        `}
                                        onClick={() => {
                                            if (!showAnswer) {
                                                setSelectedOption(option);
                                                setShowAnswer(true);
                                            }
                                        }}
                                        disabled={showAnswer}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {showAnswer && (
                                <div className={`text-center p-4 rounded-lg mt-4 ${
                                    selectedOption === flashcard.correctOption 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {selectedOption === flashcard.correctOption 
                                        ? '✅ Correct!' 
                                        : `❌ Incorrect. The correct answer is: ${flashcard.correctOption}`
                                    }
                                </div>
                            )}
                        </div>
                    );
                }
                return null;

            case 'audio':
                return (
                    <div className="flex flex-col items-center gap-2">
                        <p className="title">{content}</p>
                        <audio 
                            controls 
                            src={flashcard.audioUrl}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center gap-2">
                        <p className="title">{content}</p>
                        {side === 'front' && (
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        speakText(content);
                                    }}
                                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${speaking ? 'text-blue-500' : ''}`}
                                    disabled={speaking}
                                    aria-label="Listen to pronunciation"
                                >
                                    <IoVolumeHighOutline size={24} />
                                </button>
                                <span className="text-gray-500">
                                    {phonetic || content}
                                </span>
                            </div>
                        )}
                    </div>
                );
        }
    };

    const nextCard = () => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
        setIsFlipped(false);
        setShowAnswer(false);
        setSelectedOption('');
        setUserAnswer('');
        setShowImageAnswer(false);
    };

    const prevCard = () => {
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        setIsFlipped(false);
        setShowAnswer(false);
        setSelectedOption('');
        setUserAnswer('');
        setShowImageAnswer(false);
    };

    return(
        <div className='flex flex-col items-center pt-10 px-4 md:px-20 h-screen'>
            {/* @ts-ignore */}
            <h1 className='text-2xl font-bold'>Lesson {lessons[0]?.title}</h1>
            <div className='flex flex-col md:flex-row items-center justify-end w-full gap-4 mt-4'>
                <Link href={`/flashcards/exam/${id}`} className='w-full md:w-auto'>
                    <button className='w-full bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2'>
                        <IoSchoolOutline />
                        Exam lesson
                    </button>
                </Link>

                {isOwner && (
                    <>
                        <Link href={`/flashcards/edit/${id}`} className='w-full md:w-auto'>
                            <button className='w-full bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2'>
                                <IoPencilOutline />
                                Edit lesson
                            </button>
                        </Link>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            disabled={isDeleting}
                            className='w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 disabled:opacity-50'
                        >
                            <IoTrashOutline />
                            {isDeleting ? 'Deleting...' : 'Delete lesson'}
                        </button>
                    </>
                )}

                <Link href={`/`} className='w-full md:w-auto'>
                    <button className='w-full bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2'>
                        <IoHomeOutline />
                        Home
                    </button>
                </Link>
            </div>
            {flashcards.length > 0 ? (
                <div className='flex flex-col items-center justify-center w-full pt-10 md:pt-32'>
                    <div className='flex items-center justify-center w-full max-w-4xl px-4'>
                        <button 
                            onClick={prevCard}
                            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Previous card"
                        >
                            <IoChevronBackOutline size={28} />
                        </button>

                        <div className='flex-1 flex justify-center mx-8'>
                            {flashcards[currentCard].type === 'multipleChoice' ? (
                                <div className="w-full max-w-xl px-4">
                                    {renderFlashcardContent(flashcards[currentCard], 'front')}
                                </div>
                            ) : flashcards[currentCard].type === 'image' ? (
                                <div className="w-full max-w-xl px-4">
                                    {renderFlashcardContent(flashcards[currentCard], 'front')}
                                </div>
                            ) : (
                                <div 
                                    className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
                                    onClick={() => setIsFlipped(!isFlipped)}
                                >
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            {renderFlashcardContent(flashcards[currentCard], 'front')}
                                        </div>
                                        <div className="flip-card-back">
                                            {renderFlashcardContent(flashcards[currentCard], 'back')}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={nextCard}
                            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Next card"
                        >
                            <IoChevronForwardOutline size={28} />
                        </button>
                    </div>
                    
                    {/* Card counter */}
                    <div className="mt-6 text-gray-500">
                        {currentCard + 1} / {flashcards.length}
                    </div>
                </div>
            ) : (
                <div className="pt-20 md:pt-40">No flashcards available for this lesson.</div>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Lesson"
                message='Are you sure you want to delete this lesson?'
            />
        </div>
    )
};

export default FlashcardPage;