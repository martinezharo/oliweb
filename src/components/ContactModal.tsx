import { useState } from 'react';
import { Mail, X } from 'lucide-react';

interface Props {
  apiAccessKey: string;
  translations: {
    title: string;
    button: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    or_email: string;
  };
}

export default function ContactModal({ apiAccessKey, translations }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    formData.append('access_key', apiAccessKey);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        // Close modal after a delay
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="col-span-1 brutalist-card group flex flex-col items-center justify-center gap-4 hover:bg-zinc-900 transition-colors w-full h-full cursor-pointer"
      >
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-full group-hover:border-zinc-600 transition-colors">
          <Mail className="w-6 h-6 text-zinc-400 group-hover:text-white" />
        </div>
        <span className="font-medium text-zinc-400 group-hover:text-white">{translations.button}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 transition-all backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-8 relative shadow-2xl rounded-none">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-8 text-white uppercase tracking-tight">{translations.title}</h2>
            
            {status === 'success' ? (
              <div className="text-green-500 font-bold py-12 text-center text-lg border border-green-500/20 bg-green-500/10 text-balance">{translations.success}</div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{translations.name}</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required 
                    readOnly={status === 'submitting'}
                    className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-400 hover:border-zinc-600 transition-colors rounded-none outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{translations.email}</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    readOnly={status === 'submitting'}
                    className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-400 hover:border-zinc-600 transition-colors rounded-none outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{translations.message}</label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows={4} 
                    required 
                    readOnly={status === 'submitting'}
                    className="bg-zinc-900 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-400 hover:border-zinc-600 transition-colors rounded-none resize-none outline-none"
                  ></textarea>
                </div>
                
                <input type="hidden" name="subject" value="New Contact Message Request!" />

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="mt-2 bg-white text-black font-bold py-3 px-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none uppercase tracking-wider text-sm"
                >
                  {status === 'submitting' ? translations.sending : translations.send}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm mt-2 text-center p-3 border border-red-500/20 bg-red-500/10 font-medium">{translations.error}</p>
                )}

                <div className="mt-2 pt-6 border-t border-zinc-800/50 text-center">
                  <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">{translations.or_email}</p>
                  <a href="mailto:oliver@martinezharo.com" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">
                    oliver@martinezharo.com
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}