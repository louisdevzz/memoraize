'use client';
import { useState } from "react";
import { FaBold, FaMicrophone, FaImage, FaTrash, FaGripVertical } from 'react-icons/fa';
import { TbMathFunction, TbSubscript, TbOmega, TbSquaresDiagonal } from 'react-icons/tb';
import { BsArrowDownUp } from 'react-icons/bs';

interface MatchItem {
    id: number;
    keyword: string;
    definition: string;
}

const FindMatch = () => {
    const [title, setTitle] = useState("Untitled3");
    const [items, setItems] = useState<MatchItem[]>([
        {
            id: 1,
            keyword: "",
            definition: ""
        },
        {
            id: 2,
            keyword: "",
            definition: ""
        },
        {
            id: 3,
            keyword: "",
            definition: ""
        }
    ]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const addItem = () => {
        const newItem: MatchItem = {
            id: items.length + 1,
            keyword: "",
            definition: ""
        };
        setItems([...items, newItem]);
    };

    const removeItem = (itemId: number) => {
        const updatedItems = items
            .filter(item => item.id !== itemId)
            .map((item, index) => ({
                ...item,
                id: index + 1
            }));
        setItems(updatedItems);
    };

    const handleInputChange = (
        itemId: number, 
        field: 'keyword' | 'definition', 
        value: string
    ) => {
        setItems(items.map(item => 
            item.id === itemId 
                ? { ...item, [field]: value }
                : item
        ));
    };

    const swapColumns = () => {
        setItems(items.map(item => ({
            ...item,
            keyword: item.definition,
            definition: item.keyword
        })));
    };

    const moveItem = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= items.length) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        setItems(newItems);
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
            moveItem(draggedIndex, dragOverIndex);
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
                        <TbSquaresDiagonal className="w-full h-full" />
                    </div>
                    <span className="font-medium">Find the match</span>
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

            <div className="mb-4 flex justify-center items-center">
                <button
                    onClick={swapColumns}
                    className="px-4 py-2 border rounded hover:bg-gray-50 flex items-center space-x-2"
                >
                    <BsArrowDownUp className="w-4 h-4" />
                    <span>Swap Columns</span>
                </button>
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={item.id}
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
                                        value={item.keyword}
                                        onChange={(e) => handleInputChange(item.id, 'keyword', e.target.value)}
                                        placeholder="Enter keyword"
                                        className="flex-1 p-2 border rounded-md"
                                    />
                                    <button className="p-2 hover:bg-gray-200 rounded flex items-center justify-center">
                                        <FaMicrophone className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded flex items-center justify-center">
                                        <FaImage className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={item.definition}
                                        onChange={(e) => handleInputChange(item.id, 'definition', e.target.value)}
                                        placeholder="Enter definition"
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
                                    onClick={() => removeItem(item.id)}
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
                <span>min 3</span>
                <span className="mx-2">•</span>
                <span>max 20</span>
            </div>

            <button
                onClick={addItem}
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

export default FindMatch; 