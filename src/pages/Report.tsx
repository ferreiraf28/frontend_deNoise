import { useState } from "react";
import { FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchNews, generateReport, ReportResult } from "@/services/api";
import { toast } from "sonner";

const Report = () => {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [topicInstructions, setTopicInstructions] = useState("");
  const [structureInstructions, setStructureInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportResult | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const combinedInstructions = `Topics: ${topicInstructions}\n\nStructure: ${structureInstructions}`;
      const news = await fetchNews({ range: timeRange, instructions: combinedInstructions });
      const result = await generateReport(news, combinedInstructions);
      setReport(result);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Report Generator</h1>
          <p className="text-muted-foreground">
            Generate personalized reports based on curated startup news tailored to your preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1 shadow-soft border h-fit">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Configuration
              </CardTitle>
              <CardDescription>Customize your report settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="time-range">Time Range</Label>
                <Select
                  value={timeRange}
                  onValueChange={(value: "daily" | "weekly" | "monthly") => setTimeRange(value)}
                >
                  <SelectTrigger id="time-range">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic-instructions">Topics to Include</Label>
                <Textarea
                  id="topic-instructions"
                  placeholder="E.g., Focus on deep tech startups in Europe, highlight funding rounds above $10M, include AI and climate tech..."
                  value={topicInstructions}
                  onChange={(e) => setTopicInstructions(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Specify the topics and themes you want covered
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="structure-instructions">Report Structure</Label>
                <Textarea
                  id="structure-instructions"
                  placeholder="E.g., Executive summary first, then sector breakdown, include bullet points for key takeaways, end with market trends..."
                  value={structureInstructions}
                  onChange={(e) => setStructureInstructions(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Define the sections and format of your report
                </p>
              </div>

              <Button
                onClick={handleGenerateReport}
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
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Report Display */}
          <Card className="lg:col-span-2 shadow-soft border">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle><span className="text-primary">deNoised</span> Report</CardTitle>
                  <CardDescription>
                    {report
                      ? `Generated on ${new Date(report.generatedAt).toLocaleString()}`
                      : "Your report will appear here"}
                  </CardDescription>
                </div>
                {report && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!report ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4 text-muted-foreground/50" />
                  <p className="text-lg mb-2">No report generated yet</p>
                  <p className="text-sm">Configure your settings and click Generate Report to start</p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div
                    className="bg-secondary/30 rounded-lg p-6 min-h-[500px] whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: report.content.replace(/\n/g, "<br />").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/^## (.+)$/gm, "<h2>$1</h2>"),
                    }}
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

export default Report;
