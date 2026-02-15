import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo512.png"
                alt="Curio Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-white">CURIO</span>
            </div>
            <p className="text-sm text-gray-400">
              A modern platform for reading and publishing quality articles.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm hover:text-primary-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <Link
              to="/categories"
              className="text-white font-semibold mb-4 hover:text-primary-400 transition"
            >
              Categories
            </Link>
            <ul className="space-y-2 mt-4">
              <li>
                <Link
                  to="/articles?category=technology"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/articles?category=health"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Health
                </Link>
              </li>
              <li>
                <Link
                  to="/articles?category=business"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link
                  to="/articles?category=lifestyle"
                  className="text-sm hover:text-primary-400 transition"
                >
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest articles delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-primary-500"
              />
              <button className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition">
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} CURIO. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-sm text-gray-400 hover:text-primary-400 transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-400 hover:text-primary-400 transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
