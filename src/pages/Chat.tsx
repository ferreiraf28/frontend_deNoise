import { useState } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage, clearChatSession } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import foxImage from "@/assets/fox.png";

const Chat = () => {
  const { user } = useAuth();

  // 1. CONNECT TO GLOBAL STATE
  // We use the global state instead of local useState so messages survive navigation
  const { chatHistory, setChatHistory } = useGlobalState();
  
  // Aliases to keep the rest of the logic identical
  const messages = chatHistory;
  const setMessages = setChatHistory;

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const userId = user?.id || "anonymous";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    const userMessageObject = { role: "user" as const, content: userMessageContent };

    setInput("");
    
    // Optimistically update UI
    setMessages((prev) => [...prev, userMessageObject]);
    setIsLoading(true);

    try {
      // 1. Define what the API response looks like
      interface ChatApiResponse {
        response: string;
        sources?: Array<{
          title: string;
          snippet: string;
          date: string;
        }>;
      }

      // 2. Cast the result to that type
      const result = (await sendChatMessage(userMessageContent, userId)) as ChatApiResponse;
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.response,
          // Map sources if they exist, otherwise empty array
          sources: result.sources || [] 
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (isClearing) return;
    
    setIsClearing(true);
    try {
      await clearChatSession(userId);
      // Clearing the global state updates it for all pages
      setMessages([]); 
      toast.success("Chat cleared");
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast.error("Failed to clear chat");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] bg-background flex flex-col">
      {/* Chat Header */}
      <div className="border-b bg-muted/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={foxImage} alt="deNoiser" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-xl font-semibold">
              The <span className="text-primary">deNoiser</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your AI assistant for entrepreneurship intelligence
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          disabled={isClearing || messages.length === 0}
          className="text-muted-foreground hover:text-foreground"
        >
          {isClearing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Trash2 className="h-4 w-4 mr-1" />
          )}
          Clear Chat
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4">
        <div className="max-w-4xl mx-auto py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground">
              <img src={foxImage} alt="deNoiser" className="w-24 h-24 object-contain mb-6 opacity-60" />
              <p className="text-xl mb-2 font-medium">Hey there! I'm the deNoiser 🦊</p>
              <p className="text-sm max-w-md">
                Ask me anything about the startup ecosystem and I'll find the most relevant news for you.
              </p>
              <p className="text-xs mt-4 text-muted-foreground/60">
                e.g. "What are the latest updates on OpenAI?"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="space-y-3">
                  <div
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <img src={foxImage} alt="deNoiser" className="w-8 h-8 object-contain mr-3 mt-1" />
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>

                  {/* Source Cards */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="ml-11 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">Sources:</p>
                      <div className="grid gap-2">
                        {message.sources.map((source, sourceIndex) => (
                          <Card key={sourceIndex} className="bg-muted/50 border-l-2 border-primary">
                            <CardContent className="p-3">
                              <p className="text-sm font-medium mb-1">{source.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">{source.snippet}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(source.date).toLocaleDateString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <img src={foxImage} alt="deNoiser" className="w-8 h-8 object-contain mr-3 mt-1" />
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind? Type here..."
              disabled={isLoading}
              className="flex-1 h-12 text-base"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="lg" className="h-12 px-6">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;