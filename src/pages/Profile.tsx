import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getUserInstructions, syncUserProfile } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import foxImage from "@/assets/fox.png";

const Profile = () => {
  const { user, loading: authLoading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [systemInstructions, setSystemInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        // Load from local user state first
        setDisplayName(user.display_name || "");
        setSystemInstructions(user.system_instructions || "");
        
        // Try to fetch from backend (CosmosDB)
        try {
          const data = await getUserInstructions(user.id);
          if (data.instructions) {
            setSystemInstructions(data.instructions);
          }
        } catch {
          // Backend not available yet, use local state
          console.log("Backend not available, using local state");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update local state
      await updateProfile({
        display_name: displayName,
        system_instructions: systemInstructions,
      });
      
      await syncUserProfile({ 
        user_id: user.id, 
        email: user.email, 
        display_name: displayName, 
        system_instructions: systemInstructions 
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and custom instructions
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft border">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <img src={foxImage} alt="Profile" className="w-12 h-12 object-contain" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Account Details
                  </CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border">
            <CardHeader className="bg-muted/30">
              <CardTitle>Custom System Instructions</CardTitle>
              <CardDescription>
                These instructions will be appended to all your interactions with deNoise, 
                helping personalize the content to your interests and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="E.g., I prefer objective and short answers..."
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                rows={4}
                className="resize-none h-40 max-h-60 overflow-auto"
              />
              <p className="text-xs text-muted-foreground mt-2">
                These instructions help tailor all generated content to your specific interests and role.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
