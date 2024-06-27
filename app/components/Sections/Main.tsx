import Link from 'next/link';
import React, { useState } from 'react';
import { Lightning, Heart, Lightbulb, CurrencyDollar } from 'phosphor-react';
import { Button } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import styles from './style.module.css'; // Adjust the path to match your CSS file

type NavLinkProps = {
    href: string;
    text: string;
};
  
const NavLink: React.FC<NavLinkProps> = ({ href, text }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
  
    const activeClasses = "bg-gray-200 text-black";
    const inactiveClasses = "hover:bg-gray-100 hover:text-gray-800";
  
    return (
        <Link href={href} passHref>
            <button className={`px-4 py-2 rounded transition-colors ${isActive ? activeClasses : inactiveClasses}`}>
                {text}
            </button>
        </Link>
    );
};

const Main: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div>
            <section className='flex flex-col items-center justify-center py-20 bg-gradient-to-t from-blue-50 to-blue-100'>
                <h1 className={`text-center text-7xl font-extrabold leading-tight`}>
                    <span className={`${styles.maintext}`}>
                        An{' '}
                    </span>
                    <span className={`${styles.gracol}`}>
                        AI powered
                    </span>
                    <br />
                    <span className={`${styles.maintext}`}>
                        Ielts Speaking Training
                    </span>
                </h1>
                <div className={`my-6 px-20 text-center text-2xl text-text-secondary ${styles.maintext}`}>
                    A fast, reliable and easy-to-use GPT model website for Ielts speaking training
                </div>

                <div className='mb-20'>
                    <Link href="/speaking">
                        <button className="text-2xl px-10 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-600 transition-colors">
                            Start Now
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Main;
