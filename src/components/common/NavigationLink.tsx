import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface NavigationLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

const NavigationLink = ({ href, children, className = '', onClick,style }: NavigationLinkProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (pathname === href || isNavigating) return;
        
        setIsNavigating(true);
        const loadingToast = toast.loading('Loading...', {
            duration: 2000,
        });
        
        if (onClick) {
            onClick();
        }

        try {
            // Prefetch the route
            await router.prefetch(href);
            
            // Navigate immediately
            router.push(href);

            // Delay the cleanup slightly to show loading
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Navigation error:', error);
        } finally {
            toast.dismiss(loadingToast);
            setIsNavigating(false);
        }
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            style={style}
            className={`${className} ${isNavigating ? 'pointer-events-none opacity-70' : ''}`}
        >
            {children}
        </Link>
    );
};

export default NavigationLink; 