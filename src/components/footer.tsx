import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Github } from 'lucide-react'
import logo from '../../public/logo.svg';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              {/* <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Installo</span> */}
              <Image src={logo} alt="logo" className="w-12 h-12" />
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Simplify your loan management with smart EMI tracking, automated alerts, 
              and comprehensive financial insights. Take control of your payments today.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                <span className="text-muted-foreground">something@emitracker.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                <span className="text-muted-foreground">+91 xxxx-xxx-xxx</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                <span className="text-muted-foreground">
                  123 Street
                  Mumbai, Maharashtra<br />
                  40001 India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2025 Installo. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        {/* <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center text-muted-foreground text-sm">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              Bank-Grade Security
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              ISO 27001 Certified
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              99.9% Uptime SLA
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  )
}