
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Users, MessageCircle, ChevronRight, ArrowRight, NotepadText } from "lucide-react";
import { Link } from "react-router-dom";
import { Support } from "@/components/Support";
import { Share } from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: "🚀" },
    { id: "features", title: "Features", icon: "✨" },
    { id: "evaluating", title: "Evaluating Notes", icon: "⚡️" },
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
            <p className="text-muted-foreground text-sm sm:text-base">Everything you need to know about using <span className="text-neon-purple">NOTED.</span></p>
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
                This documentation will help you get the most out of NOTED.
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
                        <p className="text-sm text-muted-foreground">Click the "+" button to add your first note. Notes support markdown and can be pinned for quick access.</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20">
                        <h4 className="font-medium mb-2">2. Add Your First Task</h4>
                        <p className="text-sm text-muted-foreground">Use the task section to create actionable items. Check them off as you complete them.</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                        <h4 className="font-medium mb-2">3. Try Focus Mode</h4>
                        <p className="text-sm text-muted-foreground">Use the Pomodoro timer or try Focus Mode to boost your productivity with timed work sessions.</p>
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
                      <h4 className="font-medium mb-2">📝 Take Notes</h4>
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


            <section id="evaluating" className="scroll-mt-6">
              <Card className="glass-strong border-white/20 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border hover:border-neon-purple/50">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3 ">
                    <span className="text-2xl">⚡️</span>
                    <span>Evaluating Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The "Evaluate" toggle is used to parse a new note and evaluate mathematical expressions and Modules.
                  </p>
                  <p>
                    <span className="font-bold pr-1 text-neon-purple">Modules</span> are unique identifiers for various evaluations and are placed inside curly braces <code>{"{}"}</code>. These include:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Weather Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Weather</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>temp</code>, <code>uv</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Fetches information for real time weather based on location.
                      </p>
                    </div>
                    {/* Location Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Location</code></h4>
                      <p className="text-sm text-muted-foreground">
                          Children: <span className="bg-glass-strong text-orange-300"><code>here</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Displays your current coordinates and location using <code>Navigator.geolocation</code>.
                      </p>
                    </div>
                    {/* JS Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>js(...expr)</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>expression</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Evaluates a JavaScript expression and returns the result. Useful for quick calculations or logic. Be careful with commands that can cause side effects, as they will be executed.
                      </p>
                    </div>
                    {/* Math Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Math</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>expression</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Evaluates a mathematical expression and returns the result. Supports basic arithmetic and some functions. It does not need curly braces, as basic expressions are automatically parsed into output.
                        Binary conversion <code>bin(number)</code> and functions like <code>exp(number)</code>, <code>log(number)</code> are also supported.
                      </p>
                    </div>
                    {/* Time Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Time</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>time</code>, <code>day</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Displays the current time or day.
                      </p>
                    </div>
                    {/* Random Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Random</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>number</code>, <code>hash</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Displays a random number or hash. Useful for generating unique identifiers or random values.
                      </p>
                    </div>
                    {/* Encode Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Encode(...string)</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>expression (string)</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Encodes a string using SHA-256 encoding. Useful for obfuscating sensitive information or data.
                      </p>
                    </div>
                    {/* Note Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Note</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>color</code>, <code>size</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Returns information about the new note.
                      </p>
                    </div>
                    {/* Client Module */}
                    <div className="p-4 rounded-lg glass border border-white/10">
                      <h4 className="font-medium mb-2"><code>Client</code></h4>
                      <p className="text-sm text-muted-foreground">
                        Children: <span className="bg-glass-strong text-orange-300"><code>info</code></span>.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Returns information about the client (browser) in Object format.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Other modules include Markdown, Emoji and special word evaluation.
                    </p>
                  {/* Examples */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-neon-purple mb-2">Examples</h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg glass border border-white/10">
                        <code className="block text-neon-blue mb-1">
                          {"{math: 2 + 2 * 5}"}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          Evaluates the math expression and returns <b>12</b>.
                        </span>
                      </div>
                      <div className="p-3 rounded-lg glass border border-white/10">
                        <code className="block text-neon-blue mb-1">
                          {"{js: [1,2,3].map(x => x * 2)}"}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          Runs the JavaScript code and returns <b>[2, 4, 6]</b>.
                        </span>
                      </div>
                      <div className="p-3 rounded-lg glass border border-white/10">
                        <code className="block text-neon-blue mb-1">
                          {"{Weather.temp}"}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          Shows the current temperature for your location.
                        </span>
                      </div>
                      <div className="p-3 rounded-lg glass border border-white/10">
                        <code className="block text-neon-blue mb-1">
                          {"{Location}"}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          Displays your current city and country.
                        </span>
                      </div>
                      <div className="p-3 rounded-lg glass border border-white/10">
                        <code className="block text-neon-blue mb-1">
                          {"{Date}"}
                        </code>
                        <span className="text-xs text-muted-foreground">
                          Shows the current date and time.
                        </span>
                      </div>
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
                      <p className="text-sm text-muted-foreground">If a task takes less than two minutes, do it immediately instead of adding it to your task list (opposite of the <a className="text-neon-purple" href="https://www.todoist.com/productivity-methods/eat-the-frog">eat-the-frog</a> method).</p>
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
                <p className=" p-4 text-sm text-muted-foreground">Find some more (generated) advice <a href="/Productivity Tips.pdf" className="text-neon-purple">here.</a></p>
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
                  <p className="text-muted-foreground mb-4"><span className="text-bold text-neon-purple">Ctrl (Command) + Enter</span> | Save note from editor</p>
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
                  <p className="text-muted-foreground mb-4">Use the  <span className="inline-block"><Share /></span>  Icon to export your notes and/or tasks into various types (Text, MD or JSON). </p>
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
                  <p className="text-muted-foreground mb-4">Common issues and their solutions can be discussed on <a className="text-neon-purple" href="https://github.com/dmarakom6/NOTED./issues">Github</a></p>
                </CardContent>
              </Card>
            </section>
            <section id="support" className="scroll-mt-6">
              <Card className="glass-strong border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl flex items-center space-x-3">
                    <span className="text-2xl">🙏🏻</span>
                    <span>Support my Work</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Donating a small amount helps keep this project alive and supports future development. If you find NOTED. useful, consider supporting my work by pressing on this button:
                  <span className="mt-10 ml-3">
                    <Support />
                  </span>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <NotepadText className="h-4 w-4" />
            <span className="font-bold text-neon-purple">NOTED.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
