
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, NotepadText, Sparkles, Brain, Compass, HelpCircle, Share2, Settings, Heart, Server, Cloud, ShieldCheck, Box, Terminal, ClipboardCheck, Code2, Clipboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Support } from "@/components/Support";
import { toast } from "@/hooks/use-toast";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", title: "Getting Started", icon: <Sparkles className="w-4 h-4" /> },
    { id: "evaluating", title: "Smart Notes", icon: <Brain className="w-4 h-4" /> },
    { id: "productivity-tips", title: "Productivity", icon: <Compass className="w-4 h-4" /> },
    { id: "self-hosting", title: "Self-Hosting", icon: <Server className="w-4 h-4" /> },
    { id: "support", title: "Support", icon: <Heart className="w-4 h-4" /> },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Command copied to clipboard!" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="glass rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Documentation</h1>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">The NOTED. Docs</p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center space-x-3 ${activeSection === section.id
                    ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                  {section.icon}
                  <span className="text-xs uppercase tracking-wider">{section.title}</span>
                  <ChevronRight className={`h-3 w-3 ml-auto transition-transform ${activeSection === section.id ? 'rotate-90' : 'opacity-30'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12 pb-24">
            {/* Getting Started Section */}
            <section id="getting-started" className="scroll-mt-24 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Getting Started</h2>
                <p className="text-muted-foreground">Your first steps towards a more organized life.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Quick Notes", desc: "Use the Quick Add bar to capture thoughts instantly.", color: "bg-blue-500" },
                  { title: "Task Lists", desc: "Manage your to-dos alongside your notes seamlessly.", color: "bg-green-500" },
                  { title: "Focus Mode", desc: "Enter a distraction-free space for deep work.", color: "bg-primary" }
                ].map((step, i) => (
                  <Card key={i} className="glass border-white/10 p-6 space-y-3">
                    <div className={`w-8 h-8 ${step.color} rounded-lg flex items-center justify-center text-white font-black text-xs`}>{i + 1}</div>
                    <h3 className="font-bold text-sm uppercase tracking-tight">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Smart Notes Section */}
            <section id="evaluating" className="scroll-mt-24 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Smart Notes</h2>
                <p className="text-muted-foreground font-medium">Enable "Evaluate" mode to transform your notes into living documents. Use double braces {"{}"} for modules.</p>
              </div>

              <Card className="glass-strong border-white/10 overflow-hidden">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { name: "LaTeX Math", tag: "{LaTeX(e=mc^2)}", desc: "Renders professional mathematical formulas. Compatible with standard TeX syntax." },
                    { name: "Base System", tag: "{Base(255:10:16)}", desc: "Useful for binary, hex, and octal conversions." },
                    { name: "Memorize", tag: "{Memorize(Question:Answer)}", desc: "A 2-column centered flashcard. The answer is blurred until you hover your mouse." },
                    { name: "Progress Bar", tag: "{Progress(current/total)}", desc: "A sleek visual tracker for study goals, project status, or habit building." },
                    { name: "Weighted Average", tag: "{WeightedAvg((85,2),(95,1))}", desc: "Calculates averages based on weights. Format: (value, weight)." },
                    { name: "Countdown", tag: "{Countdown(2024-12-25)}", desc: "Displays days remaining until a specific date. Shows 'Overdue' if passed." },
                    { name: "JavaScript", tag: "{js(Math.PI * 2)}", desc: "Raw code evaluation for logic or complex transformations. High power, high risk." },
                    { name: "Quotes", tag: "{Quote}", desc: "Inserts a motivational programming quote into your note to keep the productivity high." },
                    { name: "Weather", tag: "{Weather.temp}", desc: "Real-time temperature and UV index based on your current location." },
                    { name: "Time & Date", tag: "{Time.time}", desc: "Current time and date formatting (refreshes on every note view)." }
                  ].map((mod) => (
                    <div key={mod.name} className="space-y-2 group">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1 group-hover:border-primary/20 transition-colors">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary/80">{mod.name}</h4>
                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono font-bold">{mod.tag}</code>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">{mod.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* Self-Hosting Section */}
            <section id="self-hosting" className="scroll-mt-24 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Self-Hosting & Docker</h2>
                <p className="text-muted-foreground font-medium">Deploy NOTED. on your own infrastructure.</p>
              </div>

              <div className="flex flex-wrap flex-col md:flex-row justify-between gap-6">
                <div className="w-full md:flex-1 space-y-4 p-6 glass rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 text-primary">
                    <Box className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Docker Deployment</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    NOTED. is containerized using <strong>Nginx</strong> and <strong>Node 20-alpine</strong>. This makes it extremely lightweight (approx. 20MB compressed). After cloning from the repo, do:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Command</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("docker-compose up -d")}>
                        <Clipboard className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="bg-black/20 dark:bg-black/40 p-4 rounded-xl font-mono text-xs border border-white/5 relative group">
                      <code className="text-primary-foreground/80">docker-compose up -d</code>
                    </div>
                  </div>
                </div>

                <div className="w-full md:flex-1 space-y-4 p-6 glass rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 text-primary">
                    <Cloud className="w-5 h-5" />
                    <h3 className="font-bold text-sm uppercase tracking-wider">Sync Strategy</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    While the app is static, you can achieve cross-device sync by:
                  </p>
                  <ul className="text-[11px] space-y-2 text-muted-foreground">
                    <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 mt-0.5 text-primary" /> Exporting JSON and importing on your new device.</li>
                    <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 mt-0.5 text-primary" /> Self-hosting a private repo and using GitHub Pages.</li>
                    <li className="flex items-start"><ChevronRight className="w-3 h-3 mr-2 mt-0.5 text-primary" /> Modifying the storage layer to point to a private Database.</li>
                  </ul>
                </div>
              </div>

            </section>

            {/* Productivity Tips Section */}
            <section id="productivity-tips" className="scroll-mt-24 space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Productivity</h2>
                <p className="text-muted-foreground font-medium">Core philosophies for high-output work.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "The 2-Minute Rule", desc: "If a task takes less than 2 minutes, do it now. Action over organization." },
                  { title: "Time Batching", desc: "Group similar tasks together. Context switching is the primary enemy of deep focus." },
                  { title: "Pomodoro Protocol", desc: "Commit to 25-minute sprints of absolute focus, followed by a 5-minute break." }
                ].map((tip, i) => (
                  <div key={i} className="flex space-x-6 p-6 rounded-2xl glass border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="w-1.5 h-auto bg-primary rounded-full opacity-20 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-1">
                      <h4 className="font-black text-xs uppercase tracking-widest text-primary/80">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Support */}
            <section id="support" className="scroll-mt-24 pt-12 border-t border-white/5 text-center space-y-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <div className="max-w-md mx-auto space-y-3">
                <h3 className="text-2xl font-black tracking-tight">Support my Work</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Donating a small amount helps keep this project alive and supports future development. Every contribution is deeply appreciated.</p>
              </div>
              <div className="flex justify-center scale-110">
                <Support />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
