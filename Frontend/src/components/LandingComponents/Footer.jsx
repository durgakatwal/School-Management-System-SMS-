import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">WonderWise</h2>
          <p className="mt-3 text-gray-400 text-sm">
            A modern platform to plan, collaborate and enjoy your journeys with
            ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <a href="#" className="hover:text-orange-500 transition">
            Home
          </a>
          <a href="#" className="hover:text-orange-500 transition">
            About Us
          </a>
          <a href="#" className="hover:text-orange-500 transition">
            Services
          </a>
          <a href="#" className="hover:text-orange-500 transition">
            Contact
          </a>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4 mt-3">
            <a href="#" className="hover:text-orange-500 transition">
              <FaFacebook size={22} />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <FaTwitter size={22} />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <FaLinkedin size={22} />
            </a>
            <a href="#" className="hover:text-orange-500 transition">
              <FaGithub size={22} />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white">Newsletter</h3>
          <p className="text-gray-400 text-sm mt-2">
            Subscribe to get the latest updates.
          </p>
          <form className="mt-4 flex justify-center">
            <div className="flex w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none text-gray-900 border border-white text-white"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-r-lg transition"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} WonderWise. All rights reserved.
      </div>
    </footer>
  );
}
