'use client';
import { useState } from "react";
import { FaBold, FaMicrophone, FaImage, FaQuestion, FaTrash } from 'react-icons/fa';
import { TbMathFunction, TbSubscript, TbOmega } from 'react-icons/tb';

interface QuizQuestion {
    id: number;
    question: string;
    answers: {
        id: string;
        text: string;
    }[];
}

const Quiz = () => {
    const [title, setTitle] = useState("Untitled2");
    const [questions, setQuestions] = useState<QuizQuestion[]>([
        {
            id: 1,
            question: "",
            answers: [
                { id: "a", text: "" },
                { id: "b", text: "" }
            ]
        }
    ]);

    const addQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: questions.length + 1,
            question: "",
            answers: [
                { id: "a", text: "" },
                { id: "b", text: "" }
            ]
        };
        setQuestions([...questions, newQuestion]);
    };

    const addAnswer = (questionId: number) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const nextId = String.fromCharCode(97 + q.answers.length); // a, b, c, etc.
                return {
                    ...q,
                    answers: [...q.answers, { id: nextId, text: "" }]
                };
            }
            return q;
        }));
    };

    const removeAnswer = (questionId: number, answerId: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.answers.length > 2) {
                const filteredAnswers = q.answers.filter(a => a.id !== answerId);
                const updatedAnswers = filteredAnswers.map((answer, index) => ({
                    ...answer,
                    id: String.fromCharCode(97 + index)
                }));
                return {
                    ...q,
                    answers: updatedAnswers
                };
            }
            return q;
        }));
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
                        <FaQuestion className="w-full h-full" />
                    </div>
                    <span className="font-medium">Quiz</span>
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

            {questions.map((question, index) => (
                <div key={question.id} className="mb-8 bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <span className="mr-4">{index + 1}.</span>
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Enter your question text"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="ml-4 flex space-x-2">
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
                        {question.answers.map((answer) => (
                            <div key={answer.id} className="flex items-center">
                                <span className="mr-4">{answer.id}</span>
                                <input
                                    type="text"
                                    placeholder="Add answer"
                                    className="flex-1 p-2 border rounded-md"
                                />
                                <button className="ml-2 p-2 hover:bg-gray-200 rounded">
                                    <FaMicrophone className="w-4 h-4" />
                                </button>
                                <button className="ml-2 p-2 hover:bg-gray-200 rounded">
                                    <FaImage className="w-4 h-4" />
                                </button>
                                {question.answers.length > 2 && (
                                    <button 
                                        onClick={() => removeAnswer(question.id, answer.id)}
                                        className="ml-2 p-2 hover:bg-gray-200 rounded text-red-500"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={() => addAnswer(question.id)}
                            className="w-full py-2 text-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400"
                        >
                            + Add more answers
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>min 1</span>
                <span className="mx-2">•</span>
                <span>max 100</span>
            </div>

            <button
                onClick={addQuestion}
                className="w-full py-2 text-center border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 mb-6"
            >
                + Add a question
            </button>

            <div className="flex justify-end">
                <button className="px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Done
                </button>
            </div>
        </div>
    );
};

export default Quiz; 