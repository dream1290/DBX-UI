import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Brain, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock,
  ChevronRight,
  Play,
  Star,
  Globe,
  BarChart3,
  Target,
  Rocket,
  Database,
  ArrowRight
} from 'lucide-react';
import heroImage from '@/assets/hero-aviation.jpg';

const Landing = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    { value: "2.3M+", label: "Flight Hours Analyzed", icon: Clock },
    { value: "150K+", label: "Aircraft Monitored", icon: Plane },
    { value: "99.9%", label: "Prediction Accuracy", icon: Target },
    { value: "180+", label: "Countries Served", icon: Globe }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms predict maintenance needs and optimize flight performance in real-time.",
      color: "text-blue-500"
    },
    {
      icon: Shield,
      title: "Predictive Safety",
      description: "Prevent incidents before they happen with our proprietary risk assessment engine and real-time alerts.",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Live flight tracking with instant anomaly detection and automated emergency response protocols.",
      color: "text-yellow-500"
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "Maximize efficiency with data-driven insights that reduce fuel costs and extend aircraft lifespan.",
      color: "text-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Chief Pilot, AeroTech Solutions",
      content: "This platform transformed our operations. 40% reduction in maintenance costs and zero incidents in 18 months.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Fleet Manager, Global Airways",
      content: "The AI predictions are incredibly accurate. We've prevented 12 potential failures this quarter alone.",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DBX
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'Resources', 'About', 'Blog'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-muted-foreground hover:text-foreground transition-colors story-link"
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="space-y-4">
                <Badge className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
                  <Rocket className="w-4 h-4 mr-2" />
                  Next-Gen Aviation Intelligence
                </Badge>
                
                <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">
                  Fly with
                  <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                    AI Confidence
                  </span>
                </h1>
                
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed font-light max-w-3xl text-balance">
                  Revolutionary aviation platform powered by AI that predicts, protects, and optimizes 
                  every aspect of your flight operations. <span className="text-foreground font-medium">Experience the future of aviation today.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="px-6 py-3 font-medium border-2 hover:bg-primary/5 transition-all duration-300">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Demo
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-3xl blur-xl" />
              <Card className="relative bg-background/50 backdrop-blur-sm border-border/50 p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Flight Analytics</h3>
                    <Badge variant="secondary" className="animate-pulse bg-green-500/20 text-green-500 border-green-500/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Real-time
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg backdrop-blur-sm border border-border/50">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
                        </div>
                        <span className="font-medium">Flight AA-2847</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Optimal</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {stats.slice(2).map((stat, index) => (
                        <div key={index} className="text-center p-4 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 rounded-lg border border-border/30 backdrop-blur-sm">
                          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Database className="w-4 h-4 mr-2" />
              Advanced Features
            </Badge>
            <h2 className="text-2xl font-bold">Intelligent Aviation Solutions</h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with aviation expertise 
              to deliver unprecedented insights and safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="space-y-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center ${feature.color} relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <feature.icon className="w-6 h-6 relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <Link to="/features" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
                    Learn more
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Trusted by Aviation Leaders</h2>
            <p className="text-base text-muted-foreground">
              See how industry leaders are transforming their operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 bg-background/80 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(255,255,255,0))]" />
                      <Users className="w-6 h-6 text-white relative z-10" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-6 text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Ready to Transform Your Aviation Operations?</h2>
            <p className="text-base text-muted-foreground">
              Join thousands of aviation professionals who trust our AI-powered platform 
              for safer, smarter, and more efficient flights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="px-6">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DBX</span>
              </div>
              <p className="text-muted-foreground">
                The future of aviation intelligence, powered by AI.
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Support', links: ['Documentation', 'Help Center', 'Community', 'Status'] }
            ].map((column, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link to={`/${link.toLowerCase()}`} className="text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DBX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;