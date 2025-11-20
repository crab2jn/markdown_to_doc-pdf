import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Split, Monitor, Edit3, Download, FileText, Wand2, Trash2, Save } from 'lucide-react';
import { Button } from './components/Button';
import { MarkdownPreview } from './components/MarkdownPreview';
import { improveMarkdown } from './services/geminiService';
import { EditorMode } from './types';

// Default content to show on first load
const DEFAULT_CONTENT = `# Welcome to MarkVisualizer Pro

This is a **powerful** markdown editor with real-time preview.

## Features
- 🚀 Real-time visualization
- ✨ AI-powered enhancement
- 📄 Export to PDF & Word
- 🎨 Clean, modern UI

## Code Example
\`\`\`javascript
console.log("Hello, World!");
const add = (a, b) => a + b;
\`\`\`

## Table Example
| Feature | Status |
|:--------|:-------|
| PDF     | ✅ Ready |
| Word    | ✅ Ready |
| AI      | ✅ Ready |

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci
`;

export default function App() {
  const [content, setContent] = useState<string>(DEFAULT_CONTENT);
  const [mode, setMode] = useState<EditorMode>(EditorMode.SPLIT);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [fileName, setFileName] = useState("document");
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Handle window resize for responsive mode switching
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setMode(prev => prev === EditorMode.SPLIT ? EditorMode.WRITE : prev);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // AI Improvement Handler
  const handleAiImprove = async () => {
    if (!process.env.API_KEY) {
        alert("Please configure your API_KEY in the environment variables.");
        return;
    }
    setIsAiLoading(true);
    try {
        const improved = await improveMarkdown(content, "Fix formatting, improve grammar, and organize this document better.");
        setContent(improved);
    } catch (error) {
        alert("Failed to improve content. See console for details.");
    } finally {
        setIsAiLoading(false);
    }
  };

  // PDF Export
  const handleExportPdf = useCallback(() => {
    if (!previewRef.current) return;
    
    // Assuming html2pdf is loaded via CDN in index.html
    const html2pdf = (window as any).html2pdf;
    if (!html2pdf) {
        alert("PDF generator library not loaded.");
        return;
    }

    const element = previewRef.current;
    const opt = {
      margin: 10,
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  }, [fileName]);

  // Word Export (Client-side simplified)
  const handleExportDoc = useCallback(() => {
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>`;
    const footer = "</body></html>";
    
    // Use the innerHTML of the preview logic. 
    // Note: For robust Word export, ideally we use a serializer, but pulling the rendered HTML is a good proxy for visualization.
    const sourceHTML = header + (previewRef.current?.innerHTML || "") + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${fileName}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }, [fileName]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="bg-indigo-600 p-1.5 rounded-lg">
             <FileText className="w-5 h-5 text-white" />
           </div>
           <h1 className="text-lg font-bold text-slate-800 hidden sm:block">MarkVisualizer Pro</h1>
           <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
           <input 
             type="text" 
             value={fileName}
             onChange={(e) => setFileName(e.target.value)}
             className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 placeholder-slate-400 w-32 sm:w-auto"
             placeholder="Untitled Document"
           />
        </div>

        <div className="flex items-center gap-2">
            <div className="bg-slate-100 rounded-lg p-1 hidden md:flex">
                <button 
                    onClick={() => setMode(EditorMode.WRITE)}
                    className={`p-1.5 rounded transition-all ${mode === EditorMode.WRITE ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Editor Only"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setMode(EditorMode.SPLIT)}
                    className={`p-1.5 rounded transition-all ${mode === EditorMode.SPLIT ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Split View"
                >
                    <Split className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setMode(EditorMode.PREVIEW)}
                    className={`p-1.5 rounded transition-all ${mode === EditorMode.PREVIEW ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Preview Only"
                >
                    <Monitor className="w-4 h-4" />
                </button>
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <Button 
                variant="secondary" 
                size="sm" 
                icon={<Wand2 className="w-4 h-4 text-indigo-500" />}
                onClick={handleAiImprove}
                isLoading={isAiLoading}
                className="hidden sm:flex"
            >
                AI Polish
            </Button>

            <div className="flex gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleExportDoc}
                    title="Download Word Doc"
                >
                   <FileText className="w-4 h-4 text-blue-600" />
                </Button>
                <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<Download className="w-4 h-4" />}
                    onClick={handleExportPdf}
                >
                    PDF
                </Button>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Editor Pane */}
        <div className={`
            flex flex-col bg-slate-900 border-r border-slate-700 transition-all duration-300 ease-in-out
            ${mode === EditorMode.PREVIEW ? 'w-0 overflow-hidden' : ''}
            ${mode === EditorMode.SPLIT ? 'w-1/2' : 'w-full'}
        `}>
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                <span>Markdown Source</span>
                <div className="flex gap-2">
                    <button onClick={() => setContent('')} className="hover:text-red-400 transition-colors" title="Clear">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full bg-slate-900 text-slate-200 p-6 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
                placeholder="# Start typing..."
            />
        </div>

        {/* Preview Pane */}
        <div className={`
            flex flex-col bg-slate-50 transition-all duration-300 ease-in-out
            ${mode === EditorMode.WRITE ? 'w-0 overflow-hidden' : ''}
            ${mode === EditorMode.SPLIT ? 'w-1/2' : 'w-full'}
        `}>
             <div className="bg-white px-4 py-2 flex items-center justify-between border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <span>Document Preview</span>
                {mode !== EditorMode.SPLIT && (
                   <button onClick={() => setMode(EditorMode.SPLIT)} className="text-indigo-600 hover:text-indigo-700">
                       Show Editor
                   </button>
                )}
            </div>
            <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-100/50">
                <div className="max-w-[210mm] mx-auto shadow-lg min-h-[297mm] bg-white transition-all">
                    <MarkdownPreview content={content} ref={previewRef} />
                </div>
            </div>
        </div>

      </main>
      
      {/* Mobile Floating Action Button for AI */}
       <div className="sm:hidden fixed bottom-6 right-6">
           <button 
             onClick={handleAiImprove}
             disabled={isAiLoading}
             className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all"
           >
               {isAiLoading ? (
                   <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
               ) : (
                   <Wand2 className="w-6 h-6" />
               )}
           </button>
       </div>
    </div>
  );
}
