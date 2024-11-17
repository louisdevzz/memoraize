'use client';
import { useState } from "react";
import { FaBold, FaImage, FaTrash, FaGripVertical } from 'react-icons/fa';
import { TbMathFunction, TbSubscript, TbOmega, TbCards } from 'react-icons/tb';
import { BsArrowDownUp } from 'react-icons/bs';

interface FlashCard {
    id: number;
    front: string;
    back: string;
}

type CardMode = 'double' | 'single';

const FlashCards = () => {
    const [title, setTitle] = useState("Untitled3");
    const [cardMode, setCardMode] = useState<CardMode>('double');
    const [cards, setCards] = useState<FlashCard[]>([
        {
            id: 1,
            front: "",
            back: ""
        }
    ]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const addCard = () => {
        const newCard: FlashCard = {
            id: cards.length + 1,
            front: "",
            back: ""
        };
        setCards([...cards, newCard]);
    };

    const removeCard = (cardId: number) => {
        const updatedCards = cards
            .filter(card => card.id !== cardId)
            .map((card, index) => ({
                ...card,
                id: index + 1
            }));
        setCards(updatedCards);
    };

    const handleInputChange = (
        cardId: number, 
        field: 'front' | 'back', 
        value: string
    ) => {
        setCards(cards.map(card => 
            card.id === cardId 
                ? { ...card, [field]: value }
                : card
        ));
    };

    const swapColumns = () => {
        setCards(cards.map(card => ({
            ...card,
            front: card.back,
            back: card.front
        })));
    };

    const moveCard = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= cards.length) return;

        const newCards = [...cards];
        const [movedCard] = newCards.splice(fromIndex, 1);
        newCards.splice(toIndex, 0, movedCard);
        setCards(newCards);
    };

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null) {
            moveCard(draggedIndex, dragOverIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center mb-8 text-gray-600">
                <span>Pick a template</span>
                <span className="mx-2">›</span>
                <span className="font-medium">Enter content</span>
                <span className="mx-2">›</span>
                <span>Play</span>
                <div className="ml-auto flex items-center space-x-2">
                    <div className="w-6 h-6 text-blue-600">
                        <TbCards className="w-full h-full" />
                    </div>
                    <span className="font-medium">Flash cards</span>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>

            <div className="mb-6 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        checked={cardMode === 'double'}
                        onChange={() => setCardMode('double')}
                        className="form-radio"
                    />
                    <span>Double sided</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        checked={cardMode === 'single'}
                        onChange={() => setCardMode('single')}
                        className="form-radio"
                    />
                    <span>Single sided</span>
                </label>
            </div>

            <div className="mb-4 flex justify-centera items-center">
                <button
                    onClick={swapColumns}
                    className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center space-x-2"
                >
                    <BsArrowDownUp className="w-4 h-4" />
                    <span>Swap Columns</span>
                </button>
            </div>

            <div className="space-y-4">
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`mb-4 flex items-center space-x-4 ${
                            dragOverIndex === index ? 'border-t-2 border-blue-500' : ''
                        } ${draggedIndex === index ? 'opacity-50' : ''}`}
                    >
                        <span className="mr-2">{index + 1}.</span>
                        <div className="flex-1 flex items-center space-x-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={card.front}
                                        onChange={(e) => handleInputChange(card.id, 'front', e.target.value)}
                                        placeholder="Front"
                                        className="flex-1 p-2 border rounded-md"
                                    />
                                    <button className="p-2 hover:bg-gray-200 rounded flex items-center justify-center">
                                        <FaImage className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={card.back}
                                        onChange={(e) => handleInputChange(card.id, 'back', e.target.value)}
                                        placeholder="Back"
                                        className="flex-1 p-2 border rounded-md"
                                    />
                                    <button className="p-2 hover:bg-gray-200 rounded flex items-center justify-center">
                                        <FaImage className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div 
                                    className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded flex items-center justify-center"
                                >
                                    <FaGripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                                <button 
                                    onClick={() => removeCard(card.id)}
                                    className="p-2 hover:bg-gray-200 rounded flex items-center justify-center text-red-500"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>min 1</span>
                <span className="mx-2">•</span>
                <span>max 100</span>
            </div>

            <button
                onClick={addCard}
                className="w-full py-2 text-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 mb-6"
            >
                + Add an item
            </button>

            <div className="flex justify-end">
                <button className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Done
                </button>
            </div>
        </div>
    );
};

export default FlashCards; 