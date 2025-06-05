
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Users, MessageCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Support } from "@/components/Support";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: "🚀" },
    { id: "features", title: "Features", icon: "✨" },
    { id: "productivity-tips", title: "Productivity Tips", icon: "💡" },
    { id: "shortcuts", title: "Keyboard Shortcuts", icon: "⌨️" },
    { id: "export-import", title: "Export & Import", icon: "📁" },
    { id: "troubleshooting", title: "Troubleshooting", icon: "🔧" },
    { id: "support", title: "Support my Work", icon: "🙏🏻" },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="glass">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              Documentation
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">Everything you need to know about using this app</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-strong border-white/20 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${activeSection === section.id
                          ? 'bg-primary/20 border border-primary/30'
                          : 'hover:bg-white/5'
                        }`}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span className="text-sm font-medium">{section.title}</span>
                      <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="glass rounded-2xl p-6 sm:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-purple to-neon-blue rounded-2xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">Welcome to the Knowledge Base</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                This documentation will help you get the most out of your productivity app.
                Learn about features, tips, and best practices to boost your workflow.
              </p>
            </div>

            {/* Getting Started Section */}
            <section id="getting-started" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">🚀</span>
                    <span>Getting Started</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Setup</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                        <h4 className="font-medium mb-2">1. Create Your First Note</h4>
                        <p className="text-sm text-muted-foreground">Click the "+" button to add your first note. Notes support rich text and can be pinned for quick access.</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                        <h4 className="font-medium mb-2">2. Add Your First Task</h4>
                        <p className="text-sm text-muted-foreground">Use the task section to create actionable items. Check them off as you complete them.</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                        <h4 className="font-medium mb-2">3. Try Focus Mode</h4>
                        <p className="text-sm text-muted-foreground">Use the Pomodoro timer in Focus Mode to boost your productivity with timed work sessions.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Features Section */}
            <section id="features" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <span>Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2">📝 Smart Notes</h4>
                      <p className="text-sm text-muted-foreground">Create, edit, and organize your thoughts with our intuitive note-taking system.</p>
                    </div>
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2">✅ Task Management</h4>
                      <p className="text-sm text-muted-foreground">Keep track of your to-dos and mark them complete when finished.</p>
                    </div>
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2">⏰ Pomodoro Timer</h4>
                      <p className="text-sm text-muted-foreground">Built-in timer for focused work sessions with break reminders.</p>
                    </div>
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2">📌 Pin Important Items</h4>
                      <p className="text-sm text-muted-foreground">Pin up to 3 notes for quick access to your most important information.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Productivity Tips Section */}
            <section id="productivity-tips" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">💡</span>
                    <span>Productivity Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-neon-blue pl-4">
                      <h4 className="font-medium mb-1">Use the Two-Minute Rule</h4>
                      <p className="text-sm text-muted-foreground">If a task takes less than two minutes, do it immediately instead of adding it to your task list.</p>
                    </div>
                    <div className="border-l-4 border-neon-green pl-4">
                      <h4 className="font-medium mb-1">Batch Similar Tasks</h4>
                      <p className="text-sm text-muted-foreground">Group similar activities together to maintain focus and reduce context switching.</p>
                    </div>
                    <div className="border-l-4 border-neon-purple pl-4">
                      <h4 className="font-medium mb-1">Regular Review Sessions</h4>
                      <p className="text-sm text-muted-foreground">Set aside time weekly to review your notes and tasks, archiving completed items.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Remaining sections with placeholder content */}
            <section id="shortcuts" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">⌨️</span>
                    <span>Keyboard Shortcuts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Coming soon - keyboard shortcuts to boost your productivity.</p>
                </CardContent>
              </Card>
            </section>

            <section id="export-import" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">📁</span>
                    <span>Export & Import</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Learn how to backup and transfer your data between devices.</p>
                </CardContent>
              </Card>
            </section>

            <section id="troubleshooting" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">🔧</span>
                    <span>Troubleshooting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Common issues and their solutions will be documented here.</p>
                </CardContent>
              </Card>
            </section>

            {activeSection === "support" && (
              <section id="support" className="scroll-mt-6">
                <Card className="glass-strong border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                      <span className="text-2xl">🙏🏻</span>
                      <span>Support my Work</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* content */}
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Community</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
