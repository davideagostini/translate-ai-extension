import { useState, useEffect } from 'react'
import { Save, Key, ExternalLink, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles, FileText, Settings, Copy, Check, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../constants'

const Options = () => {
    // Shared State
    const [activeTab, setActiveTab] = useState<'summarize' | 'settings'>('summarize')

    // Settings State
    const [apiKey, setApiKey] = useState('')
    const [status, setStatus] = useState<'saved' | 'error' | ''>('')
    const [showKey, setShowKey] = useState(false)

    // Summary State
    const [summary, setSummary] = useState('')
    const [loadingSummary, setLoadingSummary] = useState(false)
    const [summaryError, setSummaryError] = useState('')
    const [copied, setCopied] = useState(false)
    const [targetLanguage, setTargetLanguage] = useState('English')

    useEffect(() => {
        // Restore options
        chrome.storage.local.get(['geminiApiKey'], (result: { geminiApiKey?: string }) => {
            if (result.geminiApiKey) {
                setApiKey(result.geminiApiKey)
            }
        })
    }, [])

    const saveOptions = () => {
        if (!apiKey.trim()) {
            setStatus('error')
            setTimeout(() => setStatus(''), 3000)
            return
        }

        chrome.storage.local.set(
            { geminiApiKey: apiKey.trim() },
            () => {
                setStatus('saved')
                setTimeout(() => {
                    setStatus('')
                }, 3000)
            }
        )
    }

    const handleSummarize = async () => {
        if (!apiKey) {
            setActiveTab('settings')
            setSummaryError('Please configure your API Key first.')
            setTimeout(() => setSummaryError(''), 4000)
            return
        }

        setLoadingSummary(true)
        setSummary('')
        setSummaryError('')

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

            if (!tab || !tab.id) {
                throw new Error('Could not access current tab')
            }

            // Extract text from page
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => document.body.innerText
            })

            const pageText = results[0]?.result

            if (!pageText) {
                throw new Error('Could not extract text from page')
            }

            // Limit text length to avoid token limits (simulated for now, can be improved)
            const truncatedText = pageText.substring(0, 20000)

            const response = await chrome.runtime.sendMessage({
                action: 'summarize',
                text: truncatedText,
                targetLanguage
            })

            if (response.error) {
                throw new Error(response.error)
            }

            setSummary(response.summary)
        } catch (err: any) {
            console.error('Summarize error:', err)
            let msg = err.message || 'Failed to summarize page'

            // Rate Limit handling
            if (msg.includes('Quota exceeded') || msg.includes('429')) {
                const retryMatch = msg.match(/Please retry in ([\d.]+)s/)
                const seconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60
                msg = `Rate limit reached. Please wait ${seconds} seconds before trying again.`
            } else if (msg.includes('rate-limit')) {
                msg = 'Rate limit reached. Please wait a moment.'
            }

            setSummaryError(msg)
        } finally {
            setLoadingSummary(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(summary)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-full bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 px-4 pt-4 sticky top-0 z-10 shadow-sm">
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Sparkles className="text-blue-600" size={20} />
                        Translate AI
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('summarize')}
                        className={`flex-1 pb-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'summarize'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText size={18} />
                        Summary
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 pb-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'settings'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Settings size={18} />
                        Settings
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === 'summarize' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 h-fit">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-base font-semibold mb-1">Page Summary</h2>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Generate a concise summary of the current page content using Gemini AI.
                                        </p>

                                        {/* Language Selector */}
                                        <div className="relative mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Summary Language</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm transition-colors"
                                                    value={targetLanguage}
                                                    onChange={(e) => setTargetLanguage(e.target.value)}
                                                >
                                                    {LANGUAGES.map(lang => (
                                                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                    <ChevronDown size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSummarize}
                                            disabled={loadingSummary}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loadingSummary ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={16} />
                                                    Summarize Page
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {summaryError && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 border border-red-100">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                {summaryError}
                            </div>
                        )}

                        {summary && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <FileText size={16} className="text-blue-500" />
                                        Summary Result
                                    </h3>
                                    <button
                                        onClick={handleCopy}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {summary}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                        <Key size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-base font-semibold mb-1">Gemini API Key</h2>
                                        <p className="text-xs text-gray-500 mb-4">
                                            Required for translations and summaries.
                                        </p>

                                        <div className="relative">
                                            <input
                                                type={showKey ? "text" : "password"}
                                                id="apiKey"
                                                className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-xs"
                                                placeholder="AIza..."
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                            />
                                            <button
                                                onClick={() => setShowKey(!showKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                onClick={saveOptions}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                                disabled={!apiKey}
                                            >
                                                <Save size={16} />
                                                Save
                                            </button>
                                        </div>

                                        {status === 'saved' && (
                                            <div className="mt-3 flex items-center gap-2 text-green-600 text-xs font-medium animate-in fade-in">
                                                <CheckCircle size={14} />
                                                Settings saved!
                                            </div>
                                        )}
                                        {status === 'error' && (
                                            <div className="mt-3 flex items-center gap-2 text-red-600 text-xs font-medium animate-in fade-in">
                                                <AlertCircle size={14} />
                                                Invalid API Key
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-5 border-t border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                    How to get a key
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="text-gray-400 font-bold font-mono text-sm pt-0.5">01</div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 text-sm font-medium">Go to Google AI Studio</p>
                                            <a
                                                href="https://aistudio.google.com/app/apikey"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                            >
                                                Open AI Studio <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-200 w-full" />

                                    <div className="flex gap-3">
                                        <div className="text-gray-400 font-bold font-mono text-sm pt-0.5">02</div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 text-sm font-medium">Create API Key</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Click on <span className="font-mono bg-gray-200 px-1 rounded text-[10px]">Create API key</span> button.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-200 w-full" />

                                    <div className="flex gap-3">
                                        <div className="text-gray-400 font-bold font-mono text-sm pt-0.5">03</div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 text-sm font-medium">Copy & Paste</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Copy the generated key string and paste it into the field above.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-gray-400 text-[10px] mt-6">
                            Translate AI Extension • v1.0.0
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Options
