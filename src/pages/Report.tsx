import { useState, useRef } from "react";
import { FileText, Loader2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown"; 
import html2pdf from "html2pdf.js"; 
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateReport } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import foxImage from "@/assets/fox.png";

interface ReportResult {
  content: string;
  generatedAt: string;
}

const Report = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<string>("weekly");
  const [topicInstructions, setTopicInstructions] = useState("");
  const [structureInstructions, setStructureInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ReportResult | null>(null);

  const reportContentRef = useRef<HTMLDivElement>(null);

  const userId = user?.id || "anonymous";

  const handleGenerateReport = async () => {
    if (!topicInstructions.trim()) {
      toast.error("Please enter topics to generate a report");
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateReport({
        topics: topicInstructions.trim(),
        time_range: timeRange,
        structure: structureInstructions.trim() || "executive_summary",
        user_id: userId,
      });
      
      setReport({
        content: result.report,
        generatedAt: result.timestamp,
      });
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = () => {
    const element = reportContentRef.current;
    if (!element) return;

    const opt: any = {
      margin:       [0.5, 0.5],
      filename:     `denoised_report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    toast.success("Downloading report...");
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
                  onValueChange={setTimeRange}
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
                  <Button variant="outline" size="sm" onClick={handleExportPdf}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {!report ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <img src={foxImage} alt="deNoise" className="w-24 h-24 object-contain mb-4 opacity-50" />
                  <p className="text-lg mb-2">No report generated yet</p>
                  <p className="text-sm">Configure your settings and click Generate Report to start</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* The report container */}
                  <div 
                    ref={reportContentRef} 
                    className="bg-secondary/30 rounded-lg p-6 min-h-[500px]"
                  >
                    <div className="prose max-w-none dark:prose-invert">
                      <ReactMarkdown
                        components={{
                          // H1 ( # Title )
                          h1: ({...props}) => <h1 className="text-3xl font-bold mt-6 mb-4 text-primary" {...props} />,
                          // H2 ( ## Section )
                          h2: ({...props}) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground border-b pb-2" {...props} />,
                          // H3 ( ### Subsection / Key Takeaways ) -> This fixes your specific issue
                          h3: ({...props}) => <h3 className="text-xl font-bold mt-5 mb-2 text-foreground" {...props} />,
                          // Bold Text ( **text** )
                          strong: ({...props}) => <strong className="font-bold text-foreground" {...props} />,
                          // Lists
                          ul: ({...props}) => <ul className="list-disc pl-5 space-y-2 my-4" {...props} />,
                          li: ({...props}) => <li className="pl-1" {...props} />,
                        }}
                      >
                        {report.content}
                      </ReactMarkdown>
                    </div>
                  </div>
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