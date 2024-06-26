import Link from 'next/link';
import React, { useState } from 'react';
import { Lightning, Heart, Lightbulb, CurrencyDollar } from 'phosphor-react';
import {Button} from "@nextui-org/react";
import { usePathname } from 'next/navigation';

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
            <section className='flex flex-col items-center justify-center py-24 bg-gradient-to-t from-blue-50 to-blue-100'>
                <h1 className='text-center text-7xl font-extrabold leading-tight'>
                An{' '}
                <span className='text-blue-600'>
                    AI powered
                </span>
                <br />
                Ielts Speaking Training
                </h1>
                <div className='my-6 px-20 text-center text-2xl text-text-secondary'>
                A fast, reliable and easy-to-use GPT model website for Ielts speaking training
                </div>

                <div className='mb-20'>
                    <Link href="/speaking">
                        <button className="text-2xl px-10 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-600 transition-colors">
                            Start Now
                        </button>
                    </Link>
                </div>
                <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">Why choose us?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
            The best virtual staging <span className="font-bold text-green-600">Algorithm</span> powered by <span className="font-bold text-green-600">Artificial Intelligence</span>. Developed at <span className="font-bold text-green-600">Harvard Innovation Labs</span>.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card 1 */}
                            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 border-2 border-transparent hover:border-green-600 hover:-translate-y-1 transition duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Lowest price</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                            Starting at only <span className="font-bold text-green-600">$12/month</span> you can virtually stage 6 images. That&#39; cheaper than what most agencies charge for a single image. Enterprise plans go as low as $0.25 per staged picture.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 border-2 border-transparent hover:border-green-600 hover:-translate-y-1 transition duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Fastest turnaround</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                        Thanks to our advanced artificial intelligence you get your virtually staged pictures <span className="font-bold text-green-600">within 10 seconds</span>. No more waiting for designers.
                                </p>
                            </div>
                            {/* Card 3 */}
                            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 border-2 border-transparent hover:border-green-600 hover:-translate-y-1 transition duration-300">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Decluttering included</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                        If the rooms in your images are not entirely empty, we will <span className="font-bold text-green-600">remove existing furniture or clutter</span> for free. You&#39;ll receive both the decluttered image of the empty room and the staged image of the room.                        </p>
                            </div>
                            {/* Card 4 */}
                            <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 border-2 border-transparent hover:border-green-600 hover:-translate-y-1 transition duration-300">

                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Unlimited revisions</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                        Had something different in mind? Instead of having to go back and forth with a designer, get more designs <span className="font-bold text-green-600">within seconds</span>.                        </p>
                            </div>
                            {/* CTA Button */}
                            <div className="mt-8 lg:mt-0 lg:col-span-4">
                                <Link href="/photos" passHref>
                                    <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300 ease-in-out animate-pulse">
                            Try for Free
                                    </button>
                                </Link>
                                <p className="mt-1 text-gray-500 text-sm">No signup</p>
                            </div>
                        </div>
                    </div>
            </section>
            </div>
    );
};

export default Main;