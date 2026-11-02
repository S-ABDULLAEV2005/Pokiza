'use client';
import {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {Check, ChevronDown, Globe2} from 'lucide-react';
import type {Locale} from './locale';

const choices: { code: Locale; short: string; flag: string; name: string }[] = [{
    code: 'ru',
    short: 'RU',
    flag: '🇷🇺',
    name: 'Русский'
}, { code: 'tg', short: 'TJ', flag: '🇹🇯', name: 'Тоҷикӣ' }, {code: 'en', short: 'EN', flag: '🇬🇧', name: 'English'}];
export default function LanguageSwitcher({locale, onChange, label}: {
    locale: Locale;
    onChange: (lang: Locale) => void;
    label: string
}) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const active = choices.find(x => x.code === locale)!;
    useEffect(() => {
        const dismiss = (event: MouseEvent) => {
            if (!root.current?.contains(event.target as Node)) setOpen(false)
        };
        const key = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        };
        document.addEventListener('mousedown', dismiss);
        document.addEventListener('keydown', key);
        return () => {
            document.removeEventListener('mousedown', dismiss);
            document.removeEventListener('keydown', key)
        }
    }, []);
    return <div className="language" ref={root}>
        <button className="language-trigger" aria-label={label} aria-expanded={open} aria-haspopup="listbox"
                onClick={() => setOpen(v => !v)}><Globe2 size={16}/><span
            className="flag">{active.flag}</span><span>{active.short}</span><ChevronDown
            className={open ? 'rotated' : ''} size={15}/></button>
        {open && <motion.div initial={{opacity: 0, y: -6}} animate={{opacity: 1, y: 0}} className="language-dropdown"
                             role="listbox" aria-label={label}>{choices.map(x => <button key={x.code} role="option"
                                                                                         aria-selected={locale === x.code}
                                                                                         className={locale === x.code ? 'selected' : ''}
                                                                                         onClick={() => {
                                                                                             onChange(x.code);
                                                                                             setOpen(false)
                                                                                         }}><span
            className="flag">{x.flag}</span><span>{x.name}</span>{locale === x.code &&
            <Check size={15} className="language-check"/>}</button>)}</motion.div>}</div>
}
