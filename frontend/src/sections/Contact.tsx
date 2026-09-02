import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import SectionWrapper from '../components/SectionWrapper';
import profile from '../data/profile';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send');

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <SectionWrapper id="contact" className="relative pb-32">
      <div className="text-center mb-16">
        <h2 className="section-heading text-slate-900 dark:text-slate-100 mb-2">
          Initialize Connection
        </h2>
        <p className="hud-text lowercase tracking-widest text-slate-500">
          endpoint: /api/v1/contact
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-sm p-8 border border-light-border dark:border-dark-border relative">
          
          <div className="absolute top-4 right-6 hud-text">[ SECURE_CHANNEL ]</div>
          
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 pr-12">
            I'm currently open to internship and full-time opportunities. Drop a message below or email me directly at <a href={`mailto:${profile.meta.email}`} className="text-accent-500 font-bold hover:underline">{profile.meta.email}</a>.
          </p>

          <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block hud-text mb-2 text-slate-700 dark:text-slate-300">PARAM_NAME</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-accent-500 transition-colors font-mono text-sm placeholder-slate-400"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block hud-text mb-2 text-slate-700 dark:text-slate-300">PARAM_EMAIL</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-accent-500 transition-colors font-mono text-sm placeholder-slate-400"
                  placeholder="john@company.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block hud-text mb-2 text-slate-700 dark:text-slate-300">PAYLOAD_MESSAGE</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-4 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-accent-500 transition-colors font-mono text-sm placeholder-slate-400 resize-none"
                placeholder="Let's build something..."
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="hud-text text-accent-500">
                {status === 'success' ? '[ TRANSMISSION_SUCCESSFUL ]' : status === 'error' ? '[ TRANSMISSION_FAILED ]' : ''}
              </span>
              
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary"
              >
                {status === 'sending' ? 'TRANSMITTING...' : 'TRANSMIT_PAYLOAD'} <FiSend size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
}
