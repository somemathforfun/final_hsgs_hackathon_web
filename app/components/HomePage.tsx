// app/components/HomePage.tsx

import Link from 'next/link';
import React from 'react';
import Image from 'next/image'; 
import Usp from './Sections/Usp';
import Main from './Sections/Main';
import TrustedCompanies from './Sections/TrustedCompanies';

const HomePage: React.FC = () => {
    return (
        <>
            <Main/>
            {/* <Usp/> */}
            <TrustedCompanies/>


        </>
    );
};

export default HomePage;