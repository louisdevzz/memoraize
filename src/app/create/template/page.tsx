'use client';
import Link from 'next/link';
import { FaQuestion, FaRandom, FaGamepad, FaSortAlphaDown, FaThLarge, FaSync, FaObjectGroup, FaDharmachakra, FaEdit, FaPuzzlePiece, FaTrophy, FaSearch, FaColumns, FaMapPin, FaCrosshairs, FaBalanceScale, FaBomb, FaSpellCheck, FaHammer, FaBirthdayCake, FaCheckCircle, FaEye, FaSortNumericDown, FaMagnet, FaImage, FaCalculator, FaPlane } from 'react-icons/fa';
import { MdCompareArrows, MdSwapHoriz, MdOpenInNew } from 'react-icons/md';
import { BiCard } from 'react-icons/bi';
import { IoMdGrid } from 'react-icons/io';
import { GiMaze } from 'react-icons/gi';
import { BsBalloon } from 'react-icons/bs';
import { useState } from 'react';
import Header from '@/components/Header';

interface TemplateOption {
  id: string;
  title: string;
  description: string;
  icon: 'quiz' | 'match-up' | 'anagram' | 'flash-cards' | 'speaking-cards' | 'find-match' | 
        'unjumble' | 'open-box' | 'group-sort' | 'spin-wheel' | 'complete-sentence' | 
        'matching-pairs' | 'gameshow-quiz' | 'wordsearch' | 'flip-tiles' | 'labelled-diagram' | 
        'crossword' | 'win-lose-quiz' | 'flying-fruit' | 'image-quiz' | 'hangman' | 'spell-word' | 
        'whack-a-mole' | 'maze-chase' | 'balloon-pop' | 'true-false' | 'watch-memorize' | 
        'airplane' | 'rank-order' | 'word-magnets' | 'maths-generator';
  category: 'Multiple choice' | 'Sorting' | 'Randomizers' | 'Word games' | 'Action games';
}

const templates: TemplateOption[] = [
  {
    id: 'quiz',
    title: 'Quiz',
    description: 'A series of multiple choice questions. Tap the correct answer to proceed.',
    icon: 'quiz',
    category: 'Multiple choice',
  },
  {
    id: 'match-up',
    title: 'Match up',
    description: 'Drag and drop each keyword next to its definition.',
    icon: 'match-up',
    category: 'Sorting',
  },
  {
    id: 'anagram',
    title: 'Anagram',
    description: 'Drag the letters into their correct positions to unscramble the word or phrase.',
    icon: 'anagram',
    category: 'Word games',
  },
  {
    id: 'flash-cards',
    title: 'Flash cards',
    description: 'Test yourself using cards with prompts on the front and answers on the back.',
    icon: 'flash-cards',
    category: 'Multiple choice',
  },
  {
    id: 'speaking-cards',
    title: 'Speaking cards',
    description: 'Deal out cards at random from a shuffled deck.',
    icon: 'speaking-cards',
    category: 'Randomizers',
  },
  {
    id: 'find-match',
    title: 'Find the match',
    description: 'Tap the matching answer to eliminate it. Repeat until all answers are gone.',
    icon: 'find-match',
    category: 'Multiple choice',
  },
  {
    id: 'unjumble',
    title: 'Unjumble',
    description: 'Drag and drop words to rearrange each sentence into its correct order.',
    icon: 'unjumble',
    category: 'Word games',
  },
  {
    id: 'open-box',
    title: 'Open the box',
    description: 'Tap each box in turn to open them up and reveal the item inside.',
    icon: 'open-box',
    category: 'Action games',
  },
  {
    id: 'group-sort',
    title: 'Group sort',
    description: 'Drag and drop each item into its correct group.',
    icon: 'group-sort',
    category: 'Sorting',
  },
  {
    id: 'spin-wheel',
    title: 'Spin the wheel',
    description: 'Spin the wheel to see which item comes up next.',
    icon: 'spin-wheel',
    category: 'Randomizers',
  },
  {
    id: 'complete-sentence',
    title: 'Complete the sentence',
    description: 'A cloze activity where you drag and drop words into blank spaces within a text.',
    icon: 'complete-sentence',
    category: 'Word games',
  },
  {
    id: 'matching-pairs',
    title: 'Matching pairs',
    description: 'Tap a pair of tiles at a time to reveal if they are a match.',
    icon: 'matching-pairs',
    category: 'Multiple choice',
  },
  {
    id: 'gameshow-quiz',
    title: 'Gameshow quiz',
    description: 'A multiple choice quiz with time pressure, lifelines and a bonus round.',
    icon: 'gameshow-quiz',
    category: 'Multiple choice',
  },
  {
    id: 'wordsearch',
    title: 'Wordsearch',
    description: 'Words are hidden in a letter grid. Find them as fast as you can.',
    icon: 'wordsearch',
    category: 'Word games',
  },
  {
    id: 'flip-tiles',
    title: 'Flip tiles',
    description: 'Explore a series of two sided tiles by tapping to zoom and swiping to flip.',
    icon: 'flip-tiles',
    category: 'Action games',
  },
  {
    id: 'labelled-diagram',
    title: 'Labelled diagram',
    description: 'Drag and drop the pins to their correct place on the image.',
    icon: 'labelled-diagram',
    category: 'Sorting',
  },
  {
    id: 'crossword',
    title: 'Crossword',
    description: 'Use the clues to solve the crossword. Tap on a word and type in the answer.',
    icon: 'crossword',
    category: 'Word games',
  },
  {
    id: 'win-lose-quiz',
    title: 'Win or lose quiz',
    description: 'A quiz where you choose how many points each question is worth.',
    icon: 'win-lose-quiz',
    category: 'Multiple choice',
  },
  {
    id: 'flying-fruit',
    title: 'Flying fruit',
    description: 'Answers move across the screen. Tap the correct answer when you see it.',
    icon: 'flying-fruit',
    category: 'Action games',
  },
  {
    id: 'image-quiz',
    title: 'Image quiz',
    description: 'An image is revealed slowly. Buzz in when you can answer the question.',
    icon: 'image-quiz',
    category: 'Multiple choice',
  },
  {
    id: 'hangman',
    title: 'Hangman',
    description: 'Try to complete the word by picking the correct letters.',
    icon: 'hangman',
    category: 'Word games',
  },
  {
    id: 'spell-word',
    title: 'Spell the word',
    description: 'Drag or type the letters to their correct positions to spell the answer.',
    icon: 'spell-word',
    category: 'Word games',
  },
  {
    id: 'whack-a-mole',
    title: 'Whack-a-mole',
    description: 'Moles appear one at a time, hit only the correct ones to win.',
    icon: 'whack-a-mole',
    category: 'Action games',
  },
  {
    id: 'maze-chase',
    title: 'Maze chase',
    description: 'Run to the correct answer zone, whilst avoiding the enemies.',
    icon: 'maze-chase',
    category: 'Action games',
  },
  {
    id: 'balloon-pop',
    title: 'Balloon pop',
    description: 'Pop the balloons to drop each keyword onto its matching definition.',
    icon: 'balloon-pop',
    category: 'Action games',
  },
  {
    id: 'true-false',
    title: 'True or false',
    description: 'Items fly by at speed. See how many you can get right before the time runs out.',
    icon: 'true-false',
    category: 'Multiple choice',
  },
  {
    id: 'watch-memorize',
    title: 'Watch and memorize',
    description: 'Watch carefully and remember the items. At the end, tap the ones you saw.',
    icon: 'watch-memorize',
    category: 'Action games',
  },
  {
    id: 'airplane',
    title: 'Airplane',
    description: 'Use touch or keyboard to fly into the correct answers and avoid the wrong ones.',
    icon: 'airplane',
    category: 'Action games',
  },
  {
    id: 'rank-order',
    title: 'Rank order',
    description: 'Drag and drop the items into their correct order.',
    icon: 'rank-order',
    category: 'Sorting',
  },
  {
    id: 'word-magnets',
    title: 'Word magnets',
    description: 'Drag and drop the words or letters to arrange into sentences.',
    icon: 'word-magnets',
    category: 'Word games',
  },
  {
    id: 'maths-generator',
    title: 'Maths generator',
    description: 'Select a topic and the generator will create a batch of maths questions.',
    icon: 'maths-generator',
    category: 'Multiple choice',
  },
];

const CreateTemplatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All templates');

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory === 'All templates') return true;
    return template.category === selectedCategory;
  });

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'quiz':
        return <FaQuestion className="w-12 h-12" />;
      case 'match-up':
        return <MdCompareArrows className="w-12 h-12" />;
      case 'anagram':
        return <FaSortAlphaDown className="w-12 h-12" />;
      case 'flash-cards':
        return <BiCard className="w-12 h-12" />;
      case 'speaking-cards':
        return <FaRandom className="w-12 h-12" />;
      case 'find-match':
        return <FaPuzzlePiece className="w-12 h-12" />;
      case 'unjumble':
        return <MdSwapHoriz className="w-12 h-12" />;
      case 'open-box':
        return <MdOpenInNew className="w-12 h-12" />;
      case 'group-sort':
        return <FaObjectGroup className="w-12 h-12" />;
      case 'spin-wheel':
        return <FaDharmachakra className="w-12 h-12" />;
      case 'complete-sentence':
        return <FaEdit className="w-12 h-12" />;
      case 'matching-pairs':
        return <FaThLarge className="w-12 h-12" />;
      case 'gameshow-quiz':
        return <FaTrophy className="w-12 h-12" />;
      case 'wordsearch':
        return <FaSearch className="w-12 h-12" />;
      case 'flip-tiles':
        return <IoMdGrid className="w-12 h-12" />;
      case 'labelled-diagram':
        return <FaMapPin className="w-12 h-12" />;
      case 'crossword':
        return <FaColumns className="w-12 h-12" />;
      case 'win-lose-quiz':
        return <FaBalanceScale className="w-12 h-12" />;
      case 'flying-fruit':
        return <FaBomb className="w-12 h-12" />;
      case 'image-quiz':
        return <FaImage className="w-12 h-12" />;
      case 'hangman':
        return <FaGamepad className="w-12 h-12" />;
      case 'spell-word':
        return <FaSpellCheck className="w-12 h-12" />;
      case 'whack-a-mole':
        return <FaHammer className="w-12 h-12" />;
      case 'maze-chase':
        return <GiMaze className="w-12 h-12" />;
      case 'balloon-pop':
        return <BsBalloon className="w-12 h-12" />;
      case 'true-false':
        return <FaCheckCircle className="w-12 h-12" />;
      case 'watch-memorize':
        return <FaEye className="w-12 h-12" />;
      case 'airplane':
        return <FaPlane className="w-12 h-12" />;
      case 'rank-order':
        return <FaSortNumericDown className="w-12 h-12" />;
      case 'word-magnets':
        return <FaMagnet className="w-12 h-12" />;
      case 'maths-generator':
        return <FaCalculator className="w-12 h-12" />;
      default:
        return <FaGamepad className="w-12 h-12" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />  
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex space-x-4 mb-6">
            {['All templates', 'Multiple choice', 'Sorting', 'Word games', 'Action games'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 ${
                  selectedCategory === category
                    ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Link
                href={`/create/${template.id}`}
                key={template.id}
                className="block group"
              >
                <div className="bg-white rounded-lg border hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-44 h-28 flex items-center justify-center text-blue-600">
                      {renderIcon(template.icon)}
                    </div>
                    <div className='p-2 pl-1'>
                      <h3 className="text-xl group-hover:text-blue-600 font-semibold transition-all duration-200">
                        {template.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplatePage;
