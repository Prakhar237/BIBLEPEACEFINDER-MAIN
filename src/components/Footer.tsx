import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full text-center py-6 mt-10 text-white text-sm">
      <p>Verses for the Soul © {new Date().getFullYear()}</p>
      <p className="mt-1">Bringing comfort and guidance through scripture</p>
    </footer>
  );
};

export default Footer;
