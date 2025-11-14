import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Video,
  FileText,
  Download,
  Plane,
  ArrowRight,
  Users,
  Lightbulb,
  Code,
  MessageCircle,
  Clock,
  Star,
  Shield,
  TrendingUp,
  Activity,
  Scale,
  RefreshCw
} from 'lucide-react';

const Resources = () => {
  const resourceCategories = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Complete guides and API reference",
      count: "50+ guides",
      gradient: "from-blue-500 to-cyan-500",
      resources: [
        { title: "Getting Started Guide", type: "Guide", duration: "10 min read" },
        { title: "API Reference", type: "Technical", duration: "Complete" },
        { title: "Integration Examples", type: "Code", duration: "Multiple" }
      ]
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      count: "25+ videos",
      gradient: "from-purple-500 to-pink-500",
      resources: [
        { title: "Platform Overview", type: "Video", duration: "15 min" },
        { title: "Advanced Analytics", type: "Webinar", duration: "45 min" },
        { title: "Best Practices", type: "Series", duration: "Multiple" }
      ]
    },
    {
      icon: FileText,
      title: "Case Studies",
      description: "Real-world success stories",
      count: "15+ studies",
      gradient: "from-green-500 to-emerald-500",
      resources: [
        { title: "40% Cost Reduction at AeroTech", type: "Case Study", duration: "8 min read" },
        { title: "Safety Improvements at Global Airways", type: "Case Study", duration: "12 min read" },
        { title: "Fleet Optimization Success", type: "Case Study", duration: "10 min read" }
      ]
    },
    {
      icon: Download,
      title: "Downloads",
      description: "Templates, tools, and resources",
      count: "30+ files",
      gradient: "from-orange-500 to-red-500",
      resources: [
        { title: "ROI Calculator", type: "Tool", duration: "Excel" },
        { title: "Implementation Checklist", type: "Template", duration: "PDF" },
        { title: "Compliance Guide", type: "Document", duration: "PDF" }
      ]
    }
  ];

  const featuredContent = [
    {
      type: "Webinar",
      title: "The Future of AI in Aviation Safety",
      description: "Join our experts for an in-depth discussion on how AI is revolutionizing aviation safety protocols.",
      image: "/api/placeholder/400/200",
      duration: "60 min",
      date: "Dec 15, 2024",
      popular: true
    },
    {
      type: "White Paper",
      title: "Predictive Maintenance ROI Analysis",
      description: "Comprehensive analysis of how predictive maintenance can impact your bottom line.",
      image: "/api/placeholder/400/200",
      duration: "25 min read",
      date: "Dec 10, 2024",
      popular: false
    },
    {
      type: "Case Study",
      title: "How FleetCorp Reduced Maintenance Costs by 45%",
      description: "Real-world implementation story with measurable results and lessons learned.",
      image: "/api/placeholder/400/200",
      duration: "15 min read",
      date: "Dec 5, 2024",
      popular: true
    }
  ];

  const communityResources = [
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Connect with other aviation professionals",
      members: "5,000+ members"
    },
    {
      icon: Users,
      title: "User Groups",
      description: "Local meetups and online events",
      members: "25+ cities"
    },
    {
      icon: Code,
      title: "Developer Hub",
      description: "API docs, SDKs, and code samples",
      members: "500+ developers"
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
                    item === 'Resources' ? 'text-foreground font-medium' : ''
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
              <Lightbulb className="w-5 h-5 mr-2" />
              Knowledge Hub
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">
              Aviation
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Resources
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-muted-foreground font-light max-w-3xl mx-auto text-balance">
              Everything you need to succeed with our platform. From getting started guides to advanced techniques, 
              <span className="text-foreground font-medium"> we've got you covered.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-background/80 backdrop-blur-sm border-border/50 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 via-blue-500/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:rotate-6 transition-transform duration-300`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(255,255,255,0))]" />
                      <category.icon className="w-8 h-8 text-white relative z-10" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                      <Badge variant="secondary" className="mt-2">{category.count}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.resources.map((resource, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <span className="text-sm font-medium">{resource.title}</span>
                        <div className="text-xs text-muted-foreground flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{resource.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    Explore {category.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Featured Content</h2>
            <p className="text-base text-muted-foreground">
              Our most popular and valuable resources
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredContent.map((content, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${index === 0 ? 'from-blue-500 to-cyan-500' : index === 1 ? 'from-purple-500 to-pink-500' : 'from-orange-500 to-red-500'} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {index === 0 && <Video className="w-8 h-8 text-white" />}
                    {index === 1 && <FileText className="w-8 h-8 text-white" />}
                    {index === 2 && <TrendingUp className="w-8 h-8 text-white" />}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{content.type}</Badge>
                    {content.popular && (
                      <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{content.title}</h3>
                    <p className="text-muted-foreground">{content.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{content.duration}</span>
                    <span>{content.date}</span>
                  </div>
                  
                  <Button className="w-full">
                    Access Content
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Resources */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Join the Community</h2>
            <p className="text-base text-muted-foreground">
              Connect, learn, and grow with aviation professionals worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {communityResources.map((resource, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="space-y-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <resource.icon className="w-8 h-8 text-primary relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{resource.title}</h3>
                    <p className="text-muted-foreground">{resource.description}</p>
                    <Badge variant="secondary" className="mt-2">{resource.members}</Badge>
                  </div>
                  <Button className="w-full">
                    Join Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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
            <h2 className="text-2xl font-bold">Can't Find What You're Looking For?</h2>
            <p className="text-base text-muted-foreground">
              Our support team is here to help you succeed with detailed answers to any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Contact Support
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="px-6 font-medium border-2">
                Request Resource
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;