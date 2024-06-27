// components/Footer.tsx

import Link from 'next/link';
import React from 'react';
  
const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-50 bg-opacity-90 text-black z-20">
            <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-8">
                <div>
                    <h2 className="text-sm font-semibold text-blue-900">HSGS Hackathon</h2>
                </div>
                <div>
                    <h3 className="text-black font-semibold mb-4 text-sm">Quick Links</h3>
                    <ul className="text-gray-700 text-xs">
                        <li>Home</li>
                        <li>Speaking</li>
                        <li>StressTest</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-black font-semibold mb-4 text-sm">Terms & Conditions</h3>
                    <ul className="text-gray-700 text-xs">
                        <li>Terms of Use</li>
                        <li>Refund Policy</li>
                        <li>Privacy Policy</li>
                        <li>Cookie Policy</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-black font-semibold mb-4 text-sm">Developer</h3>
                    <ul className="text-gray-700 text-xs">
                        <li>Doan Gia Huy</li>
                        <li>Tran Bao Khanh</li>
                        <li>Nguyen Tran An Hiep</li>
                        <li>Nguyen Trung Thai Son</li>
                        <li>Kieu Thanh Binh</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-black font-semibold mb-4 text-sm">Contact</h3>
                    <ul className="text-gray-700 text-xs">
                        <li>info@virtualstagingai.app</li>
                        <li>Work with Us</li>
                        <li>Affiliate Program</li>
                        <li>Whitelabel Program</li>
                        <li>API Access</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-black font-semibold mb-4 text-sm">Mailing Address</h3>
                    <address className="not-italic text-gray-700 text-xs">
              HUS HSGS High School<br />
              182 Luong The Vinh Street<br />
              Ha Noi, postcode: 11400
                    </address>
                </div>
            </div>
            <div className="text-center py-4 text-gray-600 text-xs">
          © 2024 DuTuyenTongHop23™
            </div>
        </footer>
    );
};

export default Footer;