import { useState, useRef } from "react";
import { Mic, Loader2, Play, Pause, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { generatePodcast } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import foxImage from "@/assets/fox.png";

const Podcast = () => {
  const { user } = useAuth();
  const [timeWindow, setTimeWindow] = useState<string>("monthly");
  const [topicInstructions, setTopicInstructions] = useState("");
  const [structureInstructions, setStructureInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const userId = user?.id || "anonymous";

  const handleGeneratePodcast = async () => {
    if (!topicInstructions.trim()) {
      toast.error("Please enter topics to generate a podcast");
      return;
    }

    setIsLoading(true);
    try {
      const result = await generatePodcast({
        topics: topicInstructions.trim(),
        time_range: timeWindow,
        structure: structureInstructions.trim() || "interview_style",
        user_id: userId,
      });

      setAudioUrl(result.audio_url);

      toast.success("Podcast generated successfully!");
    } catch (error) {
      console.error("Error generating podcast:", error);
      toast.error("Failed to generate podcast. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW DOWNLOAD FUNCTION ---
  const handleDownloadMp3 = () => {
    if (!audioUrl) return;

    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `denoised_podcast_${new Date().toISOString().split('T')[0]}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Downloading podcast MP3...");
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
    if (!time || isNaN(time)) return "0:00";
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
                  onValueChange={setTimeWindow}
                >
                  <SelectTrigger id="time-window">
                    <SelectValue placeholder="Select time window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Last Day</SelectItem>
                    <SelectItem value="weekly">Last Week</SelectItem>
                    <SelectItem value="monthly">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic-instructions">Topics to Cover</Label>
                <Textarea
                  id="topic-instructions"
                  placeholder="E.g., Focus on deep tech in Europe, AI breakthroughs, climate tech investments..."
                  value={topicInstructions}
                  onChange={(e) => setTopicInstructions(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Specify the topics and themes for your podcast
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="structure-instructions">Podcast Structure & Length</Label>
                <Textarea
                  id="structure-instructions"
                  placeholder="E.g., 10-minute episode, conversational tone, start with headlines then deep dive into top 3 stories, include market analysis..."
                  value={structureInstructions}
                  onChange={(e) => setStructureInstructions(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Define the format, length, and structure
                </p>
              </div>

              <Button
                onClick={handleGeneratePodcast}
                disabled={isLoading || !topicInstructions.trim()}
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
            {/* UPDATED HEADER: Matches Report.tsx Layout */}
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle><span className="text-primary">deNoised</span> Podcast</CardTitle>
                  <CardDescription>
                    {audioUrl ? "Your podcast is ready to play" : "Your podcast will appear here"}
                  </CardDescription>
                </div>
                
                {/* Download Button - Identical styling to Report Export Button */}
                {audioUrl && (
                  <Button variant="outline" size="sm" onClick={handleDownloadMp3}>
                    <Download className="h-4 w-4 mr-2" />
                    Download MP3
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!audioUrl ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <img src={foxImage} alt="deNoise" className="w-24 h-24 object-contain mb-4 opacity-50" />
                  <p className="text-lg mb-2">No podcast generated yet</p>
                  <p className="text-sm">Configure your settings and click Generate Podcast to start</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Album Art */}
                  <div className="aspect-square max-w-xs mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <img src={foxImage} alt="deNoise Podcast" className="w-32 h-32 object-contain" />
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
                        className="rounded-full w-16 h-16 shadow-lg hover:scale-105 transition-transform"
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