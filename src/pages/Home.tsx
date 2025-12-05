import { Link } from "react-router-dom";
import { MessageSquare, FileText, Mic, ArrowRight, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import foxImage from "@/assets/fox.png";

const features = [
  {
    title: "Conversational Agent",
    description: "Ask questions and get intelligent answers powered by our RAG pipeline with source citations.",
    icon: MessageSquare,
    link: "/chat",
  },
  {
    title: "Report Generator",
    description: "Generate personalized daily or weekly reports tailored to your interests and focus areas.",
    icon: FileText,
    link: "/report",
  },
  {
    title: "Podcast Generator",
    description: "Transform curated news into engaging audio podcasts with custom instructions and themes.",
    icon: Mic,
    link: "/podcast",
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm font-medium text-foreground mb-4">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Startup Ecosystem Intelligence</span>
            </div>
            <div className="flex items-center justify-center gap-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                Welcome to{" "}
                <span className="text-primary">
                  deNoise
                </span>
              </h1>
              <img 
                src={foxImage} 
                alt="deNoise Fox Mascot" 
                className="w-32 h-32 object-contain animate-bounce flex-shrink-0"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stay ahead in the startup ecosystem with AI-curated news and insights tailored specifically for
              entrepreneurship hubs, investors, and innovation enthusiasts.
            </p>
            {!user && (
              <div className="flex justify-center gap-4 pt-4">
                <Link to="/auth">
                  <Button size="lg">Log-in here</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/50"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
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
            <h2 className="text-3xl font-bold mb-6">
              What makes <span className="text-primary">deNoise</span> different?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
              <div className="bg-background p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                <h3 className="font-semibold text-foreground text-lg mb-3">Intelligent Curation</h3>
                <p>
                  Our advanced RAG pipeline filters through thousands of news sources to deliver only the most relevant
                  information for your specific interests and industry focus.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                <h3 className="font-semibold text-foreground text-lg mb-3">Personalized Insights</h3>
                <p>
                  Customize every feature with your own instructions to ensure the content matches your unique needs,
                  whether you're tracking deep tech, European startups, or specific sectors.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                <h3 className="font-semibold text-foreground text-lg mb-3">Multiple Formats</h3>
                <p>
                  Consume information in the way that works best for you - through conversational chat, structured
                  reports, or engaging audio podcasts.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
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

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={foxImage} alt="deNoise Fox" className="w-16 h-16 object-contain" />
              <div>
                <h3 className="font-bold text-xl">deNoise</h3>
                <p className="text-primary-foreground/80 text-sm">
                  Cutting through the noise, one newsletter at a time
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-primary-foreground/90 mb-2">
                Built by 4 Data Science students passionate about innovation
              </p>
              <a 
                href="mailto:klferreira28@gmail.com" 
                className="inline-flex items-center gap-2 text-sm hover:underline"
              >
                <Mail className="h-4 w-4" />
                klferreira28@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
