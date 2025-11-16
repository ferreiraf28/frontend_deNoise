import { useState, useRef } from "react";
import { Mic, Loader2, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { fetchNews, generatePodcastScript, generatePodcastAudio } from "@/services/api";
import { toast } from "sonner";

const Podcast = () => {
  const [timeWindow, setTimeWindow] = useState<"weekly" | "monthly">("weekly");
  const [instructions, setInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGeneratePodcast = async () => {
    setIsLoading(true);
    try {
      const news = await fetchNews({
        range: timeWindow === "weekly" ? "weekly" : "monthly",
      });
      const script = await generatePodcastScript(news, instructions);
      const audio = await generatePodcastAudio(script);
      setAudioUrl(audio);
      toast.success("Podcast generated successfully!");
    } catch (error) {
      console.error("Error generating podcast:", error);
      toast.error("Failed to generate podcast. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Podcast Generator</h1>
          <p className="text-muted-foreground">
            Transform curated startup news into engaging audio podcasts with custom themes and focus areas.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1 shadow-soft border h-fit">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Configuration
              </CardTitle>
              <CardDescription>Customize your podcast settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="time-window">Time Window</Label>
                <Select
                  value={timeWindow}
                  onValueChange={(value: "weekly" | "monthly") => setTimeWindow(value)}
                >
                  <SelectTrigger id="time-window">
                    <SelectValue placeholder="Select time window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Last Week</SelectItem>
                    <SelectItem value="monthly">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="podcast-instructions">Custom Instructions</Label>
                <Textarea
                  id="podcast-instructions"
                  placeholder="E.g., Focus on deep tech in Europe, conversational tone, include market analysis..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Specify themes, tone, and focus areas for your podcast
                </p>
              </div>

              <Button
                onClick={handleGeneratePodcast}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Generate Podcast
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Audio Player */}
          <Card className="lg:col-span-2 shadow-soft border">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Podcast Player</CardTitle>
              <CardDescription>
                {audioUrl ? "Your podcast is ready to play" : "Your podcast will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!audioUrl ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <Mic className="h-16 w-16 mb-4 text-muted-foreground/50" />
                  <p className="text-lg mb-2">No podcast generated yet</p>
                  <p className="text-sm">Configure your settings and click Generate Podcast to start</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Album Art Placeholder */}
                  <div className="aspect-square bg-gradient-to-br from-primary via-primary-glow to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <Volume2 className="h-24 w-24 text-white/80" />
                  </div>

                  {/* Audio Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />

                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={togglePlayPause}
                        size="lg"
                        className="rounded-full w-16 h-16"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6 ml-1" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
