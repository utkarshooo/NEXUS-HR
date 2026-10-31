import React, { useState } from 'react';
import { AIChatMessage } from '../../types';

interface PolicyCopilotProps {
  messages: AIChatMessage[];
  onSendMessage: (query: string) => void;
  isAiThinking: boolean;
}

export const PolicyCopilot: React.FC<PolicyCopilotProps> = ({
  messages,
  onSendMessage,
  isAiThinking,
}) => {
  const [input, setInput] = useState('');

  const handleSend = (text?: string) => {
    const q = text || input;
    if (!q.trim()) return;
    onSendMessage(q);
    setInput('');
  };

  return (
    <div className="rounded-3xl p-6 flex flex-col justify-between border border-slate-800 bg-[#161F30]/80 backdrop-blur-xl h-full">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Nexus Policy Copilot</h3>
              <p className="text-[11px] text-emerald-400 font-mono">pgvector RAG Active</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">Spring AI</span>
        </div>

        <div className="mt-4 space-y-3.5 max-h-80 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {msg.citations.map((c, i) => (
                      <span key={i} className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                        📄 {c.docTitle} ({c.ref})
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isAiThinking && (
            <div className="flex items-center space-x-2 p-3 bg-slate-900/60 rounded-2xl w-fit">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
              <span className="text-xs text-slate-400">Consulting enterprise vector handbook...</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {['Parental Leave (16 wks)', 'Equity Cliff & Vesting', 'Remote Stipend ($1.5k)'].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[10px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 transition"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask policy questions or benefits..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
