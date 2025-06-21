import { FaHeart } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-1">
        <p className="flex items-center gap-2 text-lg font-semibold">
          Made with <FaHeart className="text-red-300 animate-pulse" /> by{" "}
          <span className="font-bold">Arijit Ghosh</span>
        </p>
        <p className="text-sm">© {year} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
