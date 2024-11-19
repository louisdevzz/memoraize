import { FC, useState, useRef, useEffect } from 'react';

interface SelectOption {
    value: string;
    label: string;
    icon?: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    label?: string;
    name?: string;
    required?: boolean;
    className?: string;
}

const Select: FC<SelectProps> = ({
    value,
    onChange,
    options,
    label,
    required = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
        () => options.find(opt => opt.value === value) || null
    );
    const selectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const option = options.find(opt => opt.value === value);
        setSelectedOption(option || null);
    }, [value, options]);

    const handleSelect = (option: SelectOption) => {
        setSelectedOption(option);
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="w-full" ref={selectRef}>
            {label && (
                <label className="block mb-2 text-gray-700 font-medium">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {/* Selected Value Display */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full p-3 pl-4 pr-10 border border-gray-200 rounded-xl 
                        bg-white/50 cursor-pointer hover:border-indigo-300
                        text-gray-700 font-medium transition-all duration-200
                        ${isOpen ? 'border-indigo-600 ring-1 ring-indigo-600/10' : ''}
                        ${className}`}
                >
                    <div className="flex items-center gap-2">
                        {selectedOption?.icon && (
                            <span className="text-lg">{selectedOption.icon}</span>
                        )}
                        <span>{selectedOption?.label || 'Select an option'}</span>
                    </div>
                </div>

                {/* Dropdown Arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg 
                        className={`transform transition-transform duration-200 text-gray-400
                            ${isOpen ? 'rotate-180' : ''}`}
                        width="20" 
                        height="20" 
                        viewBox="0 0 20 20" 
                        fill="none" 
                    >
                        <path 
                            d="M5.83334 7.5L10 11.6667L14.1667 7.5" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Options Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg 
                        overflow-hidden transition-all duration-200 animate-fadeIn">
                        <div className="max-h-60 overflow-y-auto">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`px-4 py-3 flex items-center gap-2 cursor-pointer transition-colors
                                        ${selectedOption?.value === option.value 
                                            ? 'bg-indigo-50 text-indigo-600' 
                                            : 'hover:bg-gray-50 text-gray-700'}`}
                                >
                                    {option.icon && (
                                        <span className="text-lg">{option.icon}</span>
                                    )}
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select; 