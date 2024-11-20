import { useEffect, useState, useRef } from 'react';
import { FaSchool, FaUser, FaEdit, FaSignOutAlt, FaChevronDown, FaSearch, FaChartBar, FaPlus, FaRobot, FaList, FaPencilAlt, FaUsers } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

import NavigationLink from './common/NavigationLink';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<{ email: string; name: string } | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
    const createDropdownRef = useRef<HTMLDivElement>(null);
    const [isActivitiesDropdownOpen, setIsActivitiesDropdownOpen] = useState(false);
    const activitiesDropdownRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
        
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        
        // Check for session cookie and get user data
        const checkAuth = async () => {
            try {
                console.log('Checking auth...');
                const response = await fetch('/api/auth/user');
                // console.log('Auth response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    // console.log('Auth data:', data);
                    setUserData(data);
                    setIsLoggedIn(true);
                } else {
                    // console.log('Auth failed:', await response.text());
                    setIsLoggedIn(false);
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsLoggedIn(false);
                setUserData(null);
            }
        };

        checkAuth();
        
        // Reduce the check frequency to avoid too many requests
        const authInterval = setInterval(checkAuth, 10000); // Check every 10 seconds

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(authInterval);
        };
    }, []);


    const handleLogout = async () => {
        try {
            console.log('Logging out...');
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            // console.log('Logout response status:', response.status);

            if (response.ok) {
                setIsLoggedIn(false);
                setUserData(null);
                router.push('/');
            } 
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    // Add useEffect to handle body scroll locking
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    // Thêm useEffect để xử lý click outside cho cả hai dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Xử lý cho Create dropdown
            if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
                setIsCreateDropdownOpen(false);
            }
            
            // Xử lý cho Activities dropdown
            if (activitiesDropdownRef.current && !activitiesDropdownRef.current.contains(event.target as Node)) {
                setIsActivitiesDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className={`fixed w-full top-0 z-30 transition-all duration-300 ${
            isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
            <div className="container mx-auto sm:px-6 px-2">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <NavigationLink href="/" className="flex items-center gap-2 transition hover:opacity-75">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold text-white">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                            MemorAIze
                        </span>
                    </NavigationLink>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-3">
                        <NavigationLink 
                            href="/explore"
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group flex items-center gap-2"
                        >
                            <FaSearch className="w-4 h-4" />
                            Explore
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                        </NavigationLink>
                        {isLoggedIn && (
                            <>
                                <NavigationLink
                                    href="/results"
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group flex items-center gap-2"
                                >
                                    <FaChartBar className="w-4 h-4" />
                                    My Results
                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                </NavigationLink>

                                <div className="relative" ref={activitiesDropdownRef}>
                                    <button
                                        onClick={() => setIsActivitiesDropdownOpen(!isActivitiesDropdownOpen)}
                                        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group flex items-center gap-2"
                                    >
                                        <FaList className="w-4 h-4" />
                                        Activities
                                        <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isActivitiesDropdownOpen ? 'rotate-180' : ''}`} />
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                    </button>

                                    {isActivitiesDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                                            <NavigationLink
                                                href="/activities/me"
                                                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                                onClick={() => setIsActivitiesDropdownOpen(false)}
                                            >
                                                <FaUser className="w-4 h-4" />
                                                My Activities
                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                            </NavigationLink>
                                            <NavigationLink
                                                href="/activities"
                                                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                                onClick={() => setIsActivitiesDropdownOpen(false)}
                                            >
                                                <FaUsers className="w-4 h-4" />
                                                All Activities
                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                            </NavigationLink>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="relative" ref={createDropdownRef}>
                            <button
                                onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group flex items-center gap-2"
                            >
                                <FaPlus className="w-4 h-4" />
                                Create
                                <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCreateDropdownOpen ? 'rotate-180' : ''}`} />
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                            </button>

                            {isCreateDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                                    <NavigationLink
                                        href={isLoggedIn ? "/flashcards/create" : "/login"}
                                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                        onClick={() => setIsCreateDropdownOpen(false)}
                                    >
                                        <FaPencilAlt className="w-4 h-4" />
                                        Create Manually
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                    </NavigationLink>
                                    <NavigationLink
                                        href={isLoggedIn ? "/flashcards/create-by-ai" : "/login"}
                                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                        onClick={() => setIsCreateDropdownOpen(false)}
                                    >
                                        <FaRobot className="w-4 h-4" />
                                        Create with AI
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                    </NavigationLink>
                                </div>
                            )}
                        </div>

                        {!isLoggedIn &&(
                            <NavigationLink 
                                href="/login"
                                className="px-5 py-2.5 relative rounded-xl border-2 border-transparent hover:shadow-lg transition-all duration-200"
                                style={{
                                    backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #6366F1, #EC4899)',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'padding-box, border-box',
                                }}
                            >
                                <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent font-semibold">
                                    Sign In
                                </span>
                            </NavigationLink>
                        )}

                        {/* User Profile Dropdown */}
                        {isLoggedIn && userData && (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="group relative flex items-center gap-3 px-4 py-2 text-gray-700 rounded-xl transition-all duration-200"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                                        <span className="text-white font-medium">
                                            {userData.email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="font-medium relative">
                                        {userData.email}
                                    </span>
                                    <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                                </button>
                                
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-0"
                                            onClick={handleOverlayClick}
                                        />
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                                            <div className="px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group">
                                                BASIC ACCOUNT
                                                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 w-full transition-all duration-300" />
                                            </div>
                                            <div className="p-2 space-y-1">
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group">
                                                    <FaSchool className="w-5 h-5 text-gray-500" /> 
                                                    My school
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                </a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group">
                                                    <FaUser className="w-5 h-5 text-gray-500" /> 
                                                    My Profile Page
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                </a>
                                                <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group">
                                                    <FaEdit className="w-5 h-5 text-gray-500" /> 
                                                    Edit personal details
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                </a>
                                                <button 
                                                    className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:text-red-700 transition-all duration-200 rounded-lg relative group w-full"
                                                    onClick={handleLogout}
                                                >
                                                    <FaSignOutAlt className="w-5 h-5" /> 
                                                    Log Out
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden fixed right-2 top-5 z-[9999] w-10 h-10 focus:outline-none group"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className="relative flex flex-col items-center justify-center w-6 h-6 mx-auto">
                            <span className={`w-full h-0.5 bg-gray-600 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-gray-600 mt-1.5 transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-gray-600 mt-1.5 transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                        </div>
                    </button>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-[9998] md:hidden">
                            <div 
                                className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,height:'100vh' }}
                            />
                            <nav className="fixed right-0 top-0 h-screen w-[280px] bg-white flex flex-col overflow-y-auto">
                                {/* Header */}
                                <div className="p-4 border-b bg-white flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-lg flex items-center justify-center">
                                            <span className="text-base font-bold text-white">B</span>
                                        </div>
                                        <span className="text-lg font-bold text-purple-600">BrainCards</span>
                                    </div>
                                </div>

                                {/* Menu Content */}
                                <div className="flex-1 p-4 space-y-4">
                                    <NavigationLink
                                        href="/explore"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaSearch className="w-4 h-4" />
                                        Explore
                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                    </NavigationLink>
                                    
                                    {isLoggedIn && (
                                        <>
                                            <NavigationLink
                                                href="/results"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <FaChartBar className="w-4 h-4" />
                                                My Results
                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                            </NavigationLink>

                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsActivitiesDropdownOpen(!isActivitiesDropdownOpen)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group"
                                                >
                                                    <FaList className="w-4 h-4" />
                                                    Activities
                                                    <FaChevronDown className={`w-3 h-3 ml-auto transition-transform duration-200 ${isActivitiesDropdownOpen ? 'rotate-180' : ''}`} />
                                                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                </button>

                                                {isActivitiesDropdownOpen && (
                                                    <>
                                                        <div 
                                                            className="fixed inset-0 z-0" 
                                                            onClick={() => setIsActivitiesDropdownOpen(false)}
                                                        />
                                                        <div className="mt-1 bg-gray-50 rounded-lg overflow-hidden relative z-10">
                                                            <NavigationLink
                                                                href="/activities/me"
                                                                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                                                onClick={() => {
                                                                    setIsActivitiesDropdownOpen(false);
                                                                    setIsMobileMenuOpen(false);
                                                                }}
                                                            >
                                                                <FaUser className="w-4 h-4" />
                                                                My Activities
                                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                            </NavigationLink>
                                                            <NavigationLink
                                                                href="/activities"
                                                                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                                                onClick={() => {
                                                                    setIsActivitiesDropdownOpen(false);
                                                                    setIsMobileMenuOpen(false);
                                                                }}
                                                            >
                                                                <FaUsers className="w-4 h-4" />
                                                                All Activities
                                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                            </NavigationLink>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Create Dropdown in Mobile */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg relative group"
                                        >
                                            <FaPlus className="w-4 h-4" />
                                            Create
                                            <FaChevronDown className={`w-3 h-3 ml-auto transition-transform duration-200 ${isCreateDropdownOpen ? 'rotate-180' : ''}`} />
                                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                        </button>

                                        {isCreateDropdownOpen && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-0" 
                                                    onClick={() => setIsCreateDropdownOpen(false)}
                                                />
                                                <div className="mt-1 bg-gray-50 rounded-lg overflow-hidden relative z-10">
                                                    <NavigationLink 
                                                        href={isLoggedIn ? "/flashcards/create" : "/login"}
                                                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                                        onClick={() => {
                                                            setIsCreateDropdownOpen(false);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        <FaPencilAlt className="w-4 h-4" />
                                                        Create Manually
                                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                    </NavigationLink>
                                                    <NavigationLink 
                                                        href={isLoggedIn ? "/flashcards/create-by-ai" : "/login"}
                                                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 transition-all duration-200 relative group"
                                                        onClick={() => {
                                                            setIsCreateDropdownOpen(false);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                    >
                                                        <FaRobot className="w-4 h-4" />
                                                        Create with AI
                                                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
                                                    </NavigationLink>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {!isLoggedIn && (
                                        <NavigationLink 
                                            href="/login"
                                            className="block w-full py-3 relative rounded-lg text-center border-2 border-transparent"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            style={{
                                                backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #6366F1, #EC4899)',
                                                backgroundOrigin: 'border-box',
                                                backgroundClip: 'padding-box, border-box',
                                            }}
                                        >
                                            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent font-semibold">
                                                Sign In
                                            </span>
                                        </NavigationLink>
                                    )}
                                </div>

                                {/* User Section */}
                                {isLoggedIn && userData && (
                                    <div className="sticky bottom-0 p-4 border-t bg-white">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {userData.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-gray-700">{userData.email}</div>
                                                <div className="text-sm text-gray-500">Basic Account</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex items-center text-red-600 gap-2"
                                        >
                                            <FaSignOutAlt className="w-5 h-5" /> 
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;