import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Globe, Lock, Code, CheckCircle2, ChevronRight, Zap, Play } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            Translate AI
          </div>
          <a
            href="#pricing"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-sm font-medium transition-colors"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
              <Zap size={14} fill="currentColor" />
              <span>Version 1.0 Available Now</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Translate & Summarize <br /> the Web. Privately.
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Use your own Gemini API Key. No middleman. No subscription fees. <br />
              Just a powerful Chrome Extension that connects you directly to AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 group"
              >
                Download for $2
                <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Play size={18} />
                How it works
              </a>
            </div>
          </motion.div>

          {/* Abstract Extension Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative mx-auto max-w-4xl"
          >
            <div className="rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

              {/* Simulated Interface */}
              <div className="relative z-10 p-8 text-left w-full max-w-lg">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl transform transition-transform group-hover:scale-[1.01]">
                  <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Sparkles size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Translate AI</div>
                      <div className="text-[10px] text-neutral-500">Summarizing content...</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-white/10 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-white/10 rounded w-full animate-pulse delay-75"></div>
                    <div className="h-2 bg-white/10 rounded w-5/6 animate-pulse delay-150"></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                    <div className="h-6 w-20 bg-blue-500/20 rounded text-[10px] flex items-center justify-center text-blue-300 font-medium">English</div>
                    <div className="h-6 w-20 bg-white/5 rounded text-[10px] flex items-center justify-center text-neutral-400">German</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]" />
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Everything you need to break language barriers and digest content faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="text-blue-400" />}
              title="Smart Translation"
              description="Translate selected text instantly without losing context. Preserves formatting and nuance."
            />
            <FeatureCard
              icon={<Sparkles className="text-purple-400" />}
              title="Page Summaries"
              description="Get concise, bulleted summaries of long articles in seconds. Read less, know more."
            />
            <FeatureCard
              icon={<Lock className="text-green-400" />}
              title="Your Keys, Your Privacy"
              description="Your API key is stored locally in your browser. We never see it, store it, or share it."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-neutral-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Setup in 3 Minutes</h2>
              <div className="space-y-8">
                <Step
                  number="01"
                  title="Install the Extension"
                  desc="Download and add to Chrome."
                />
                <Step
                  number="02"
                  title="Get Your Free API Key"
                  desc="We provide a direct link to Google AI Studio. It's free for personal use."
                />
                <Step
                  number="03"
                  title="Connect & Go"
                  desc="Paste your key into the extension settings. It's saved locally. That's it!"
                />
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <Code size={20} className="text-blue-500" />
                  <span className="font-mono text-sm text-neutral-400">Locally Stored Key</span>
                </div>
                <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-neutral-300 border border-white/5">
                  <div className="text-neutral-500 mb-2">// chrome.storage.local</div>
                  <div className="text-green-400">"geminiApiKey": "AIzaSyD..."</div>
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-full animate-pulse"></div>
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-blue-400 font-medium">Encrypted & Safe</div>
              </div>
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-neutral-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple Pricing</h2>
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8 md:p-12 max-w-md mx-auto shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

            <h3 className="text-xl font-medium text-neutral-300 mb-2">Lifetime Access</h3>
            <div className="text-5xl font-bold text-white mb-6">$2</div>
            <p className="text-neutral-400 mb-8 text-sm">
              One-time payment. Use forever.<br />
              Own the tool, control your data.
            </p>

            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors mb-6">
              Buy Now
            </button>

            <div className="space-y-3 text-left">
              <CheckItem text="Unlimited Translations" />
              <CheckItem text="Unlimited Summaries" />
              <CheckItem text="Bring your own Key" />
              <CheckItem text="Privacy First Design" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-neutral-500 text-sm">
        <p>© {new Date().getFullYear()} Translate AI. All rights reserved.</p>
      </footer>

    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-xl hover:bg-neutral-900 transition-colors">
      <div className="bg-white/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="font-mono text-xl font-bold text-blue-500/50">{number}</div>
      <div>
        <h4 className="text-lg font-semibold mb-1 text-white">{title}</h4>
        <p className="text-neutral-400 text-sm">{desc}</p>
      </div>
    </div>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-300">
      <CheckCircle2 size={16} className="text-blue-500" />
      <span>{text}</span>
    </div>
  )
}

export default App
