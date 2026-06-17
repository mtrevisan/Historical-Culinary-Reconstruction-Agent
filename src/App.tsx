import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { Play, Loader2, Database, AlertCircle, FileText, CheckCircle2, History } from "lucide-react";
import { cn } from "./utils";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const resultEndRef = useRef<HTMLDivElement>(null);

  const handleProcess = async () => {
    if (!inputText.trim()) {
      setError("Please input a historical recipe or text fragment.");
      return;
    }

    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historicalText: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process text");
      }

      setOutput(data.result);
      
      // Auto-scroll to bottom of output once done
      setTimeout(() => {
        resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-slate-100 border-b border-slate-800 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-md">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="font-semibold text-sm tracking-wide">HCR v4.0 Central Orchestrator</h1>
              <p className="text-xs text-slate-400 font-mono">Historical Culinary Reconstruction</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 hidden sm:flex">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> MODULE 1: PARSER</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> MODULE 2: ENGINE</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> MODULE 3: LINTER</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full mx-auto">
        
        {/* Top: Input Section */}
        <section className="w-full flex flex-col bg-white border-b border-slate-200 shrink-0 p-4 md:p-6">
          <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Archival Recipe Text
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the historical recipe or document fragment here..."
              className="flex-1 h-32 p-3 text-sm font-mono leading-relaxed bg-slate-50 text-slate-800 border border-slate-200 rounded-md focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none resize-y placeholder:text-slate-400 transition-colors"
            />
            
            <div className="w-full sm:w-64 flex flex-col justify-between gap-3 shrink-0">
              {error ? (
                <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-md text-xs flex items-start gap-2 flex-1 overflow-y-auto">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="line-clamp-4">{error}</p>
                </div>
              ) : (
                <div className="hidden sm:block text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100 flex-1">
                  Provide historical recipes to calculate high-precision modern metrics via the strict HCR v4.0 multi-agent pipeline.
                </div>
              )}
              
              <button
                onClick={handleProcess}
                disabled={isLoading || !inputText.trim()}
                className={cn(
                  "w-full h-11 flex items-center justify-center gap-2 rounded-md font-medium text-sm transition-all shadow-sm shrink-0",
                  isLoading || !inputText.trim() 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Pipeline...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Analyze Recipe
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Bottom: Output Section */}
        <section className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
          {output ? (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12">
              <div className="bg-white border border-slate-200 rounded-lg shadow-sm w-full max-w-4xl mx-auto p-6 md:p-10 mb-8 prose prose-slate prose-headings:font-semibold prose-h2:text-xl prose-h2:text-slate-800 prose-h2:border-b prose-h2:pb-2 prose-h3:text-lg prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800 max-w-none">
                <Markdown>{output}</Markdown>
                <div ref={resultEndRef} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              {isLoading ? (
                <div className="flex flex-col items-center max-w-sm">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-white border border-slate-200 p-4 rounded-full shadow-sm">
                      <Database className="w-8 h-8 text-indigo-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="font-medium text-slate-700 mb-2">Executing Analytical Pipeline</h3>
                  <p className="text-sm text-slate-500">Activating multi-agent processing. Executing mathematical matrix decoupling and compliance linting in sequence.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center max-w-sm">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <History className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-600 mb-1">Awaiting Archival Payload</h3>
                  <p className="text-sm">Enter historical text to commence physicochemical and technical evaluation.</p>
                </div>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
