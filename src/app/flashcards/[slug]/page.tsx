'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoHomeOutline, IoPencilOutline, IoSchoolOutline, IoTrashOutline, IoVolumeHighOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Link from 'next/dist/client/link';
import Image from 'next/image';
import { Flashcard } from '@/models/Lesson';
import Modal from '@/components/Modal';
import Header from '@/components/Header';
import { useSwipeable } from 'react-swipeable';

interface Lesson {
    slug: string;
    flashcards: Flashcard[];
    title: string;
}

const FlashcardPage = () => {
    const params = useParams();
    const slug = params.slug;
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
            setIsLoading(true);
            setError(null);

            // Fetch the lesson details
            const response = await fetch(`/api/flashcards/bySlug?slug=${slug}`);
        
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch lesson');
            }

            const data = await response.json();
            
            if (!data) {
                setError('Lesson not found');
                return;
            }
            
            setLessons([data]);
            // The isOwner flag is now included in the response
            setIsOwner(data.isOwner);

        } catch (error) {
            console.error('Error fetching lessons:', error);
            setError('Failed to load lesson');
        } finally {
            setIsLoading(false);
        }
    }, [router, slug]);
    
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
            const response = await fetch(`/api/flashcards/bySlug?slug=${slug}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(data.error || 'Failed to delete lesson');
            }
    
            router.push('/');
        } catch (error) {
            console.error('Error deleting lesson:', error);
            setError('Failed to delete lesson');
        } finally {
            setIsDeleting(false);
            setIsModalOpen(false);
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
    }, [slug]); // Only run when id changes or component mounts/unmounts

    // Updated wa handlers with correct property names
    const handlers = useSwipeable({
        onSwipedLeft: () => nextCard(),
        onSwipedRight: () => prevCard(),
        touchEventOptions: { passive: false },
        trackTouch: true,
        trackMouse: false
    });

    // Function to generate dots
    const renderDots = () => {
        return (
            <div className="text-gray-500 text-sm text-center mt-4">
                Swipe left or right to navigate
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 flex flex-col gap-4 justify-center items-center">
                <p className="text-red-500">{error}</p>
                <Link 
                    href="/"
                    className="group flex items-center justify-center gap-2 text-gray-500 hover:text-indigo-600 text-sm transition-all duration-300 border border-gray-200 hover:border-indigo-600/30 rounded-xl p-3 hover:bg-indigo-50/50"
                >
                    <IoHomeOutline size={18} />
                    Return Home
                </Link>
            </div>
        );
    }

    const renderFlashcardContent = (flashcard: Flashcard, side: 'front' | 'back') => {
        const content = side === 'front' ? flashcard.front : flashcard.back;

        switch (flashcard.type) {
            case 'text':
                return (
                    <div className="flex flex-col items-center justify-center h-full w-full p-6 relative">
                        <div className="absolute top-4 left-4 w-20 h-20 bg-indigo-100 rounded-full opacity-20"></div>
                        <div className="absolute bottom-4 right-4 w-16 h-16 bg-pink-100 rounded-full opacity-20"></div>
                        
                        <p className="text-3xl sm:text-5xl font-bold text-gray-800 text-center mb-4 relative z-10">
                            {content}
                        </p>
                        
                        {side === 'front' && (
                            <div className="flex items-center gap-4 mt-4">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        speakText(content);
                                    }}
                                    className={`p-3 rounded-full transition-all duration-300 
                                        ${speaking 
                                            ? 'bg-indigo-100 text-indigo-600 scale-110' 
                                            : 'hover:bg-indigo-50 text-gray-500 hover:text-indigo-600'
                                        }`}
                                    disabled={speaking}
                                >
                                    <IoVolumeHighOutline 
                                        size={28} 
                                        className={`transform transition-transform duration-300 ${speaking ? 'scale-110' : ''}`}
                                    />
                                </button>
                                {phonetic && (
                                    <span className="text-base sm:text-xl px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-white text-gray-600 shadow-sm border border-gray-100">
                                        {phonetic}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                        <div className="relative w-full group">
                            <Image 
                                src={flashcard.imageUrl} 
                                alt={content}
                                width={300}
                                height={300}
                                className="rounded-2xl mx-auto shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                                onLoadingComplete={() => setImageLoading(false)}
                            />
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                                    <div className="loader-sm"></div>
                                </div>
                            )}
                            <p className="text-base mt-3 text-center font-medium text-gray-700">{content}</p>
                        </div>
                        
                        <div className="w-full space-y-4">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Enter your answer"
                                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                disabled={showImageAnswer}
                            />
                            <button
                                onClick={() => setShowImageAnswer(true)}
                                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                                disabled={showImageAnswer}
                            >
                                Check Answer
                            </button>
                        </div>

                        {showImageAnswer && (
                            <div className={`w-full p-4 rounded-xl text-center transition-all duration-300 ${
                                userAnswer.toLowerCase() === flashcard.back.toLowerCase()
                                    ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700'
                                    : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700'
                            }`}>
                                <p className="font-medium">
                                    {userAnswer.toLowerCase() === flashcard.back.toLowerCase() 
                                        ? '✨ Excellent! That\'s correct!' 
                                        : `Not quite. The correct answer is: "${flashcard.back}"`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                );
            
            case 'multipleChoice':
                if (side === 'front') {
                    return (
                        <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                            <p className="text-xl sm:text-3xl font-semibold text-center text-gray-800 mb-2">
                                {content}
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                {flashcard.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`w-full p-4 rounded-xl text-center transition-all transform hover:scale-[1.02] font-medium
                                            ${showAnswer 
                                                ? option === flashcard.correctOption
                                                    ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 border-2 border-green-500'
                                                    : selectedOption === option
                                                        ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-2 border-red-500'
                                                        : 'bg-white/50 text-gray-500'
                                                : selectedOption === option
                                                    ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 text-indigo-700 border-2 border-indigo-500'
                                                    : 'bg-white/50 hover:bg-white/80 text-gray-700'
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
                                <div className={`text-center p-4 rounded-xl mt-4 transition-all duration-300 ${
                                    selectedOption === flashcard.correctOption 
                                        ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700' 
                                        : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700'
                                }`}>
                                    <p className="font-medium">
                                        {selectedOption === flashcard.correctOption 
                                            ? '✨ Great job! That\'s correct!' 
                                            : `The correct answer is: "${flashcard.correctOption}"`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                }
                return null;

            default:
                return (
                    <div className="flex flex-col items-center gap-4 p-6">
                        <p className="text-2xl sm:text-4xl font-semibold text-gray-800 text-center">
                            {content}
                        </p>
                        {side === 'front' && (
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        speakText(content);
                                    }}
                                    className={`p-3 rounded-full hover:bg-indigo-100 transition-all duration-300 
                                        ${speaking ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'}`}
                                    disabled={speaking}
                                >
                                    <IoVolumeHighOutline size={28} />
                                </button>
                                <span className="text-base sm:text-xl text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
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
                        <div className="relative inline-block">
                            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                                {lessons[0]?.title || 'Flashcard Set'}
                            </h1>
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full"></div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            <Link 
                                href={`/flashcards/exam/${slug}`}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 
                                    text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 
                                    font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <IoSchoolOutline size={20} />
                                Take Exam
                            </Link>

                            {isOwner && (
                                <>
                                    <Link 
                                        href={`/flashcards/edit/${slug}`}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 
                                            text-white rounded-full hover:from-amber-600 hover:to-yellow-700 transition-all duration-300 
                                            font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <IoPencilOutline size={20} />
                                        Edit Set
                                    </Link>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={isDeleting}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 
                                            text-white rounded-full hover:from-red-600 hover:to-rose-700 transition-all duration-300 
                                            font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                                    >
                                        <IoTrashOutline size={20} />
                                        {isDeleting ? 'Deleting...' : 'Delete Set'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Flashcard Content */}
                    {flashcards.length > 0 ? (
                        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-8">
                            <div className="flex items-center justify-center w-full gap-4">
                                {/* Arrow buttons - visible only on desktop */}
                                <button 
                                    onClick={prevCard}
                                    className="hidden sm:flex w-12 h-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm
                                        shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white transform hover:-translate-x-1"
                                >
                                    <IoChevronBackOutline size={24} className="text-gray-600" />
                                </button>

                                {/* Flashcard Container with swipe handlers */}
                                <div 
                                    {...handlers}
                                    className="w-full max-w-[320px] sm:max-w-2xl touch-pan-y"
                                >
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
                                </div>

                                {/* Arrow button - visible only on desktop */}
                                <button 
                                    onClick={nextCard}
                                    className="hidden sm:flex w-12 h-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm
                                        shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white transform hover:translate-x-1"
                                >
                                    <IoChevronForwardOutline size={24} className="text-gray-600" />
                                </button>
                            </div>

                            {/* Single Dot Navigation - mobile only */}
                            <div className="sm:hidden mt-6">
                                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                            </div>

                            {/* Swipe Hint - mobile only */}
                            <div className="text-gray-500 text-sm text-center mt-4 sm:hidden">
                                Swipe left or right to navigate
                            </div>

                            {/* Card Counter */}
                            <div className="mt-6 text-center">
                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100">
                                    <span className="text-sm text-gray-500">Card</span>
                                    <span className="text-lg font-semibold text-indigo-600 mx-2">{currentCard + 1}</span>
                                    <span className="text-sm text-gray-500">of {flashcards.length}</span>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-white/50 max-w-md mx-auto">
                            <p className="text-gray-600 mb-4">No flashcards available for this set.</p>
                            <Link 
                                href="/"
                                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                <IoHomeOutline size={18} />
                                Return Home
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Flashcard Set"
                message="Are you sure you want to delete this flashcard set? This action cannot be undone."
            />
        </>
    );
};

export default FlashcardPage;