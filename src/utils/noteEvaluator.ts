import { log } from "console";
import { useState } from "react";

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
  // Use Open-Meteo API (no key required, free, privacy-friendly)
  // Docs: https://open-meteo.com/en/docs
  // We'll use San Francisco as fallback if geolocation is unavailable
  let lat = 37.7749;
  let lon = -122.4194;

  // Try to get user's geolocation
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      const pos: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 2000 });
      });
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {
      // fallback to default
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=uv_index`;
    const res = await fetch(url);
    const data = await res.json();
    const temp = data.current_weather?.temperature ?? "N/A";
    // Find current hour's UV index
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
    return {
      temp: "Error.",
      uv: "Error."
    };
  }
};

// Get client info
const getClientInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height
  };
};

// Get geolocation
const getLocation = async () => {
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    return new Promise<string>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}° N,${longitude}° W`);
        },
        (error) => {
          resolve("Error.");
        },
        { timeout: 2000 } // 2 seconds timeout
      );
    });
  } else {
    return Promise.resolve("Error.");
  }
};

// Generate random hash using Web Crypto API
const generateHash = async () => {
  const data = Date.now().toString() + Math.random().toString();
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 8);
};

// Encode content using Web Crypto API
const encodeContent = async (content: string) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Enhanced math expression evaluation
const evaluateExpression = (expr: string): string | null => {
  try {
    let processedExpr = expr;

    // Replace custom operators
    processedExpr = processedExpr.replace(/\^/g, '**'); // Power operator
    processedExpr = processedExpr.replace(/%/g, '%'); // Modulo
    processedExpr = processedExpr.replace(/,/g, '.'); // Replace comma with dot for decimal
    processedExpr = processedExpr.replace(/\s+/g, ''); // Remove all whitespace

    // Process exp function: {exp(...)} -> Math.exp(...)
    processedExpr = processedExpr.replace(/\{exp\((.*?)\)\}/g, (match, p1) => `${Math.exp(eval(p1))}`);

    // Process log function: {log(...)} -> Math.log(...)
    processedExpr = processedExpr.replace(/\{log\((.*?)\)\}/g, (match, p1) => `${Math.log(eval(p1))}`);

    // Process binary conversion: {bin(...)} -> convert to binary
    const binMatches = [...processedExpr.matchAll(/\{bin\((.*?)\)\}/g)];
    for (const match of binMatches) {
      const value = eval(match[1]);
      const binary = parseInt(value).toString(2);
      processedExpr = processedExpr.replace(match[0], binary);
    }

    // Enhanced regex for math operations including parentheses, modulo, powers
    const mathRegex = /^[\d\s+\-*/%().,^]+$/;
    if (mathRegex.test(processedExpr)) {
      const result = Function(`"use strict"; return (${processedExpr})`)();
      return ` = <span style="color: #10B981; font-weight: bold;">${result}</span>`;
    }
  } catch (error) {
    return null;
  }
  return null;
};
// Process URLs
const processUrls = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    const domain = new URL(url).hostname;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; text-decoration: underline;">${domain}</a>`;
  });
};

// Process NOTED.
const processNoted = (text: string): string => {
  return text.replace(/NOTED\./g, '<span style="color: #8B5CF6; font-weight: bold;">NOTED.</span>');
};

// Process ASCII emojis
const processEmojis = (text: string): string => {
  let processed = text;
  Object.entries(emojiMap).forEach(([ascii, unicode]) => {
    const regex = new RegExp(ascii.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processed = processed.replace(regex, unicode);
  });
  return processed;
};

// Process markdown
const processMarkdown = (text: string): string => {
  let processed = text;

  // Bold **text**
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic *text*
  processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Underline __text__
  processed = processed.replace(/__(.*?)__/g, '<u>$1</u>');

  // Code `text`
  processed = processed.replace(/`(.*?)`/g, '<code style="background: rgba(139, 92, 246, 0.1); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');

  // Headings
  processed = processed.replace(/^### (.*$)/gm, '<h3 style="font-size: 1.125rem; font-weight: bold; margin: 0.5rem 0;">$1</h3>');
  processed = processed.replace(/^## (.*$)/gm, '<h2 style="font-size: 1.25rem; font-weight: bold; margin: 0.5rem 0;">$1</h2>');
  processed = processed.replace(/^# (.*$)/gm, '<h1 style="font-size: 1.5rem; font-weight: bold; margin: 0.5rem 0;">$1</h1>');

  return processed;
};

// Process modules
const processModules = async (text: string, noteColor: string): Promise<string> => {
  let processed = text;
  const weather = await getWeatherInfo();
  const clientInfo = getClientInfo();
  const now = new Date();

  const modules: Record<string,  string> = {
    'Weather.temp': weather.temp,
    'Weather.uv': `UV Index: ${weather.uv}`,
    'Time.day': now.toLocaleDateString('en-US', { weekday: 'long' }),
    'Time.time': now.toLocaleTimeString(),
    'Location.here': await getLocation(),
    'Client.info': JSON.stringify(clientInfo, null, 2),
    'Random.number': Math.floor(Math.random() * 900 + 100).toString(),
    'Random.hash': await generateHash(),
    'Note.color': noteColor,
    'Note.size': text.length.toString()
  };

  // Process encode function
  const encodeMatches = [...processed.matchAll(/\{Encode\((.*?)\)\}/g)];
  for (const match of encodeMatches) {
    const encoded = await encodeContent(match[1]);
    processed = processed.replace(match[0], `<span style="color: #F59E0B; font-family: monospace;">${encoded}</span>`);
  }

  // Process other modules
  Object.entries(modules).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    // Pick a random color from an array of hex values for each module replacement
    const colors = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444', '#6366F1', '#F472B6', '#22D3EE'];
    const color = value === "Error" ? '#FF0000' : colors[Math.floor(Math.random() * colors.length)];
    processed = processed.replace(regex, `<span style="color: ${color}; font-weight: bold;">${value}</span>`);
  });

  return processed;
};

// Enhanced math processing with support for all operations
const processMath = (text: string): string => {
  // Enhanced regex to find math expressions including parentheses, modulo, powers, exp, log, bin
  // Use the same regex as in evaluateExpression for consistency
  // const mathRegex = /(\d+(?:\.\d+)?(?:\s*[+\-*/%^]\s*\d+(?:\.\d+)?)*|\([^)]+\)(?:\s*[+\-*/%^]\s*\d+(?:\.\d+)?)*|\{(?:exp|log|bin)\((^\))*\)\}(?:\s*[+\-*/%^]\s*\d+(?:\.\d+)?)*)/g;

  const result = evaluateExpression(text);
  return result ? text + result : text;
};

const processJavaScript = (text: string): string => {
  // Process javascript blocks: {js(...)} -> eval js code
  const jsMatches = [...text.matchAll(/\{js\((.*?)\)\}/g)];
  for (const match of jsMatches) {
    const jsCode = match[1];
    try {
      const jsResult = eval(jsCode);
      return text + ` -> <span style="color: #10B981; font-weight: bold;">OK.</span>`;
    } catch (error) {
      return text + ` -> <span style="color: #FF0000; font-weight: bold;">Error.</span>`;
    }
  }
  return text;
}

const processMemorize = (textRaw: string): [string, string] | null => {
  const memorizeMatches = [...textRaw.matchAll(/\{Memorize\((.*?)\)\}/g)];
  if (memorizeMatches.length > 0) {
    const matchContent = memorizeMatches[0][1];
    const [textShown, textHidden, ...otherText] = matchContent.split(':');
    return [
      `<div style="background: #F3F4F6; text-align:center; font-size: 1.3rem; color: #8B5CF6; box-shadow: 0 2px 8px rgba(139,92,246,0.15); border-radius: 8px; padding: 8px 16px; transition: box-shadow 0.2s, background 0.2s; cursor: pointer;" onmouseover="this.style.background='#EDE9FE';this.style.boxShadow='0 4px 16px rgba(139,92,246,0.25)';" onmouseout="this.style.background='#F3F4F6';this.style.boxShadow='0 2px 8px rgba(139,92,246,0.15)';">${textShown}</div>`,
      `<div style="background: #F3F4F6; text-align:center; font-size: 1.3rem; color: #EF4444; box-shadow: 0 2px 8px rgba(239,68,68,0.15); border-radius: 8px; padding: 8px 16px; transition: box-shadow 0.2s, background 0.2s; cursor: pointer;" onmouseover="this.style.background='#FEE2E2';this.style.boxShadow='0 4px 16px rgba(239,68,68,0.25)';" onmouseout="this.style.background='#F3F4F6';this.style.boxShadow='0 2px 8px rgba(239,68,68,0.15)';">${textHidden}</div>`
    ];
  }
  return null;
}

export const evaluateNoteContent = async (content: string | undefined, noteColor: string): Promise<string | string[]> => {
  if (!content) return "";
  const lines = content.split('\n').map(line => line.trim()); // Normalize whitespace

  const results: (string | string[])[] = [];

  for (const lineRaw of lines) {
    let line = processMath(lineRaw);
    line = processJavaScript(line);
    const memorizeResult = processMemorize(line);
    if (memorizeResult === null) {
      // No memorize pattern, continue processing as string
      line = processUrls(line);
      line = processNoted(line);
      line = processEmojis(line);
      line = processMarkdown(line);
      line = await processModules(line, noteColor);
      results.push(line);
    } else {
      // If memorize pattern found, return the [shown, hidden] array directly
      results.push(memorizeResult);
    }
  }

  return results.length === 1 ? results[0] : results.join('\n');
};
