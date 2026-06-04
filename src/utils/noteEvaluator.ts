
// ASCII to Unicode emoji mapping
const emojiMap: Record<string, string> = {
  ':)': '😊',
  ':-)': '😊',
  ':(': '😢',
  ':-(': '😢',
  ':D': '😃',
  ':-D': '😃',
  ';)': '😉',
  ';-)': '😉',
  ':P': '😛',
  ':-P': '😛',
  ':o': '😮',
  ':-o': '😮',
  '<3': '❤️',
  '</3': '💔',
  ':thumbsup:': '👍',
  ':thumbsdown:': '👎',
  ':fire:': '🔥',
  ':star:': '⭐',
  ':heart:': '❤️',
  ':check:': '✅',
  ':x:': '❌'
};

const getWeatherInfo = async () => {
  let lat = 37.7749;
  let lon = -122.4194;

  if (typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const pos: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 2000 });
      });
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {
      // fallback
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=uv_index`;
    const res = await fetch(url);
    const data = await res.json();
    const temp = data.current_weather?.temperature ?? "N/A";
    let uv = "N/A";
    if (data.hourly && data.hourly.uv_index && data.hourly.time) {
      const now = new Date();
      const hourIdx = data.hourly.time.findIndex((t: string) => t.startsWith(now.toISOString().slice(0, 13)));
      if (hourIdx !== -1) {
        uv = data.hourly.uv_index[hourIdx];
      }
    }
    return {
      temp: `${temp}°C (${Math.round(temp * 9 / 5 + 32)}°F)`,
      uv: uv.toString()
    };
  } catch {
    return { temp: "N/A", uv: "N/A" };
  }
};

const getProgrammingQuote = async () => {
  try {
    // Current working Vercel endpoint
    const res = await fetch('https://programming-quotesapi.vercel.app/api/quotes/random');
    if (!res.ok) throw new Error();
    const data = await res.json();
    return {
      text: data.en,
      author: data.author
    };
  } catch {
    const fallbacks = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" }
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

const getClientInfo = () => ({
  userAgent: navigator.userAgent,
  language: navigator.language,
  platform: navigator.platform,
  onLine: navigator.onLine,
  screen: `${screen.width}x${screen.height}`
});

const getLocation = async () => {
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    return new Promise<string>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude.toFixed(2)}° N, ${longitude.toFixed(2)}° W`);
        },
        () => resolve("Unknown Location"),
        { timeout: 2000 }
      );
    });
  }
  return "Location Disabled";
};

const generateHash = async () => {
  const data = Date.now().toString() + Math.random().toString();
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
};

const encodeContent = async (content: string) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const evaluateExpression = (expr: string): string | null => {
  try {
    let processedExpr = expr.replace(/\^/g, '**').replace(/,/g, '.').replace(/\s+/g, '');
    const mathRegex = /^[\d\s+\-*/%().,**]+$/;
    if (mathRegex.test(processedExpr)) {
      const result = new Function(`return (${processedExpr})`)();
      return ` = <span class="text-green-600 dark:text-green-400 font-bold font-mono">${result}</span>`;
    }
  } catch {
    return null;
  }
  return null;
};

const processUrls = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    try {
      const domain = new URL(url).hostname;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">${domain}</a>`;
    } catch {
      return url;
    }
  });
};

const processNoted = (text: string): string => {
  return text.replace(/NOTED\./g, '<span class="text-primary font-black">NOTED.</span>');
};

const processEmojis = (text: string): string => {
  let processed = text;
  Object.entries(emojiMap).forEach(([ascii, unicode]) => {
    const regex = new RegExp(ascii.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processed = processed.replace(regex, unicode);
  });
  return processed;
};

const processMarkdown = (text: string): string => {
  let p = text;
  p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  p = p.replace(/\*(.*?)\*/g, '<em>$1</em>');
  p = p.replace(/__(.*?)__/g, '<u>$1</u>');
  p = p.replace(/`(.*?)`/g, '<code class="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono text-primary">$1</code>');
  p = p.replace(/^### (.*$)/gm, '<h3 class="text-base font-bold my-2">$1</h3>');
  p = p.replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold my-2">$1</h2>');
  p = p.replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold my-2">$1</h1>');
  return p;
};

const processJavaScript = (text: string): string => {
  return text.replace(/\{js\((.*?)\)\}/g, (_, code) => {
    try {
      const result = new Function(`return (${code})`)();
      return `<span class="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono text-xs border border-amber-500/20" title="Result of: ${code}">${JSON.stringify(result)}</span>`;
    } catch (e) {
      return `<span class="text-destructive font-mono text-xs underline decoration-dotted" title="JS Error">Error</span>`;
    }
  });
};

const processMemorize = (text: string): string => {
    return text.replace(/\{Memorize\((.*?):(.*?)\)\}/g, (_, question, answer) => {
        return `<div class="my-4 rounded-2xl glass border border-primary/20 overflow-hidden shadow-lg">
            <div class="grid grid-cols-2 divide-x divide-primary/10">
                <div class="p-6 flex flex-col items-center justify-center space-y-2">
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40">Question</span>
                    <p class="text-sm font-bold text-center leading-relaxed">${question}</p>
                </div>
                <div class="p-6 flex flex-col items-center justify-center space-y-2 group/memo cursor-help bg-primary/[0.05]">
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-destructive/40">Answer</span>
                    <div class="relative w-full flex justify-center">
                        <p class="text-sm blur-lg group-hover/memo:blur-none transition-all duration-500 font-black text-primary select-none text-center leading-relaxed px-2 py-1 rounded bg-primary/10 border border-primary/5">
                            ${answer}
                        </p>
                    </div>
                </div>
            </div>
        </div>`;
    });
};

const processProgress = (text: string): string => {
    return text.replace(/\{Progress\((.*?)\/(.*?)\)\}/g, (_, current, total) => {
        const c = parseFloat(current);
        const t = parseFloat(total);
        const percent = Math.min(100, Math.max(0, (c / t) * 100));
        return `<div class="w-full my-3 p-3 glass rounded-xl border border-primary/20 bg-primary/[0.02]">
            <div class="flex items-center justify-between mb-2 px-1">
                <div class="flex items-center space-x-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span class="text-[9px] font-black uppercase tracking-wider text-primary/80">Status: ${current}/${total}</span>
                </div>
                <span class="text-[9px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded shadow-sm">${Math.round(percent)}%</span>
            </div>
            <div class="relative w-full h-2 bg-black/10 dark:bg-white/10 rounded-full border border-black/5 dark:border-white/5 overflow-hidden">
                <div class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out" 
                     style="width: ${percent}%; background-color: var(--primary); box-shadow: 0 0 10px var(--primary);">
                </div>
            </div>
        </div>`;
    });
};

const processAverage = (text: string): string => {
    return text.replace(/\{Average\((.*?)\)\}/g, (_, nums) => {
        const arr = nums.split(',').map(Number).filter((n: number) => !isNaN(n));
        if (arr.length === 0) return '0.00';
        const avg = arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
        return `<span class="font-black text-primary bg-primary/10 px-2 py-0.5 rounded" title="Mean of ${arr.length} values">${avg.toFixed(2)}</span>`;
    });
};

const processWeightedAverage = (text: string): string => {
    return text.replace(/\{WeightedAvg\((.*?)\)\}/g, (_, pairs) => {
        const matches = [...pairs.matchAll(/\((.*?),(.*?)\)/g)];
        let totalVal = 0;
        let totalWeight = 0;
        matches.forEach(m => {
            const v = parseFloat(m[1]);
            const w = parseFloat(m[2]);
            if (!isNaN(v) && !isNaN(w)) {
                totalVal += v * w;
                totalWeight += w;
            }
        });
        const res = totalWeight === 0 ? 0 : totalVal / totalWeight;
        return `<span class="font-black text-primary border-b-2 border-primary/20 pb-0.5" title="Weighted calculation">${res.toFixed(2)}</span>`;
    });
};

const processCountdown = (text: string): string => {
    return text.replace(/\{Countdown\((.*?)\)\}/g, (_, dateStr) => {
        const target = new Date(dateStr);
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const color = days < 0 ? 'text-destructive' : 'text-primary';
        const label = days < 0 ? 'Overdue' : 'Days left';
        return `<span class="inline-flex items-center space-x-1.5 bg-muted/50 px-2 py-1 rounded-lg border border-white/10">
            <span class="text-[9px] font-black uppercase tracking-tighter opacity-50">${label}</span>
            <span class="font-black ${color}">${Math.abs(days)}</span>
        </span>`;
    });
};

const processBaseSystem = (text: string): string => {
    return text.replace(/\{Base\((.*?):(.*?):(.*?)\)\}/g, (_, val, from, to) => {
        try {
            const result = parseInt(val, parseInt(from)).toString(parseInt(to)).toUpperCase();
            return `<span class="bg-primary/5 px-2 py-0.5 rounded border border-primary/10 font-mono font-black text-primary" title="${val} (base ${from}) to base ${to}">${result}</span>`;
        } catch {
            return `<span class="text-destructive text-xs">Base Error</span>`;
        }
    });
};

const processLaTeX = (text: string): string => {
    return text.replace(/\{LaTeX\((.*?)\)\}/g, (_, formula) => {
        const encoded = encodeURIComponent(formula);
        return `<div class="my-4 flex justify-center p-6 glass rounded-2xl border border-primary/10">
            <img src="https://latex.codecogs.com/svg.latex?\\huge&space;${encoded}" alt="${formula}" class="dark:invert dark:brightness-200 contrast-125 select-none" />
        </div>`;
    });
};

const processModules = async (text: string, noteColor: string): Promise<string> => {
  if (!text.includes('{')) return text;
  let processed = text;

  // Process async modules only if needed
  if (processed.includes('{Weather.')) {
      const weather = await getWeatherInfo();
      processed = processed.replace(/\{Weather.temp\}/g, `<span class="text-primary font-bold">${weather.temp}</span>`);
      processed = processed.replace(/\{Weather.uv\}/g, `<span class="text-primary font-bold">UV: ${weather.uv}</span>`);
  }

  if (processed.includes('{Location.here}')) {
      const loc = await getLocation();
      processed = processed.replace(/\{Location.here\}/g, `<span class="text-primary font-bold">${loc}</span>`);
  }

  if (processed.includes('{Quote}')) {
      const quote = await getProgrammingQuote();
      processed = processed.replace(/\{Quote\}/g, `<div class="my-4 p-4 border-l-4 border-primary bg-primary/5 rounded-r-xl italic font-medium text-sm text-foreground/80 leading-relaxed shadow-sm">
          "${quote.text}"
          <div class="mt-2 text-[10px] font-black not-italic uppercase tracking-widest text-primary/60">— ${quote.author}</div>
      </div>`);
  }

  if (processed.includes('{Random.')) {
      processed = processed.replace(/\{Random.number\}/g, `<span class="text-primary font-bold">${Math.floor(Math.random() * 1000)}</span>`);
      const hash = await generateHash();
      processed = processed.replace(/\{Random.hash\}/g, `<span class="text-primary font-bold">${hash}</span>`);
  }

  // Time & Metadata (Sync)
  const now = new Date();
  processed = processed.replace(/\{Time.day\}/g, `<span class="text-primary font-bold">${now.toLocaleDateString(undefined, { weekday: 'long' })}</span>`);
  processed = processed.replace(/\{Time.time\}/g, `<span class="text-primary font-bold">${now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>`);
  processed = processed.replace(/\{Note.color\}/g, `<span class="text-primary font-bold">${noteColor}</span>`);
  processed = processed.replace(/\{Note.size\}/g, `<span class="text-primary font-bold">${text.length}</span>`);

  if (processed.includes('{Client.info}')) {
      const info = getClientInfo();
      processed = processed.replace(/\{Client.info\}/g, `<span class="text-primary font-bold">${info.platform} (${info.language})</span>`);
  }

  // Encode logic
  const encodeMatches = [...processed.matchAll(/\{Encode\((.*?)\)\}/g)];
  for (const match of encodeMatches) {
    const encoded = await encodeContent(match[1]);
    processed = processed.replace(match[0], `<span class="text-amber-600 dark:text-amber-400 font-mono text-[10px] break-all opacity-80">${encoded}</span>`);
  }

  return processed;
};

export const evaluateNoteContent = async (content: string | undefined, noteColor: string): Promise<string | string[]> => {
  if (!content) return "";
  const lines = content.split('\n');
  const results: string[] = [];

  for (const lineRaw of lines) {
    let line = lineRaw.trim();
    if (!line) {
        results.push("<br/>");
        continue;
    }
    
    const mathResult = evaluateExpression(line);
    if (mathResult) {
        line = line + mathResult;
    }
    
    line = processUrls(line);
    line = processNoted(line);
    line = processEmojis(line);
    line = processMarkdown(line);
    line = processJavaScript(line);
    line = processMemorize(line);
    line = processProgress(line);
    line = processAverage(line);
    line = processWeightedAverage(line);
    line = processCountdown(line);
    line = processBaseSystem(line);
    line = processLaTeX(line);
    line = await processModules(line, noteColor);
    results.push(line);
  }

  return results.length === 1 ? results[0] : results.join('\n');
};
