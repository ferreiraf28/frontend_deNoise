import { Link } from "react-router-dom";
import { MessageSquare, FileText, Mic, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Conversational Agent",
    description: "Ask questions and get intelligent answers powered by our RAG pipeline with source citations.",
    icon: MessageSquare,
    link: "/chat",
    color: "from-primary to-primary-glow",
  },
  {
    title: "Report Generator",
    description: "Generate personalized daily or weekly reports tailored to your interests and focus areas.",
    icon: FileText,
    link: "/report",
    color: "from-accent to-primary",
  },
  {
    title: "Podcast Generator",
    description: "Transform curated news into engaging audio podcasts with custom instructions and themes.",
    icon: Mic,
    link: "/podcast",
    color: "from-primary-glow to-accent",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground mb-4">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Startup Ecosystem Intelligence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              deNoise
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay ahead in the startup ecosystem with AI-curated news and insights tailored specifically for
            entrepreneurship hubs, investors, and innovation enthusiasts.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.link}>
                  <Button className="w-full group/btn" variant="outline">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-card rounded-2xl shadow-soft p-8 md:p-12 border">
          <h2 className="text-3xl font-bold mb-6">What makes deNoise different?</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-3">Intelligent Curation</h3>
              <p>
                Our advanced RAG pipeline filters through thousands of news sources to deliver only the most relevant
                information for your specific interests and industry focus.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-3">Personalized Insights</h3>
              <p>
                Customize every feature with your own instructions to ensure the content matches your unique needs,
                whether you're tracking deep tech, European startups, or specific sectors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-3">Multiple Formats</h3>
              <p>
                Consume information in the way that works best for you - through conversational chat, structured
                reports, or engaging audio podcasts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-3">Always Up-to-Date</h3>
              <p>
                Stay current with daily, weekly, or monthly digests that keep you informed without overwhelming you
                with noise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
