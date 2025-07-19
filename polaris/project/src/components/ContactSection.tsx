import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-24 px-6" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text animated-gradient">
            Contact Us
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Ready to make your digital experiences accessible to everyone? Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <p className="text-white/80 leading-relaxed">
                Our accessibility experts are here to help you create inclusive digital experiences. 
                Whether you need a consultation, have questions about compliance, or want to learn 
                more about Polaris, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-white/60">hello@polaris-ai.com</div>
                  <div className="text-white/40 text-sm">General inquiries & support</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">Phone</div>
                  <div className="text-white/60">+1 (555) 123-4567</div>
                  <div className="text-white/40 text-sm">Mon-Fri 9AM-6PM PST</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">Address</div>
                  <div className="text-white/60">123 Innovation Drive</div>
                  <div className="text-white/60">San Francisco, CA 94105</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Send us a message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="Your Company"
                />
              </div>
              
              <div>
                <label className="block text-white/80 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your accessibility needs..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;