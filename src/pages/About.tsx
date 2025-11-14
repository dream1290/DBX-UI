import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Heart,
  Users,
  Plane,
  ArrowRight,
  Award,
  Globe,
  Calendar,
  MapPin,
  Linkedin,
  Mail,
  User,
  Sparkles
} from 'lucide-react';
import teamVisual from '@/assets/team-visual.jpg';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We push the boundaries of what's possible in aviation technology, constantly innovating to solve tomorrow's challenges today."
    },
    {
      icon: Heart,
      title: "Safety Above All",
      description: "Every decision we make prioritizes the safety of pilots, passengers, and ground personnel. Safety isn't just a feature—it's our foundation."
    },
    {
      icon: Users,
      title: "Customer Success",
      description: "Your success is our success. We're not just a technology provider—we're your partner in transforming aviation operations."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "We believe aviation technology should make flying safer and more efficient for everyone, everywhere in the world."
    }
  ];

  const stats = [
    { value: "2019", label: "Founded" },
    { value: "500+", label: "Customers" },
    { value: "2.3M+", label: "Flight Hours Analyzed" },
    { value: "180+", label: "Countries Served" }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      background: "Former NASA engineer and aviation safety expert with 15+ years in aerospace",
      gradient: "from-blue-500 to-cyan-500",
      icon: User,
      linkedin: "#"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder", 
      background: "Ex-Boeing software architect and AI researcher, PhD in Computer Science",
      gradient: "from-purple-500 to-pink-500",
      icon: Sparkles,
      linkedin: "#"
    },
    {
      name: "Dr. Priya Patel",
      role: "VP of Engineering",
      background: "Former Airbus systems engineer, specializing in predictive analytics",
      gradient: "from-green-500 to-emerald-500",
      icon: Target,
      linkedin: "#"
    },
    {
      name: "James Liu",
      role: "VP of Product",
      background: "20+ years in aviation operations, former airline fleet manager",
      gradient: "from-orange-500 to-red-500",
      icon: Award,
      linkedin: "#"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Company Founded",
      description: "Started with a mission to make aviation safer through AI"
    },
    {
      year: "2020",
      title: "First Product Launch",
      description: "Released our flagship predictive maintenance platform"
    },
    {
      year: "2021",
      title: "Major Funding Round",
      description: "Secured $15M Series A to accelerate growth"
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded operations to serve customers in 50+ countries"
    },
    {
      year: "2023",
      title: "AI Breakthrough",
      description: "Achieved 99.9% accuracy in failure prediction"
    },
    {
      year: "2024",
      title: "Industry Leadership",
      description: "Serving 500+ customers worldwide with 2M+ flight hours analyzed"
    }
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
                    item === 'About' ? 'text-foreground font-medium' : ''
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
              <Award className="w-5 h-5 mr-2" />
              About DBX
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">
              Pioneering the
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Future of Flight
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-muted-foreground font-light max-w-3xl mx-auto text-balance">
              We're on a mission to make aviation safer, smarter, and more efficient through the power of artificial intelligence. 
              <span className="text-foreground font-medium"> Every flight should be as safe as possible.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl font-black text-primary">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Our Mission & Values</h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto">
              Built on a foundation of innovation, safety, and customer success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <value.icon className="w-8 h-8 text-primary relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Meet Our Leadership Team</h2>
            <p className="text-base text-muted-foreground">
              Experienced aviation and technology experts leading the future of flight
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm overflow-hidden group">
                <div className="space-y-4">
                  <div className="relative mx-auto">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-xl mx-auto relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),rgba(255,255,255,0))]" />
                      <member.icon className="w-12 h-12 text-white relative z-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.background}</p>
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline" className="px-3">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="px-3">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Our Journey</h2>
            <p className="text-base text-muted-foreground">
              Key milestones in our mission to transform aviation
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-20 text-right">
                    <Badge className="bg-primary text-white">{milestone.year}</Badge>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-6 text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Join Our Mission</h2>
            <p className="text-base text-muted-foreground">
              We're always looking for talented individuals who share our passion for aviation and technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="px-6 font-medium border-2">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;