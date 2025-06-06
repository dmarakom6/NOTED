
import { DollarSign, Github, Twitter, Coffee, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const Support = () => {
  const socialLinks = [
    {
      name: "GitHub Profile",
      icon: Github,
      url: "https://github.com/dmarakom6",
      description: "Follow my work"
    },
    {
      name: "Twitter (X)",
      icon: Twitter,
      url: "https://x.com/dimitrismarako",
      description: "Stay updated"
    }
  ];

  const supportLinks = [
    {
      name: "Buy me a coffee",
      icon: Coffee,
      url: "https://buymeacoffee.com/dimitrismarako",
      description: "Support development",
      highlight: true
    },
    {
      name: "GitHub Sponsors",
      icon: Heart,
      url: "https://github.com/sponsors/dmarakom6",
      description: "Monthly support"
    }
  ];

  const projectUrl = "https://github.com/dmarakom6/NOTED.";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-strong backdrop-blur-lg border border-white/20" side="bottom" align="end">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-glow">Support NOTED.</h3>
            <p className="text-sm text-muted-foreground">
              Help keep this project free and open source
            </p>
          </div>

          {/* Project Repository */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Project</h4>
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg glass hover:glass-strong transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <Github className="h-5 w-5 text-neon-blue" />
                <div>
                  <div className="font-medium">View Source Code</div>
                  <div className="text-xs text-muted-foreground">Star the repository</div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Support Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Support Development</h4>
            <div className="space-y-2">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 group ${
                    link.highlight 
                      ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple/30 hover:border-neon-purple/50' 
                      : 'glass hover:glass-strong'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className={`h-5 w-5 ${link.highlight ? 'text-neon-purple' : 'text-neon-green'}`} />
                    <div>
                      <div className="font-medium">{link.name}</div>
                      <div className="text-xs text-muted-foreground">{link.description}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Connect</h4>
            <div className="space-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg glass hover:glass-strong transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <link.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{link.name}</div>
                      <div className="text-xs text-muted-foreground">{link.description}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground text-center">
              Thank you for using NOTED. 💜
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
