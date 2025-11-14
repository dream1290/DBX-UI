import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X,
  Plane,
  ArrowRight,
  Zap,
  Crown,
  Building
} from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "49",
      period: "per aircraft/month",
      description: "Perfect for small operators and flight schools",
      features: [
        "Up to 5 aircraft",
        "Basic flight tracking",
        "Monthly reports",
        "Email support",
        "Standard analytics",
        "24/7 monitoring"
      ],
      limitations: [
        "Advanced AI predictions",
        "Real-time alerts",
        "Custom integrations",
        "Phone support"
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Professional",
      icon: Crown,
      price: "149",
      period: "per aircraft/month",
      description: "Ideal for growing aviation businesses",
      features: [
        "Up to 50 aircraft",
        "Advanced AI predictions",
        "Real-time alerts & monitoring",
        "Weekly reports & analytics",
        "Priority email & phone support",
        "Custom dashboards",
        "API access",
        "Maintenance forecasting",
        "Risk assessment"
      ],
      limitations: [
        "Unlimited aircraft",
        "White-label options"
      ],
      gradient: "from-purple-500 to-pink-500",
      popular: true
    },
    {
      name: "Enterprise",
      icon: Building,
      price: "Custom",
      period: "contact for pricing",
      description: "For large operators and airlines",
      features: [
        "Unlimited aircraft",
        "Full AI suite",
        "24/7 dedicated support",
        "Custom integrations",
        "White-label options",
        "On-premise deployment",
        "Advanced security",
        "Custom training",
        "SLA guarantees",
        "Dedicated account manager"
      ],
      limitations: [],
      gradient: "from-orange-500 to-red-500",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "What's included in the free trial?",
      answer: "The 30-day free trial includes full access to all Professional plan features with up to 3 aircraft."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees for any plan. We'll help you get started with free onboarding and training."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, ACH transfers, and wire transfers for enterprise customers."
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
                    item === 'Pricing' ? 'text-foreground font-medium' : ''
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
              <Crown className="w-5 h-5 mr-2" />
              Simple, Transparent Pricing
            </Badge>
            
            <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight">
              Choose Your
              <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Aviation Plan
              </span>
            </h1>
            
            <p className="text-base lg:text-lg text-muted-foreground font-light max-w-3xl mx-auto text-balance">
              Scale with confidence. No hidden fees, no long-term commitments. 
              <span className="text-foreground font-medium"> Start free, upgrade when you're ready.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-background/80 backdrop-blur-sm border-border/50 group overflow-hidden ${plan.popular ? 'border-primary/50 shadow-lg' : ''}`}>
                {plan.popular && (
                  <>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  </>
                )}
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg relative overflow-hidden group-hover:rotate-6 transition-transform duration-300`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(255,255,255,0))]" />
                      <plan.icon className="w-8 h-8 text-white relative z-10" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-4xl font-black">${plan.price}</span>
                        {plan.price !== 'Custom' && <span className="text-muted-foreground">/{plan.period.split('/')[1]}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.period}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-center space-x-3 opacity-50">
                          <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm line-through">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={plan.price === 'Custom' ? '/contact' : '/register'} className="w-full">
                    <Button
                      className={`w-full py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl' 
                          : 'variant-outline border-2'
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-base text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 bg-background/80 backdrop-blur-sm">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
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
            <h2 className="text-2xl font-bold">Ready to Transform Your Operations?</h2>
            <p className="text-base text-muted-foreground">
              Join thousands of aviation professionals who trust our platform. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="mailto:sales@dbx-aviation.com">
                <Button variant="outline" className="px-6 font-medium border-2">
                  Contact Sales
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;