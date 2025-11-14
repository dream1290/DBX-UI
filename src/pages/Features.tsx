import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Shield, 
  Zap, 
  TrendingUp, 
  Plane,
  Database,
  MapPin,
  Clock,
  Target,
  Users,
  Globe,
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Predictive Analytics",
      description: "Advanced machine learning algorithms analyze flight patterns, weather data, and aircraft performance to predict maintenance needs up to 6 months in advance.",
      benefits: ["99.9% accuracy", "Reduce maintenance costs by 40%", "Prevent 95% of failures"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Real-Time Safety Monitoring",
      description: "Continuous monitoring of flight parameters with instant anomaly detection and automated emergency response protocols.",
      benefits: ["24/7 monitoring", "Instant alerts", "Emergency protocols"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Data-driven insights to optimize fuel consumption, flight routes, and operational efficiency across your entire fleet.",
      benefits: ["30% fuel savings", "Optimized routes", "Fleet-wide insights"],
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive reporting and visualization tools that transform complex flight data into actionable business intelligence.",
      benefits: ["Real-time dashboards", "Custom reports", "Business intelligence"],
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const additionalFeatures = [
    { icon: Database, title: "Big Data Processing", description: "Process terabytes of flight data in real-time" },
    { icon: MapPin, title: "Global Coverage", description: "Worldwide flight tracking and monitoring" },
    { icon: Clock, title: "Historical Analysis", description: "Deep insights from years of flight history" },
    { icon: Target, title: "Precision Forecasting", description: "Accurate predictions for maintenance and operations" },
    { icon: Users, title: "Team Collaboration", description: "Multi-user access with role-based permissions" },
    { icon: Globe, title: "API Integration", description: "Seamless integration with existing systems" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/50 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DBX
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'Resources', 'About', 'Blog'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className={`text-muted-foreground hover:text-foreground transition-colors story-link ${
                    item === 'Features' ? 'text-foreground font-medium' : ''
                  }`}
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
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <Badge className="px-6 py-3 bg-primary/10 text-primary border-primary/20 text-base">
              <BarChart3 className="w-5 h-5 mr-2" />
              Comprehensive Feature Suite
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">
              Powerful Features for
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Modern Aviation
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-muted-foreground font-light max-w-3xl mx-auto text-balance">
              Discover how our AI-powered platform transforms every aspect of aviation operations with 
              <span className="text-foreground font-medium"> cutting-edge technology and intelligent automation.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-background/80 backdrop-blur-sm border-border/50 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="space-y-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:rotate-6 transition-transform duration-300`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(255,255,255,0))]" />
                    <feature.icon className="w-8 h-8 text-white relative z-10" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Complete Aviation Suite</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage modern aviation operations efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <feature.icon className="w-6 h-6 text-primary relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
            <h2 className="text-2xl font-bold">Ready to Experience These Features?</h2>
            <p className="text-base text-muted-foreground">
              Start your free trial today and see how our platform can transform your aviation operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="px-6 font-medium border-2">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;