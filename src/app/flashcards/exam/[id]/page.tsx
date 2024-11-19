'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState, FormEvent } from 'react';
import { useEffect } from 'react';
import { IoArrowBack, IoVolumeHighOutline } from "react-icons/io5";
import Image from 'next/image';
import { Flashcard } from '@/models/Lesson';
import Header from '@/components/Header';

interface Lesson {
    slug: string;
    flashcards: Flashcard[];
    title: string;
}

const ExamPage = () => {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState<boolean | null>(null);
    const [remainingCards, setRemainingCards] = useState<Flashcard[]>([]);
    const [examStats, setExamStats] = useState({
        correctAnswers: 0,
        incorrectAnswers: 0,
        incorrectCards: [] as Array<{
            front: string;
            back: string;
            userAnswer: string;
        }>,
    });
    const [speaking, setSpeaking] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const fetchLessons = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`/api/flashcards/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch lesson');
            }
        
            const data = await response.json();
            setLessons([data]);
        } catch (error) {
            console.error('Error fetching lesson:', error);
        }
    }, [router, id]);
    
    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    useEffect(() => {
        if (lessons.length > 0 && lessons[0].flashcards.length > 0) {
            // Initialize remaining cards with shuffled flashcards
            const shuffled = [...lessons[0].flashcards].sort(() => Math.random() - 0.5);
            setRemainingCards(shuffled);
            setCurrentCard(shuffled[0]);
        }
    }, [lessons]);

    const speakText = useCallback((text: string) => {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speech.rate = 0.9;
        
        speech.onstart = () => setSpeaking(true);
        speech.onend = () => setSpeaking(false);
        speech.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(speech);
    }, []);

    const renderQuestion = () => {
        if (!currentCard) return null;

        switch (currentCard.type) {
            case 'image':
                return (
                    <div className="space-y-4">
                        <div className="relative w-full aspect-video">
                            <Image
                                src={currentCard.imageUrl}
                                alt="Question image"
                                fill
                                className="object-contain rounded-lg"
                                onLoadingComplete={() => setImageLoading(false)}
                            />
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                                    <div className="loader"></div>
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">{currentCard.front}</h2>
                    </div>
                );

            case 'multipleChoice':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6">{currentCard.front}</h2>
                        <div className="grid gap-3">
                            {currentCard.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setUserAnswer(option);
                                        handleSubmit(new Event('submit') as any);
                                    }}
                                    disabled={result !== null}
                                    className={`p-4 rounded-xl text-left transition-all text-base sm:text-lg font-medium hover:bg-blue-50 
                                        ${result !== null 
                                            ? option === currentCard.back 
                                                ? 'bg-green-100 border-2 border-green-500'
                                                : option === userAnswer
                                                    ? 'bg-red-100 border-2 border-red-500'
                                                    : 'bg-gray-50'
                                            : 'bg-white border-2 border-gray-200'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">{currentCard.front}</h2>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => speakText(currentCard.front)}
                                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${speaking ? 'text-blue-500' : ''}`}
                                disabled={speaking}
                            >
                                <IoVolumeHighOutline size={24} />
                            </button>
                        </div>
                    </div>
                );
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!currentCard) return;

        let isCorrect = false;
        switch (currentCard.type) {
            case 'multipleChoice':
                isCorrect = userAnswer === currentCard.back;
                break;
            default:
                isCorrect = currentCard.back.toLowerCase().trim().split(',').some(answer => 
                    answer.trim() === userAnswer.toLowerCase().trim()
                );
        }

        setResult(isCorrect);

        // Update stats
        if (isCorrect) {
            setExamStats(prev => ({
                ...prev,
                correctAnswers: prev.correctAnswers + 1
            }));
        } else {
            setExamStats(prev => ({
                ...prev,
                incorrectAnswers: prev.incorrectAnswers + 1,
                incorrectCards: [...prev.incorrectCards, {
                    front: currentCard.front,
                    back: currentCard.back,
                    userAnswer: userAnswer
                }]
            }));
        }

        // Move to next card after 1.5 seconds
        setTimeout(() => {
            setUserAnswer('');
            setResult(null);
            
            const newRemaining = remainingCards.slice(1);
            setRemainingCards(newRemaining);
            setCurrentCard(newRemaining[0] || null);
        }, 1500);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 pt-16">
                <div className="container mx-auto px-4 py-4 sm:py-8 relative">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating animation-delay-4000"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 floating animation-delay-3000"></div>

                    {/* Title Section */}
                    <div className="text-center mb-8 relative">
                        {/* Small decorative circles */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 sm:w-20 sm:h-20 bg-yellow-200 rounded-full opacity-50 floating"></div>
                        <div className="absolute top-0 right-0 w-10 h-10 sm:w-16 sm:h-16 bg-pink-200 rounded-full opacity-50 floating animation-delay-1000"></div>
                        
                        <div className="relative inline-block">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                                Exam Mode
                            </h1>
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full"></div>
                        </div>
                    </div>

                    {currentCard ? (
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-full max-w-xl">
                                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-white/50 relative">
                                    {/* Card decorative circles */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-200 rounded-full opacity-30 floating"></div>
                                    <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-200 rounded-full opacity-30 floating animation-delay-500"></div>
                                    
                                    {renderQuestion()}
                                    
                                    {currentCard.type !== 'multipleChoice' && (
                                        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                                            <input
                                                type="text"
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                className="w-full p-4 text-base sm:text-lg border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 transition bg-white/50"
                                                placeholder="Your answer..."
                                                disabled={result !== null}
                                            />
                                            <button 
                                                type="submit"
                                                className="w-full bg-indigo-600 text-white p-4 rounded-xl 
                                                    hover:bg-indigo-700 transition-all duration-300 font-medium 
                                                    shadow-lg hover:shadow-xl disabled:opacity-50 text-base"
                                                disabled={result !== null}
                                            >
                                                Submit Answer
                                            </button>
                                        </form>
                                    )}

                                    {result !== null && (
                                        <div className={`mt-6 p-4 rounded-xl text-center transition-all duration-300 text-base ${
                                            result 
                                                ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700' 
                                                : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700'
                                        }`}>
                                            <p className="font-medium">
                                                {result 
                                                    ? '✨ Excellent! That\'s correct!' 
                                                    : `Not quite. The correct answer is: "${currentCard.back}"`
                                                }
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 text-center">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-100">
                                            <span className="text-sm text-gray-500">Remaining</span>
                                            <span className="text-lg font-semibold text-indigo-600 mx-2">{remainingCards.length}</span>
                                            <span className="text-sm text-gray-500">cards</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => router.push(`/flashcards/${id}`)}
                                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm 
                                            text-indigo-600 hover:text-white transition-all duration-300 rounded-full
                                            overflow-hidden hover:shadow-lg"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-50 
                                            group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300">
                                        </span>
                                        <IoArrowBack className="h-5 w-5 relative z-10 transform group-hover:-translate-x-1 transition-transform duration-300" />
                                        <span className="relative z-10">Back to Flashcards</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            {remainingCards.length === 0 && lessons.length > 0 ? (
                                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/50 relative">
                                    {/* Results decorative circles */}
                                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-200 rounded-full opacity-40 floating"></div>
                                    <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-pink-200 rounded-full opacity-40 floating animation-delay-1500"></div>
                                    
                                    <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                                        Exam Results
                                    </h2>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/80 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-bold text-green-600">
                                                {examStats.correctAnswers}
                                            </div>
                                            <div className="text-sm text-gray-600">Correct</div>
                                        </div>
                                        <div className="bg-white/80 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-bold text-red-600">
                                                {examStats.incorrectAnswers}
                                            </div>
                                            <div className="text-sm text-gray-600">Incorrect</div>
                                        </div>
                                        <div className="bg-white/80 rounded-xl p-4 text-center col-span-2">
                                            <div className="text-3xl font-bold text-indigo-600">
                                                {Math.round((examStats.correctAnswers / (examStats.correctAnswers + examStats.incorrectAnswers)) * 100)}%
                                            </div>
                                            <div className="text-sm text-gray-600">Success Rate</div>
                                        </div>
                                    </div>

                                    {examStats.incorrectCards.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-xl font-semibold mb-4">Review Incorrect Answers</h3>
                                            <div className="space-y-4">
                                                {examStats.incorrectCards.map((card, index) => (
                                                    <div key={index} className="bg-white/80 p-4 rounded-xl border border-red-100">
                                                        <p className="font-medium text-gray-800">{card.front}</p>
                                                        <div className="mt-2 text-sm space-y-1">
                                                            <p className="text-red-600">Your answer: {card.userAnswer}</p>
                                                            <p className="text-green-600">Correct answer: {card.back}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={() => router.push(`/flashcards/${id}`)}
                                            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 
                                                text-indigo-600 hover:text-white font-medium transition-all duration-300 
                                                rounded-full overflow-hidden hover:shadow-lg w-full sm:w-auto"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-50 
                                                group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300">
                                            </span>
                                            <IoArrowBack className="h-5 w-5 relative z-10 transform group-hover:-translate-x-1 transition-transform duration-300" />
                                            <span className="relative z-10">Back to Flashcards</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="loader"></div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExamPage;
