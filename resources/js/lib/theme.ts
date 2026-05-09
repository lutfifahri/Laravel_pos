export function setTheme(theme: 'light' | 'dark' | 'system') {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        root.classList.add(systemTheme);
        return;
    }

    root.classList.add(theme);
}

export function getTheme(): 'light' | 'dark' | 'system' {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
}

export function toggleTheme() {
    const current = getTheme();
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    setTheme(next);
    return next;
}
