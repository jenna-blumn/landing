import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '서비스 소개', href: '#features' },
    { label: '요금 비교', href: '#comparison' },
    { label: '문의하기', href: '#contact' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 nav-header"
      data-scrolled={isScrolled}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <span className="nav-logo-text">루나M</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="nav-login">로그인</a>
            <a href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig" target="_blank" rel="noopener noreferrer" className="nav-cta">상담 신청</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="nav-mobile-btn"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl animate-fade-up"
            style={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-zinc-600 font-medium py-2.5 px-3 rounded-lg hover:bg-zinc-50 hover:text-zinc-900"
                  style={{ transition: 'background-color 150ms ease, color 150ms ease' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-zinc-100 space-y-2">
                <a href="#" className="block text-center text-zinc-600 font-medium py-2.5 rounded-lg hover:bg-zinc-50">
                  로그인
                </a>
                <a href="https://mbisolution.recatch.cc/workflows/dkqkmxcfig" target="_blank" rel="noopener noreferrer" className="block text-center btn-primary py-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                  상담 신청
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
