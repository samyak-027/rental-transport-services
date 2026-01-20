import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle, Send } from 'lucide-react';
import * as api from '../services/api.js';

const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-800">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export const Support = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const faqs = [
    {
      question: "How do I create an account on RideSurf?",
      answer: "To create an account, click 'Sign Up' in the top navigation, fill in your name, email, and password. You'll receive an OTP via email for verification. Once verified, you can upload your driving license for approval."
    },
    {
      question: "Why do I need to upload my driving license?",
      answer: "We require license verification to ensure the safety and security of our platform. Our admin team reviews each license to confirm it's valid and matches your identity. Only verified users can make bookings."
    },
    {
      question: "How do I search for available vehicles?",
      answer: "On the home page, select your pickup and drop-off locations using our location selector, choose your travel dates and times, then click 'Search Available Vehicles'. You can also browse all vehicles without selecting dates, but you'll need journey details to book."
    },
    {
      question: "Can I view vehicles and prices without logging in?",
      answer: "Yes! You can browse our entire vehicle fleet, view prices, and even see booking summaries without creating an account. However, you'll need to log in and have a verified license to complete the payment and booking process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "Currently, we accept credit and debit cards. You only need to pay 20% of the total amount as advance payment to confirm your booking. The payment form includes validation for card number, expiry date, and CVV."
    },
    {
      question: "How does the booking process work?",
      answer: "1. Select your journey details (locations & dates) 2. Browse and choose a vehicle 3. Review booking summary 4. Login/register if needed 5. Complete payment (20% advance) 6. Receive confirmation email with booking details."
    },
    {
      question: "What happens if my license is rejected?",
      answer: "If your license is rejected, you'll receive an email with the specific reason for rejection. You can then upload new, clearer images of your license. Common reasons include blurry images, expired licenses, or mismatched information."
    },
    {
      question: "Can I modify or cancel my booking?",
      answer: "Booking modifications and cancellations are handled by our admin team. Contact us at surfyourride@gmail.com with your booking details, and we'll assist you with changes or cancellations according to our policy."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and you'll receive an OTP. Use this OTP along with your new password to reset your account access."
    },
    {
      question: "What types of vehicles are available?",
      answer: "We offer a diverse fleet including cars, bikes, SUVs, buses, boats, and even helicopters. You can filter by vehicle type, transmission (automatic/manual), fuel type, number of seats, and price range to find the perfect match."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at surfyourride@gmail.com or use the contact form below. We aim to respond to all inquiries within 24 hours. For urgent matters, please mention 'URGENT' in your subject line."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely! We use industry-standard security measures including JWT authentication, encrypted data transmission, and secure cloud storage. Your payment information is processed through secure payment gateways and never stored on our servers."
    }
  ];

  const handleFAQToggle = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.submitContactForm(contactForm);
      
      if (response.success) {
        setSubmitSuccess(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      alert(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-sky-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-xl opacity-90">
            Find answers to common questions or get in touch with our team
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-3">Get help via email</p>
            <a 
              href="mailto:surfyourride@gmail.com" 
              className="text-primary hover:underline font-medium"
            >
              surfyourride@gmail.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-3">Chat with our team</p>
            <span className="text-gray-500 text-sm">Coming Soon</span>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-3">Call us directly</p>
            <span className="text-gray-500 text-sm">Coming Soon</span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => handleFAQToggle(index)}
              />
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Still Need Help? Contact Us
            </h2>
            
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                Thank you for your message! We'll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Please describe your question or issue in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-sky-600 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              We typically respond within 24 hours. For urgent matters, please mention "URGENT" in your subject line.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;