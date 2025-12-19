import { useState, useEffect, useRef } from 'react'
import { Sparkles, X, Copy, Check, Languages, ChevronDown } from 'lucide-react'
import { LANGUAGES } from '../constants'

const Content = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [showButton, setShowButton] = useState(false)
    const [showPanel, setShowPanel] = useState(false)
    const [translation, setTranslation] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [targetLanguage, setTargetLanguage] = useState('Italian') // Default
    const [showLangMenu, setShowLangMenu] = useState(false)

    const selectedTextRef = useRef('')
    const rangeRef = useRef<Range | null>(null)

    const updatePosition = () => {
        if (!rangeRef.current) return

        try {
            const rect = rangeRef.current.getBoundingClientRect()

            // Check if selection is practically off-screen or invisible
            if (rect.width === 0 && rect.height === 0) {
                setShowButton(false)
                return
            }

            // Viewport coordinates (Host is Fixed)
            const x = rect.left + (rect.width / 2)
            const y = rect.bottom + 20

            setPosition({ x, y })
        } catch (e) {
            console.error('Pos Error', e)
        }
    }

    useEffect(() => {
        const handleSelectionChange = () => {
            // Delay slightly to let selection finalize
            setTimeout(() => {
                const sel = window.getSelection()
                const text = sel?.toString().trim()

                if (text && text.length > 0) {
                    if (!showPanel) {
                        try {
                            const range = sel!.getRangeAt(0)
                            rangeRef.current = range // Store range for scroll updates
                            updatePosition() // Initial pos

                            selectedTextRef.current = text
                            setShowButton(true)
                        } catch (e) {
                            console.error('Range error', e)
                        }
                    }
                } else {
                    if (!showPanel) setShowButton(false)
                    rangeRef.current = null
                }
            }, 10)
        }

        // Add Scroll listener to window to update position
        const handleScroll = () => {
            if (rangeRef.current && (showButton || showPanel)) {
                updatePosition()
            }
        }

        document.addEventListener('mouseup', handleSelectionChange)
        document.addEventListener('keyup', handleSelectionChange)
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('resize', handleScroll, { passive: true })

        return () => {
            document.removeEventListener('mouseup', handleSelectionChange)
            document.removeEventListener('keyup', handleSelectionChange)
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleScroll)
        }
    }, [showPanel, showButton])

    const handleTranslate = async (overrideLang?: string) => {
        const langToUse = overrideLang || targetLanguage

        setShowButton(false)
        setShowPanel(true)
        setLoading(true)
        setTranslation('')
        setShowLangMenu(false)

        try {
            if (!chrome.runtime?.id) {
                throw new Error('Extension context invalidated. Please refresh the page.')
            }

            const response = await chrome.runtime.sendMessage({
                action: 'translate',
                text: selectedTextRef.current,
                targetLanguage: langToUse
            }).catch(err => {
                if (err.message && err.message.includes('validated')) {
                    return { error: 'Extension updated. Please refresh the page.' }
                }
                return { error: 'Communication error: ' + err.message }
            })

            if (!response) {
                setTranslation('Error: No response from extension.')
            } else if (response.error) {
                setTranslation(response.error)
            } else {
                setTranslation(response.translation)
            }
        } catch (err: any) {
            console.error('Translation error:', err)
            const msg = err.message || 'Unknown error'
            if (msg.includes('invalidated')) {
                setTranslation('Extension updated. Please refresh the page.')
            } else {
                setTranslation('Error: ' + msg)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setShowPanel(false)
        setShowButton(false)
        setTranslation('')
        setShowLangMenu(false)
        rangeRef.current = null // Clear range on close
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(translation)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleLangMenu = () => setShowLangMenu(!showLangMenu)

    const selectLanguage = (lang: string) => {
        setTargetLanguage(lang)
        handleTranslate(lang)
    }

    if (!showButton && !showPanel) return null

    return (
        <div style={{ pointerEvents: 'auto' }}>
            {showButton && (
                <button
                    onClick={() => handleTranslate()}
                    className="absolute z-50 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer border border-blue-100 flex items-center justify-center animate-in fade-in zoom-in duration-200"
                    style={{
                        top: position.y,
                        left: position.x,
                        transform: 'translate(-50%, -50%)'
                    }}
                    title={`Translate to ${targetLanguage}`}
                >
                    <Sparkles size={20} fill="currentColor" className="text-blue-500" />
                </button>
            )}

            {showPanel && (
                <div
                    className="fixed z-50 bg-white/75 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-[16px] w-[380px] font-sans text-gray-800 animate-in fade-in slide-in-from-bottom-5 duration-300"
                    style={{
                        top: Math.max(20, position.y),
                        left: Math.max(20, Math.min(window.innerWidth - 320, position.x - 160)), // Keep within bounds
                        boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.3), 0 10px 20px -5px rgba(0, 0, 0, 0.1)' // Deeper shadow
                    }}
                >
                    <div className="flex justify-between items-center mb-[12px] border-b border-gray-200/40 pb-[8px] relative">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={toggleLangMenu}
                                className="flex items-center gap-1.5 px-[8px] py-[4px] rounded-md hover:bg-white/30 transition-colors text-[14px] font-medium text-gray-700"
                            >
                                <Languages size={14} className="text-gray-600" />
                                <span>{targetLanguage}</span>
                                <ChevronDown size={12} className={`transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showLangMenu && (
                                <div className="absolute top-full left-0 mt-[8px] w-[130px] bg-white/95 backdrop-blur-xl border border-white/50 rounded-lg shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-black/5">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => selectLanguage(lang.code)}
                                            className={`w-full text-left px-[12px] py-[8px] text-[14px] hover:bg-blue-50 transition-colors ${targetLanguage === lang.code ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-gray-700'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition-colors p-[4px] rounded-full hover:bg-white/20">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="text-[14px] leading-relaxed max-h-[240px] overflow-y-auto custom-scrollbar min-h-[60px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-[24px] space-y-[12px]">
                                <div className="relative">
                                    <div className="w-[32px] h-[32px] border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
                                    <Sparkles size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" />
                                </div>
                                <span className="text-[12px] text-gray-500 font-medium">Translating to {targetLanguage}...</span>
                            </div>
                        ) : (
                            <p className="text-gray-800 font-medium whitespace-pre-wrap">{translation}</p>
                        )}
                    </div>

                    {!loading && translation && (
                        <div className="mt-[12px] pt-[8px] border-t border-gray-200/40 flex justify-end">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 text-[12px] text-gray-600 hover:text-blue-600 transition-colors px-[8px] py-[4px] rounded hover:bg-white/50"
                            >
                                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Content
