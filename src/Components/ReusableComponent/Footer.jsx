import { motion } from "framer-motion";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Mic,
  FileText,
  History,
  Zap
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.footer 
      className="footer mt-auto"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">SpeechAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional speech-to-text solutions powered by advanced AI technology. 
              Convert audio to text with precision and ease.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                className="text-slate-400 hover:text-white transition-colors duration-300"
                variants={linkVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="footer-section-title">Features</h3>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="#features" 
                  className="footer-link flex items-center space-x-2"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Mic className="w-4 h-4" />
                  <span>Live Transcription</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#features" 
                  className="footer-link flex items-center space-x-2"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <FileText className="w-4 h-4" />
                  <span>File Upload</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#features" 
                  className="footer-link flex items-center space-x-2"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <History className="w-4 h-4" />
                  <span>History Management</span>
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#features" 
                  className="footer-link flex items-center space-x-2"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  <Zap className="w-4 h-4" />
                  <span>AI-Powered</span>
                </motion.a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="footer-section-title">Support</h3>
            <ul className="space-y-3">
              <li>
                <motion.a 
                  href="#help" 
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  Help Center
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#docs" 
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  Documentation
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#api" 
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  API Reference
                </motion.a>
              </li>
              <li>
                <motion.a 
                  href="#status" 
                  className="footer-link"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  System Status
                </motion.a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-section-title">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">support@speechai.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="text-slate-400 text-sm">
                  123 Tech Street<br />
                  San Francisco, CA 94105
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {currentYear} SpeechAI. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <motion.a 
                href="#privacy" 
                className="footer-link text-sm"
                variants={linkVariants}
                whileHover="hover"
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                href="#terms" 
                className="footer-link text-sm"
                variants={linkVariants}
                whileHover="hover"
              >
                Terms of Service
              </motion.a>
              <motion.a 
                href="#cookies" 
                className="footer-link text-sm"
                variants={linkVariants}
                whileHover="hover"
              >
                Cookie Policy
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
