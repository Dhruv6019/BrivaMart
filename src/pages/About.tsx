import React from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Store, 
  Users, 
  Award, 
  Truck, 
  Shield, 
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Store, label: 'Products', value: '10,000+' },
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: Truck, label: 'Orders Delivered', value: '100,000+' }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'All products come with our quality guarantee and warranty protection.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50 with same-day delivery in select areas.'
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Our customer service team is available round the clock to help you.'
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'We offer competitive pricing with regular discounts and special offers.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">About ShopMart</Badge>
            <h1 className="text-4xl font-bold mb-6">Your Trusted Shopping Partner</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We've been serving customers for over 15 years, providing quality products across 
              Kitchen Ware, Hardware, Gardening Tools, Home Ware, and Mobile Accessories.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2009, ShopMart began as a small family business with a simple mission: 
                  to provide quality products at affordable prices. What started as a single store 
                  has now grown into a comprehensive online marketplace serving customers nationwide.
                </p>
                <p>
                  We specialize in five key categories that cover all your essential needs - from 
                  professional kitchen equipment and reliable hardware tools to beautiful home decor 
                  and the latest mobile accessories.
                </p>
                <p>
                  Our commitment to quality, customer service, and innovation has helped us build 
                  lasting relationships with both customers and suppliers, ensuring we can offer 
                  the best products at competitive prices.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png" 
                alt="Our Store" 
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShopMart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-muted-foreground text-sm">
                  123 Commerce Street<br />
                  Business District<br />
                  City, State 12345
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground text-sm">
                  +1 (555) 123-4567<br />
                  +1 (555) 987-6543
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground text-sm">
                  info@shopmart.com<br />
                  support@shopmart.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Hours</h3>
                <p className="text-muted-foreground text-sm">
                  Mon-Fri: 9:00 AM - 8:00 PM<br />
                  Sat-Sun: 10:00 AM - 6:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;