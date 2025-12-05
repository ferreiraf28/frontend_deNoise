// Placeholder API functions for deNoise
export interface NewsItem {
  id: string;
  title: string;
  text: string;
  date: string;
}

// Report result structure
export interface ReportResult {
  content: string;
  generatedAt: string;
}

// Podcast result structure
export interface PodcastResult {
  script: string;
  audioUrl: string;
}

// Response result structure (for chatbot answers)
export interface ResponseResult {
  answer: string;
  sources?: Array<{
    title: string;
    snippet: string;
    date: string;
  }>;
}


// Function to fetch news based on time window and custom instructions
export const fetchNews = async (params: {
  range: "daily" | "weekly" | "monthly"; // Time window
  instructions: string; // Instructions (e.g., user query or focus)
}): Promise<NewsItem[]> => {
  console.log("Fetching news with params:", params);

  const mockNewsData: NewsItem[] = [
    {
      id: "1",
      title: "Sample News Article",
      text: "This is a placeholder news article that will be replaced with real data.",
      date: new Date().toISOString(),
    },
  ];

  try {
    // Call the backend to fetch the news (RAG logic will be handled in the backend)
    const response = await fetch(`/api/news?range=${params.range}&instructions=${encodeURIComponent(params.instructions)}`);
    
    // If the response is not OK, return mock data
    if (!response.ok) {
      console.log("API call failed. Returning mock data.");
      return mockNewsData;
    }

    // If successful, return the fetched news data
    const data = await response.json();
    return data;
  } catch (error) {
    // In case of any error, return mock data
    console.error("Error fetching news:", error);
    console.log("Returning mock data.");
    return mockNewsData;
  }
};




// Mock Function to generate the answer based on fetched news and user instructions
export const generateAnswer = async (
  news: NewsItem[], // Fetched news
  userInstructions: string // User's custom instructions (e.g., query or context)
): Promise<ResponseResult> => {
  console.log("Generating answer with news:", news.length, "articles");
  console.log("User instructions:", userInstructions);

  // Simulate answer generation (this is where the answer is generated on the backend)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate the answer (this can be more sophisticated using an LLM)
  const answer = `Here's the answer based on the news articles: ${news[0]?.title}`;

  // Return the generated answer and sources (if available)
  return {
    answer: answer,
    sources: news.map((item) => ({
      title: item.title,
      snippet: item.text,
      date: item.date,
    })),
  };
};




// Mock Function to generate a report based on fetched news
export const generateReport = async (
  news: NewsItem[], // Fetched news
  userInstructions: string // User's custom instructions (e.g., focus areas)
): Promise<ReportResult> => {
  console.log("Generating report with news:", news.length, "articles");
  console.log("User instructions:", userInstructions);

  // Generate a string containing the content of all news articles
  const newsContent = news.map((item) => {
    return `## ${item.title}\n\n${item.text}\n\nDate: ${new Date(item.date).toLocaleDateString()}\n`;
  }).join("\n");

  // Simulate report generation (this is where the report is generated on the backend)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    content: `# Mock Report\n\nThis is a generated report based on ${news.length} news articles.\n\nNews:\n\n${newsContent}\n\nUser instructions: ${userInstructions}`,
    generatedAt: new Date().toISOString(),
  };
};




// Mock Unified function to generate both podcast script and audio
export const generatePodcast = async (
  news: NewsItem[], // Fetched news
  userInstructions: string // User's custom instructions (e.g., tone, focus)
): Promise<PodcastResult> => {
  console.log("Generating podcast script and audio with news:", news.length, "articles");
  console.log("User instructions:", userInstructions);

  // Simulate podcast script and audio generation (this is where the backend processes it)
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Generate a script for the podcast
  const script = `This is a placeholder podcast script based on the news articles: ${news[0]?.title}. The actual implementation will generate a dynamic script based on the user instructions.`;

  // Generate audio URL (this can be replaced with actual audio generation)
  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Placeholder audio URL

  return {
    script: script,
    audioUrl: audioUrl,
  };
};