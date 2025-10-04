import StarBorder from './StarBorder2';
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = "Ask another question..." }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <StarBorder
            as="form"
            className="w-full max-w-[800px]"
            color="white"
            speed="8s"
            thickness={0.5}
            innerClassName="flex items-center gap-3 px-4 py-2 bg-[rgba(20,30,50,0.3)] backdrop-blur-xl border border-white/20"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 bg-transparent text-white font-mono border-none outline-none placeholder:text-white/60 text-base"
            />
            <button
                type="submit"
                className="flex-shrink-0 w-[50px] h-[50px] 
                rounded-full bg-gradient-to-b from-[var(--orange)] to-[var(--hot-pink)] 
                flex items-center justify-center cursor-pointer transition-all duration-300 
                shadow-[0_4px_15px_rgba(255,107,53,0.4)] 
                hover:scale-105 hover:shadow-[0_0px_20px_rgba(255,107,53,0.6)]"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                >
                    <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                    <path d="M6 12h16" />
                </svg>
            </button>
        </StarBorder>
    );
}
