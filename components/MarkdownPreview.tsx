import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
    content: string;
}

// Using forwardRef so parent can access the DOM for PDF generation
export const MarkdownPreview = forwardRef<HTMLDivElement, MarkdownPreviewProps>(({ content }, ref) => {
    return (
        <div 
            ref={ref} 
            className="bg-white p-8 min-h-full shadow-sm"
            id="markdown-preview-container"
        >
            <div className="prose prose-slate prose-headings:font-semibold prose-a:text-indigo-600 max-w-none">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-3xl border-b pb-2 mb-6 mt-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-4 mt-8" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-medium mb-3 mt-6" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-slate-700" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-6 bg-slate-50 py-2 rounded-r" {...props} />,
                        code: ({node, ...props}) => {
                            const { className, children } = props as any;
                            const isInline = !className && typeof children === 'string' && !children.includes('\n');
                            return isInline 
                                ? <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200" {...props} />
                                : <code className="block bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4" {...props} />;
                        },
                        table: ({node, ...props}) => <div className="overflow-x-auto my-6 border rounded-lg"><table className="min-w-full divide-y divide-slate-200" {...props} /></div>,
                        thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                        th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" {...props} />,
                        tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-slate-200" {...props} />,
                        td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" {...props} />,
                        a: ({node, ...props}) => <a className="text-indigo-600 hover:text-indigo-800 underline transition-colors" {...props} />,
                        hr: ({node, ...props}) => <hr className="my-8 border-slate-200" {...props} />,
                        img: ({node, ...props}) => <img className="rounded-lg shadow-md max-w-full h-auto my-6 mx-auto" {...props} />,
                        input: ({node, ...props}) => {
                            const { type, checked } = props as any;
                            if (type === 'checkbox') {
                                return <input type="checkbox" checked={checked} readOnly className="mr-2 h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />;
                            }
                            return <input {...props} />;
                        }
                    }}
                >
                    {content || "_Start typing in the editor..._"}
                </ReactMarkdown>
            </div>
        </div>
    );
});

MarkdownPreview.displayName = 'MarkdownPreview';
