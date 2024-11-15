'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

    console.log(lessons);

    if (lessons.length === 0) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const flashcards = lessons[0]?.flashcards || [];

    const nextCard = () => {
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    return(
        <div className='flex flex-col items-center pt-10 px-20 h-screen'>
            <h1 className='text-2xl font-bold'>Lesson {id}</h1>
            {flashcards.length > 0 ? (
                <div className='flex items-center justify-center w-full pt-40'>
                    <button 
                        onClick={prevCard}
                        className="mx-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Previous card"
                    >
                        <IoChevronBackOutline size={24} />
                    </button>

                    <div className="flip-card">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <p className="title">{flashcards[currentCard].front}</p>
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
                <div className="pt-40">No flashcards available for this lesson.</div>
            )}
        </div>
    )
};

export default FlashcardPage;