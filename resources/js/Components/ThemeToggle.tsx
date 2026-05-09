import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { getTheme, setTheme, toggleTheme as themeToggler } from '@/lib/theme';

export function ThemeToggle() {
    const [theme, setInternalTheme] = useState<'light' | 'dark' | 'system'>('system');

    useEffect(() => {
        const savedTheme = getTheme();
        setInternalTheme(savedTheme);
        setTheme(savedTheme);
    }, []);

    const handleToggle = () => {
        const next = themeToggler();
        setInternalTheme(next);
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleToggle}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
