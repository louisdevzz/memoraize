'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState, FormEvent } from 'react';
import { useEffect } from 'react';

interface Lesson {
    slug: string;
    flashcards: Array<{ front: string; back: string; }>;
}

const ExamPage = () => {
    const params = useParams();
    const id = params.id;
    const router = useRouter();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentCard, setCurrentCard] = useState<{front: string; back: string} | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState<boolean | null>(null);
    const [remainingCards, setRemainingCards] = useState<Array<{front: string; back: string}>>([]);
    const [examStats, setExamStats] = useState({
        correctAnswers: 0,
        incorrectAnswers: 0,
        incorrectCards: [] as Array<{
            front: string;
            back: string;
            userAnswer: string;
        }>,
    });

    const fetchLessons = useCallback(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            router.push('/login');
            return;
        }
        const response = await fetch('/api/flashcards/byUser', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    
        const data = await response.json();
        const filteredLessons = data.filter((lesson: any) => lesson.slug === id);
        setLessons(filteredLessons);
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        if (!currentCard) return;

        const isCorrect = currentCard.back.toLowerCase().trim().split(',').some(answer => 
            answer.trim() === userAnswer.toLowerCase().trim()
        );
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
        <div className='flex flex-col justify-center items-center w-full mx-auto p-4 pt-10'>
            <h1 className='text-4xl font-bold mb-6'>Exam lesson {id}</h1>
            
            {currentCard ? (
                <div className='w-full max-w-md'>
                    <div className='bg-white rounded-lg shadow-md p-6 mb-4'>
                        <h2 className='text-xl font-semibold mb-4'>{currentCard.front}</h2>
                        
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                className='w-full p-2 border rounded'
                                placeholder='Your answer...'
                                disabled={result !== null}
                            />
                            <button 
                                type="submit"
                                className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                                disabled={result !== null}
                            >
                                Submit
                            </button>
                        </form>

                        {result !== null && (
                            <div className={`mt-4 p-2 rounded text-center ${result ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {result ? 'Correct!' : `Incorrect. The correct answer was: ${currentCard.back}`}
                            </div>
                        )}

                        <div className='mt-4 text-sm text-gray-500'>
                            Remaining cards: {remainingCards.length}
                        </div>
                    </div>
                </div>
            ) : (
                <div className='w-full max-w-md'>
                    {remainingCards.length === 0 && lessons.length > 0 ? (
                        <div className='bg-white rounded-lg shadow-md p-6'>
                            <h2 className='text-2xl font-bold mb-4'>Exam Results</h2>
                            
                            <div className='space-y-4'>
                                <div className='flex justify-between items-center'>
                                    <span>Total Cards:</span>
                                    <span className='font-semibold'>
                                        {examStats.correctAnswers + examStats.incorrectAnswers}
                                    </span>
                                </div>
                                
                                <div className='flex justify-between items-center text-green-600'>
                                    <span>Correct Answers:</span>
                                    <span className='font-semibold'>{examStats.correctAnswers}</span>
                                </div>
                                
                                <div className='flex justify-between items-center text-red-600'>
                                    <span>Incorrect Answers:</span>
                                    <span className='font-semibold'>{examStats.incorrectAnswers}</span>
                                </div>
                                
                                <div className='flex justify-between items-center'>
                                    <span>Success Rate:</span>
                                    <span className='font-semibold'>
                                        {Math.round((examStats.correctAnswers / (examStats.correctAnswers + examStats.incorrectAnswers)) * 100)}%
                                    </span>
                                </div>
                            </div>

                            {examStats.incorrectCards.length > 0 && (
                                <div className='mt-6'>
                                    <h3 className='text-xl font-semibold mb-3'>Incorrect Answers Review:</h3>
                                    <div className='space-y-3'>
                                        {examStats.incorrectCards.map((card, index) => (
                                            <div key={index} className='bg-red-50 p-3 rounded'>
                                                <p className='font-medium'>{card.front}</p>
                                                <p className='text-sm text-gray-600'>Your answer: {card.userAnswer}</p>
                                                <p className='text-sm text-green-600'>Correct answer: {card.back}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => router.push(`/flashcards/${id}`)}
                                className='w-full mt-6 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
                            >
                                Back to Flashcards
                            </button>
                        </div>
                    ) : (
                        <div className='loader'></div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExamPage;
