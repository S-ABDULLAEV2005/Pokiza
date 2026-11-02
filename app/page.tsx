'use client';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import {motion, useReducedMotion, useScroll, useTransform, useSpring,} from 'framer-motion';
import {ArrowUpRight, ArrowDown, ArrowUp, MapPin, Menu, X,} from 'lucide-react';
import {siWhatsapp, siTelegram, siInstagram} from 'simple-icons';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {dictionaries, isLocale, type Locale} from '@/components/locale';
import {contacts} from '@/site-config';

const icons = {whatsapp: siWhatsapp, telegram: siTelegram, instagram: siInstagram};

function Social({kind}: { kind: keyof typeof icons }) {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={icons[kind].path}/>
    </svg>
}

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [locale, setLocale] = useState<Locale>('ru');
    const t = dictionaries[locale];
    const reduced = useReducedMotion();
    const { scrollY, scrollYProgress } = useScroll();

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    const y = useTransform(scrollY, [0, 900], [0, -50]);
    useEffect(() => {
        const ids = ['about', 'contact', 'careers'];

        const updateActiveSection = () => {
            const marker = window.innerHeight * 0.4;
            let current = '';

            for (const id of ids) {
                const section = document.getElementById(id);

                if (section && section.getBoundingClientRect().top <= marker) {
                    current = id;
                }
            }

            setActiveSection(current);
        };

        let frame: number | null = null;

        const scheduleUpdate = () => {
            if (frame !== null) return;

            frame = window.requestAnimationFrame(() => {
                updateActiveSection();
                frame = null;
            });
        };

        updateActiveSection();

        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);

            if (frame !== null) {
                window.cancelAnimationFrame(frame);
            }
        };
    }, []);
    useEffect(() => {
        try {
            const saved = localStorage.getItem('pokiza-locale');
            if (isLocale(saved)) setLocale(saved)
        } catch {
        }
    }, []);
    useEffect(() => {
        document.documentElement.lang = locale;
        document.title = 'POKIZA — ' + t.title;
        for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) document.querySelector(selector)?.setAttribute('content', t.desc);
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'POKIZA — ' + t.title)
    }, [locale, t]);
    const change = (l: Locale) => {
        setLocale(l);
        try {
            localStorage.setItem('pokiza-locale', l)
        } catch {
        }
    };
    const reveal = {
        initial: {
            opacity: reduced ? 1 : 0,
            y: reduced ? 0 : 40,
        },
        whileInView: {
            opacity: 1,
            y: 0,
        },
        viewport: {
            once: true,
            amount: 0.15,
        },
        transition: {
            duration: reduced ? 0 : 0.85,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    };
    return <><a className="skip" href="#content">{t.skip}</a>
        <header>
            <motion.div
                className="scroll-progress"
                style={{
                    scaleX: reduced ? scrollYProgress : smoothProgress,
                }}
                aria-hidden="true"
            />

            <div className="brand">
            <Image
                src="/pokiza-logo.png"
                alt="POKIZA"
                width={76}
                height={76}
                priority
            />
        </div>
            <nav aria-label="POKIZA">
                {t.nav.map((name, index) => {
                    const id = ['about', 'contact', 'careers'][index];
                    const isActive = activeSection === id;

                    return (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={isActive ? 'nav-active' : undefined}
                            aria-current={isActive ? 'location' : undefined}
                        >
                            {name}
                        </a>
                    );
                })}
            </nav>
            <div className="header-right"><LanguageSwitcher locale={locale} onChange={change} label={t.lang}/>
                <button
                    type="button"
                    className="mobile-menu-toggle"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={
                        locale === 'ru'
                            ? menuOpen ? 'Закрыть меню' : 'Открыть меню'
                            : locale === 'tg'
                                ? menuOpen ? 'Пӯшидани меню' : 'Кушодани меню'
                                : menuOpen ? 'Close menu' : 'Open menu'
                    }
                    onClick={() => setMenuOpen((previous) => !previous)}
                >
                    {menuOpen ? <X size={23} /> : <Menu size={23} />}
                </button></div>
            <div
                id="mobile-navigation"
                className="mobile-navigation"
                hidden={!menuOpen}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        setMenuOpen(false);

                        document
                            .querySelector<HTMLButtonElement>('.mobile-menu-toggle')
                            ?.focus();
                    }
                }}
            >
                {t.nav.map((name, index) => {
                    const id = ['about', 'contact', 'careers'][index];

                    return (
                        <a
                            key={id}
                            href={`#${id}`}
                            aria-current={activeSection === id ? 'location' : undefined}
                            onClick={() => setMenuOpen(false)}
                        >
        <span className="mobile-nav-number">
          0{index + 1}
        </span>

                            <span>{name}</span>

                            <ArrowUpRight size={20} />
                        </a>
                    );
                })}
            </div>
        </header>
        <main id="content">
            <section className="hero" id="top">
                <motion.div className="hero-photo" style={{y: reduced ? 0 : y}}><Image src="/hero.webp" alt={t.photo}
                                                                                       fill priority sizes="100vw"
                                                                                       style={{objectFit: 'cover'}}/>
                </motion.div>
                <div className="hero-shade"/>
                <div className="hero-inner">
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: reduced ? 0 : 1}}
                                className="eyebrow hero-eyebrow"><span/>{t.eyebrow}</motion.div>
                    <motion.h1 initial={{opacity: 0, y: reduced ? 0 : 25}} animate={{opacity: 1, y: 0}}
                               transition={{duration: reduced ? 0 : .9, delay: .1}}>POKIZA<span>.</span></motion.h1>
                    <motion.div initial={{opacity: 0, y: reduced ? 0 : 20}} animate={{opacity: 1, y: 0}}
                                transition={{duration: reduced ? 0 : .8, delay: .25}}><h2>{t.title}</h2><p>{t.desc}</p>
                        <div className="actions"><a className="button red" href="#contact">{t.connect}<ArrowUpRight
                            size={19}/></a><a className="button glass" href="#careers">{t.jobs}<ArrowUpRight size={19}/></a>
                        </div>
                    </motion.div>
                </div>
                <div className="hero-bottom"><a href="#about"><span className="circle"><ArrowDown
                    size={18}/></span>{t.scroll}</a><span><MapPin size={14}/>{t.location}</span></div>
                <div className="hero-side">POKIZA / 1992</div>
            </section>
            <section id="about" className="intro wrap">
                <motion.div {...reveal} className="intro-grid">
                    <div className="eyebrow dark"><span/>POKIZA</div>
                    <div><h2>
                        <a
                            className="official-site-link"
                            href="https://pokiza.tj/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t.intro}
                        </a>
                    </h2><p>{t.introBody}</p></div>
                    <a
                        className="official-site-arrow"
                        href="https://pokiza.tj/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`POKIZA — pokiza.tj`}
                    >
                        <ArrowUpRight className="intro-arrow" strokeWidth={1} />
                    </a></motion.div>
            </section>
            <section id="contact" className="contacts">
                <div className="contacts-decoration" aria-hidden="true">
                    <div className="contacts-dots" />

                    <motion.div
                        className="contacts-orbit contacts-orbit-one"
                        initial={false}
                        whileInView={{
                            y: reduced ? 0 : -35,
                            rotate: reduced ? 0 : 12,
                        }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: reduced ? 0 : 1.8,
                            ease: 'easeOut',
                        }}
                    />

                    <motion.div
                        className="contacts-orbit contacts-orbit-two"
                        initial={false}
                        whileInView={{
                            y: reduced ? 0 : 30,
                            rotate: reduced ? 0 : -12,
                        }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: reduced ? 0 : 1.8,
                            ease: 'easeOut',
                        }}
                    />
                </div>

                <div className="wrap">
                    <motion.div {...reveal} className="section-heading">
                        <div>
                            <div className="eyebrow dark"><span/>{t.official}</div>
                            <h2>{t.contactTitle}</h2></div>
                        <p>{t.contactBody}</p></motion.div>
                    <div className="contact-grid">{contacts.map((c, i) => (
                        <motion.div
                            key={c.id}
                            className={`contact-item${i === 0 ? ' primary-item' : ''}`}
                            {...reveal}
                            transition={{
                                duration: reduced ? 0 : 0.75,
                                delay: reduced ? 0 : i * 0.08,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`contact-card${i === 0 ? ' primary' : ''}`}
                            >
                                <div className="card-top">
        <span className={`social ${c.kind}`}>
          <Social kind={c.kind} />
        </span>

                                    <ArrowUpRight className="card-arrow" size={22} />
                                </div>

                                <span className="card-label">
        {c.job ? t.career : i === 0 ? 'POKIZA' : t.company}
      </span>

                                <h3>{c.platform}</h3>

                                <p>
                                    {[t.wa, t.tg, t.ig, t.jobtg, t.jobig][i]}
                                </p>

                                <div className="card-detail">
                                    {c.detail}
                                </div>

                                <div className="card-action">
        <span>
          {i === 0
              ? t.write
              : c.kind === 'telegram'
                  ? t.open
                  : t.profile}
        </span>

                                    <ArrowUpRight size={17} />
                                </div>
                            </a>
                        </motion.div>
                    ))}</div>
                    <div className="contact-note"><span/>{t.note}</div>
                </div>
            </section>
            <section id="careers" className="careers wrap">
                <motion.div {...reveal} className="career-panel">
                    <div className="career-visual" aria-hidden="true">
                        <div className="career-ring ring1"/>
                        <div className="career-ring ring2"/>
                        <span>P</span>
                        <div className="career-small">POKIZA</div>
                    </div>
                    <div className="career-copy">
                        <div className="eyebrow"><span/>{t.careertag}</div>
                        <h2>{t.careerTitle}</h2><p>{t.careerBody}</p>
                        <div className="career-actions"><a className="button white" href={contacts[3].url} target="_blank"
                                                    rel="noopener noreferrer"><Social
                            kind="telegram"/>{t.jobTelegram}<ArrowUpRight size={18}/></a><a className="button white"
                                                                                            href={contacts[4].url}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"><Social kind="instagram" />{t.jobInstagram}<ArrowUpRight
                            size={18}/></a></div>
                    </div>
                </motion.div>
            </section>
        </main>
        <footer className="wrap">
            <div className="footer-main">
                <div><Image src="/pokiza-logo.png" alt="POKIZA" width={88} height={88}/><p>{t.footer}</p></div>
                <nav>{t.nav.map((n, i) => <a key={i} href={'#' + ['about', 'contact', 'careers'][i]}>{n}</a>)}</nav>
                <a className="to-top" href="#top" aria-label={t.top}><ArrowUp size={20}/></a></div>
            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} POKIZA. {t.rights}</span><span>{t.location}</span></div>
        </footer>
    </>;
}
