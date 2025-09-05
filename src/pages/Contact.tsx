import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  HelpCircle,
  Bug
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Available 24/7 for urgent matters'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: ['support@shopmart.com', 'info@shopmart.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Our Store',
      details: ['123 Commerce Street', 'Business District, City 12345'],
      description: 'Open Monday to Sunday'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 9:00 AM - 8:00 PM', 'Sat-Sun: 10:00 AM - 6:00 PM'],
      description: 'Customer service available'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'support', label: 'Product Support', icon: HelpCircle },
    { value: 'order', label: 'Order Related', icon: Phone },
    { value: 'bug', label: 'Report Issue', icon: Bug }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Contact Us</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question or need help? We're here to assist you. 
              Reach out to us and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 order-last lg:order-first">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Get in Touch</h2>
              <div className="space-y-4 md:space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <div className="bg-primary/10 p-2 md:p-3 rounded-lg flex-shrink-0">
                          <info.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">{info.title}</h3>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-xs md:text-sm">
                              {detail}
                            </p>
                          ))}
                          <p className="text-xs text-muted-foreground mt-1 md:mt-2">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="h-10"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="h-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label htmlFor="category" className="text-sm">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                <div className="flex items-center space-x-2">
                                  <cat.icon className="h-4 w-4" />
                                  <span>{cat.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-sm">Subject</Label>
                        <Input
                          id="subject"
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Brief subject of your message"
                          className="h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please describe your inquiry in detail..."
                        rows={4}
                        className="resize-none"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="mt-4 md:mt-6">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Quick Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm md:text-base">Common Questions:</h4>
                      <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
                        <li>• How to track my order?</li>
                        <li>• What's your return policy?</li>
                        <li>• Shipping and delivery information</li>
                        <li>• Payment methods accepted</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm md:text-base">Quick Actions:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm h-8 md:h-9">
                          <Phone className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Request Callback
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start text-xs md:text-sm h-8 md:h-9">
                          <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Live Chat Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;