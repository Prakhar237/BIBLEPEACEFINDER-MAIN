import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const translations = {
    en: {
      home: 'Home',
      products: 'Trusted Products',
      community: 'Counselling Programs'
    },
    es: {
      home: 'Inicio',
      products: 'Productos Confiables',
      community: 'Programa de Consejería'
    },
    fr: {
      home: 'Accueil',
      products: 'Produits de Confiance',
      community: 'Programme de Conseil'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const navLinks = [
    { to: '/', label: t.home },
    { to: '/products', label: t.products },
    { to: '/community', label: t.community }
  ];

  return (
    <nav className="relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl px-6 py-3 rounded-lg transition-all duration-300 ${
                location.pathname === link.to
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center gap-4 mb-8">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === link.to
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation; 