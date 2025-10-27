import React, { useState, useEffect, useRef } from 'react';
import type { Message } from './types';
import { sendMessageToModel } from './services/gemini';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ShareIcon from './components/icons/ShareIcon';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate Maximilien's arrival
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          role: 'model',
          parts: [{ text: "Wesh gros, c'est Maximilien. T'as un truc à me dire ou quoi ? Dépêche, mon Xmax attend pas." }],
        },
      ]);
    }, 500); // Wait half a second before the first message appears
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleShare = async () => {
    const shareData = {
      title: 'Chat avec Maximilien',
      text: "Wesh, viens te marrer en parlant à Maximilien, le mec le plus relou de France.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.info("Share action was cancelled or failed", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link', err);
        alert("Impossible de copier le lien. Essaie manuellement depuis la barre d'adresse.");
      }
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (messages.length === 0) return; // Prevent sending while initial message is loading
    setIsLoading(true);
    setError(null);

    const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newMessages);

    try {
      const modelResponse = await sendMessageToModel(newMessages);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: modelResponse }] }]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: `Wesh, y'a un problème de connexion là. Mon tel il capte R.` }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-transparent text-white">
      <header className="flex items-center justify-between bg-gray-900/70 backdrop-blur-sm border-b border-gray-700/80 p-4 shadow-md sticky top-0 z-10">
        <div className="w-9" aria-hidden="true"></div> {/* Spacer to center the title */}
        <div className="text-center">
            <h1 className="text-xl font-bold text-indigo-400">Maximilien Maubert</h1>
            <p className="text-sm text-gray-400">En ligne</p>
        </div>
        <button
            onClick={handleShare}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Partager le chat"
        >
            <ShareIcon className="w-5 h-5" />
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && <ChatMessage message={{ role: 'model', parts: [{ text: '...' }] }} />}
          <div ref={messagesEndRef} />
        </div>
        {error && (
            <div className="max-w-4xl mx-auto mt-4 p-3 bg-red-800/50 border border-red-600 text-red-300 rounded-lg">
                <p><strong>Erreur:</strong> {error}</p>
            </div>
        )}
      </main>
      
      <footer className="sticky bottom-0 bg-gray-900/70 backdrop-blur-sm border-t border-gray-700/80">
        <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-20 transition-all duration-300 ease-out ${showCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        Lien copié !
      </div>
    </div>
  );
};

export default App;