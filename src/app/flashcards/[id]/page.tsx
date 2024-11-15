'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoHomeOutline, IoPencilOutline, IoSchoolOutline, IoTrashOutline } from "react-icons/io5";
import { useCallback, useEffect } from 'react';
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

    //console.log(lessons);

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
        <div className='flex flex-col items-center pt-10 px-4 md:px-20 h-screen'>
            <h1 className='text-2xl font-bold'>Lesson {id}</h1>
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
                <div className='flex items-center justify-center w-full pt-20 md:pt-40'>
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
                <div className="pt-20 md:pt-40">No flashcards available for this lesson.</div>
            )}
        </div>
    )
};

export default FlashcardPage;