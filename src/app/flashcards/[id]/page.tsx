'use client';

import { useParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoHomeOutline, IoPencilOutline, IoSchoolOutline, IoTrashOutline, IoVolumeHighOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import Link from 'next/dist/client/link';

interface Lesson {
    slug: string;
    flashcards: Array<{ front: string; back: string; }>;
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

    const fetchLessons = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            setIsLoading(true);
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
        } catch (error) {
            console.error('Error fetching lessons:', error);
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

    if(isLoading){
        return <div className="min-h-screen flex justify-center items-center">
            <div className='loader'></div>
        </div>;
    }

    if (lessons.length === 0) {
        return <div className="min-h-screen flex justify-center items-center">
            No lessons found
        </div>;
    }

    const nextCard = () => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
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
                <Link href={`/flashcards/edit/${id}`} className='w-full md:w-auto'>
                    <button className='w-full bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2'>
                        <IoPencilOutline />
                        Edit lesson
                    </button>
                </Link>
                <button className='w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2'>
                    <IoTrashOutline />
                    Delete lesson
                </button>
                <Link href={`/`} className='w-full md:w-auto'>
                    <button className='w-full bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2'>
                        <IoHomeOutline />
                        Home
                    </button>
                </Link>
            </div>
            {flashcards.length > 0 ? (
                <div className='flex items-center justify-center w-full pt-10 md:pt-32'>
                    <button 
                        onClick={prevCard}
                        className="mx-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Previous card"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>

                    <div 
                        className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <p className="title">{flashcards[currentCard].front}</p>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            speakText(flashcards[currentCard].front);
                                        }}
                                        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${speaking ? 'text-blue-500' : ''}`}
                                        disabled={speaking}
                                        aria-label="Listen to pronunciation"
                                    >
                                        <IoVolumeHighOutline size={24} />
                                    </button>
                                    <span className="text-gray-500">
                                        {phonetic || flashcards[currentCard].front}
                                    </span>
                                </div>
                            </div>
                            <div className="flip-card-back">
                                <p className="title">{flashcards[currentCard].back}</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={nextCard}
                        className="mx-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Next card"
                    >
                        <IoChevronForwardOutline size={24} />
                    </button>
                </div>
            ) : (
                <div className="pt-20 md:pt-40">No flashcards available for this lesson.</div>
            )}
        </div>
    )
};

export default FlashcardPage;