'use client';
import { useState } from "react";
import { FaBold, FaArrowsAltH, FaGripVertical, FaTrash } from 'react-icons/fa';
import { TbMathFunction, TbSubscript, TbOmega, TbLetterCase } from 'react-icons/tb';
import { BsArrowDownUp } from 'react-icons/bs';

interface AnagramWord {
    id: number;
    word: string;
}

type ClueMode = 'without' | 'with';

const Anagram = () => {
    const [title, setTitle] = useState("Untitled2");
    const [clueMode, setClueMode] = useState<ClueMode>('without');
    const [words, setWords] = useState<AnagramWord[]>([
        {
            id: 1,
            word: "",
        }
    ]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const addWord = () => {
        const newWord: AnagramWord = {
            id: words.length + 1,
            word: "",
        };
        setWords([...words, newWord]);
    };

    const removeWord = (wordId: number) => {
        if (words.length > 1) {
            setWords(words.filter(word => word.id !== wordId));
        }
    };

    const handleInputChange = (wordId: number, value: string) => {
        setWords(words.map(word => 
            word.id === wordId 
                ? { ...word, word: value }
                : word
        ));
    };

    const moveWord = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= words.length) return;

        const newWords = [...words];
        const [movedWord] = newWords.splice(fromIndex, 1);
        newWords.splice(toIndex, 0, movedWord);
        setWords(newWords);
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
            moveWord(draggedIndex, dragOverIndex);
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
                        <TbLetterCase className="w-full h-full" />
                    </div>
                    <span className="font-medium">Anagram</span>
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
                        checked={clueMode === 'without'}
                        onChange={() => setClueMode('without')}
                        className="form-radio"
                    />
                    <span>Without clues</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="radio"
                        checked={clueMode === 'with'}
                        onChange={() => setClueMode('with')}
                        className="form-radio"
                    />
                    <span>With clues</span>
                </label>
            </div>

            <div className="mb-4 flex items-center space-x-2">
                <span className="font-medium">Word</span>
                <div className="flex space-x-1">
                    <button className="p-2 hover:bg-gray-200 rounded">
                        <FaBold className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded">
                        <TbMathFunction className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded">
                        <TbSubscript className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded">
                        <TbOmega className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {words.map((word, index) => (
                    <div
                        key={word.id}
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
                                <input
                                    type="text"
                                    value={word.word}
                                    onChange={(e) => handleInputChange(word.id, e.target.value)}
                                    placeholder="Enter word"
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <div 
                                    className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded flex items-center justify-center"
                                >
                                    <FaGripVertical className="w-4 h-4 text-gray-400" />
                                </div>
                                <button className="p-2 hover:bg-gray-200 rounded flex items-center justify-center">
                                    <FaArrowsAltH className="w-4 h-4" />
                                </button>
                                {words.length > 1 && (
                                    <button
                                        onClick={() => removeWord(word.id)}
                                        className="p-2 hover:bg-gray-200 rounded text-red-500 flex items-center justify-center"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                )}
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
                onClick={addWord}
                className="w-full py-2 text-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 mb-6"
            >
                + Add a new word
            </button>

            <div className="flex justify-end">
                <button className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Done
                </button>
            </div>
        </div>
    );
};

export default Anagram; 