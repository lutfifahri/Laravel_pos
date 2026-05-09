import React from 'react';
import { Input } from '@/Components/ui/input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string | number;
    onChange: (value: string) => void;
}

export const CurrencyInput = ({ value, onChange, ...props }: CurrencyInputProps) => {
    const formatDisplay = (val: string | number) => {
        if (!val) return '';
        const numberValue = typeof val === 'string' ? val.replace(/\D/g, '') : val.toString();
        return new Intl.NumberFormat('id-ID').format(parseInt(numberValue) || 0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        onChange(rawValue);
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground border-r pr-2">
                Rp
            </span>
            <Input
                {...props}
                type="text"
                value={formatDisplay(value)}
                onChange={handleChange}
                className={`pl-12 font-black ${props.className || ''}`}
            />
        </div>
    );
};
