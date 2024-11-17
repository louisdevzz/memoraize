import { useEffect, useState } from 'react';
import { FaSchool, FaUser, FaEdit, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState(false);

    const router = useRouter();
        
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        try {
            const decoded = jwt.decode(token || '');
            //@ts-ignore
            setUserName(decoded?.email || '');
        } catch (error) {
            console.error('Error decoding token:', error);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
            isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
            <div className="container mx-auto sm:px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 transition hover:opacity-75">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">B</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                            BrainCards
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden relative z-50 w-10 h-10 focus:outline-none group"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className="relative flex flex-col items-center justify-center w-6 h-6 mx-auto">
                            <span className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-gray-600 mt-1.5 transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-gray-600 mt-1.5 transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-3">
                        <Link href="/explore" className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100/80">
                            Explore
                        </Link>
                        {isLoggedIn && (
                            <Link href="/results" className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100/80">
                                My Results
                            </Link>
                        )}
                        <Link 
                            href="/create/template" 
                            className="px-5 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                        >
                            Create Activity
                        </Link>
                        <Link 
                            href="/create-by-ai" 
                            className="px-5 py-2.5 text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
                        >
                            Create by AI
                        </Link>
                        <Link 
                            href="/upgrade" 
                            className="px-5 py-2.5 text-indigo-600 border-2 border-indigo-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200"
                        >
                            Upgrade
                        </Link>
                        
                        {isLoggedIn ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                                        <span className="text-white font-medium">{userName.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span className="font-medium">{userName}</span>
                                    <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-0"
                                            onClick={handleOverlayClick}
                                        />
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-medium">
                                                BASIC ACCOUNT
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                    <FaSchool className="w-5 h-5 text-gray-500" /> My school
                                                </a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                    <FaUser className="w-5 h-5 text-gray-500" /> My Profile Page
                                                </a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                                    <FaEdit className="w-5 h-5 text-gray-500" /> Edit personal details
                                                </a>
                                                <button 
                                                    className="flex items-center gap-3 px-4 py-2.5 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full"
                                                    onClick={() => {
                                                        localStorage.removeItem('token');
                                                        setIsLoggedIn(false);
                                                        router.push('/login');
                                                    }}
                                                >
                                                    <FaSignOutAlt className="w-5 h-5" /> Log Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                className="px-5 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-40 md:hidden">
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                            <nav className="fixed right-0 top-0 bottom-0 w-80 bg-white p-6 shadow-2xl">
                                <div className="h-full flex flex-col">
                                    <div className="flex-1 space-y-2">
                                        <Link href="/explore" className="block px-4 py-3 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                            Explore
                                        </Link>
                                        <Link href="/activities" className="block px-4 py-3 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                            My Activities
                                        </Link>
                                        <Link href="/results" className="block px-4 py-3 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                            My Results
                                        </Link>
                                        
                                        <div className="pt-4 space-y-2">
                                            <Link href="/create/template" className="block w-full px-4 py-3 text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl text-center font-medium hover:shadow-lg transition-all duration-200">
                                                Create Activity
                                            </Link>
                                            <Link href="/create-by-ai" className="block w-full px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl text-center font-medium hover:shadow-lg transition-all duration-200">
                                                Create by AI
                                            </Link>
                                            <Link href="/upgrade" className="block w-full px-4 py-3 text-indigo-600 border-2 border-indigo-200 rounded-xl text-center font-medium hover:bg-indigo-50 transition-all duration-200">
                                                Upgrade
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 border-t">
                                        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-3 rounded-xl text-center font-medium mb-4">
                                            BASIC ACCOUNT
                                        </div>
                                        <div className="space-y-2">
                                            <Link href="/school" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                                <FaSchool className="w-5 h-5 text-gray-500" /> 
                                                <span className="font-medium">My school</span>
                                            </Link>
                                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                                <FaUser className="w-5 h-5 text-gray-500" /> 
                                                <span className="font-medium">My Profile Page</span>
                                            </Link>
                                            <Link href="/edit-profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                                                <FaEdit className="w-5 h-5 text-gray-500" /> 
                                                <span className="font-medium">Edit personal details</span>
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    localStorage.removeItem('token');
                                                    setIsLoggedIn(false);
                                                    router.push('/login');
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200 w-full"
                                            >
                                                <FaSignOutAlt className="w-5 h-5" /> 
                                                <span className="font-medium">Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;