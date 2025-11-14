import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock,
  User,
  ArrowRight,
  Plane,
  TrendingUp,
  Search,
  Filter,
  Share2,
  Shield,
  BarChart3,
  Activity,
  Scale,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import blogFeatured from '@/assets/blog-featured.jpg';

const Blog = () => {
  const featuredPost = {
    title: "The Future of Predictive Maintenance in Aviation",
    excerpt: "How AI and machine learning are revolutionizing aircraft maintenance, reducing costs by up to 40% while improving safety standards across the industry.",
    author: "Dr. Sarah Chen",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "AI & Technology",
    image: blogFeatured,
    featured: true
  };

  const blogPosts = [
    {
      title: "5 Ways AI is Transforming Flight Safety",
      excerpt: "Explore the latest innovations in aviation safety technology and how they're preventing incidents before they occur.",
      author: "Marcus Rodriguez",
      date: "December 12, 2024",
      readTime: "6 min read",
      category: "Safety",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
      popular: true
    },
    {
      title: "ROI Calculator: Predictive Maintenance Benefits",
      excerpt: "A comprehensive guide to calculating the return on investment for implementing predictive maintenance systems.",
      author: "Priya Patel", 
      date: "December 10, 2024",
      readTime: "10 min read",
      category: "Business",
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Case Study: 45% Cost Reduction at FleetCorp",
      excerpt: "Real-world implementation results showing dramatic improvements in operational efficiency and cost savings.",
      author: "James Liu",
      date: "December 8, 2024", 
      readTime: "12 min read",
      category: "Case Study",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Understanding Aviation Data Analytics",
      excerpt: "A beginner's guide to leveraging flight data for operational insights and performance optimization.",
      author: "Dr. Sarah Chen",
      date: "December 5, 2024",
      readTime: "7 min read", 
      category: "Analytics",
      icon: Activity,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Regulatory Compliance in the Digital Age",
      excerpt: "How modern aviation technology helps maintain compliance while improving operational efficiency.",
      author: "Marcus Rodriguez",
      date: "December 2, 2024",
      readTime: "9 min read",
      category: "Compliance",
      icon: Scale,
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      title: "The Evolution of Flight Operations",
      excerpt: "From manual processes to AI-driven automation: the transformation of modern aviation operations.",
      author: "James Liu",
      date: "November 30, 2024",
      readTime: "11 min read",
      category: "Operations",
      icon: RefreshCw,
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  const categories = [
    "All Posts",
    "AI & Technology", 
    "Safety",
    "Business",
    "Case Study",
    "Analytics",
    "Compliance",
    "Operations"
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
                    item === 'Blog' ? 'text-foreground font-medium' : ''
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
              <TrendingUp className="w-5 h-5 mr-2" />
              Aviation Insights
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">
              Aviation
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-muted-foreground font-light max-w-3xl mx-auto text-balance">
              Insights, trends, and expert analysis from the world of aviation technology. 
              <span className="text-foreground font-medium"> Stay ahead with industry knowledge.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-12">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 py-6 text-lg"
                />
              </div>
              <Button variant="outline" className="px-6 py-6">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((category, index) => (
                <Badge 
                  key={index}
                  variant={index === 0 ? "default" : "secondary"}
                  className={`px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors ${
                    index === 0 ? 'bg-primary text-white' : ''
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-background/80 backdrop-blur-sm border-border/50">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto relative overflow-hidden">
                  <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent lg:hidden" />
                </div>
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">Featured</Badge>
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                    </div>
                    
                    <h2 className="text-3xl lg:text-4xl font-bold leading-tight">{featuredPost.title}</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">{featuredPost.excerpt}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 py-6 text-lg font-semibold">
                    Read Full Article
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <p className="text-base text-muted-foreground">
              Stay updated with the latest insights and trends
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale bg-background/80 backdrop-blur-sm group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${post.gradient} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                    <post.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    {post.popular && (
                      <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-tight">{post.title}</h3>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Button size="sm">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-medium border-2">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-6 text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Stay Updated</h2>
            <p className="text-base text-muted-foreground">
              Get the latest aviation insights and industry trends delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="py-6 text-lg"
              />
              <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;