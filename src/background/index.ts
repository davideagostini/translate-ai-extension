
// Helper to find a valid model
async function getValidModel(apiKey: string): Promise<string> {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
        const data = await response.json()

        if (!data.models) {
            console.error('Failed to list models', data)
            return 'gemini-1.5-flash' // Fallback
        }

        const models = data.models as { name: string, supportedGenerationMethods: string[] }[]

        // precise preference list
        const preferred = [
            'models/gemini-1.5-flash',
            'models/gemini-1.5-flash-latest',
            'models/gemini-1.5-flash-001',
            'models/gemini-1.5-pro',
            'models/gemini-1.5-pro-latest',
            'models/gemini-1.0-pro',
            'models/gemini-pro'
        ]

        // Find the first preferred model that exists in the user's list
        const found = preferred.find(p => models.some(m => m.name === p && m.supportedGenerationMethods.includes('generateContent')))

        if (found) return found.replace('models/', '')

        // Fallback: find ANY model that supports generateContent
        const anyModel = models.find(m => m.supportedGenerationMethods.includes('generateContent'))
        if (anyModel) return anyModel.name.replace('models/', '')

        return 'gemini-1.5-flash'
    } catch (e) {
        console.error('Error fetching models:', e)
        return 'gemini-1.5-flash'
    }
}

chrome.runtime.onMessage.addListener((request: { action: string, text: string, targetLanguage?: string }, _sender, sendResponse) => {
    if (request.action === 'translate') {
        (async () => {
            try {
                const result = await chrome.storage.local.get(['geminiApiKey'])
                const apiKey = result.geminiApiKey as string

                if (!apiKey) {
                    console.error('API Key is missing')
                    sendResponse({ error: 'API Key not found. Please set it in options.' })
                    return
                }

                // Dynamically find model
                const modelName = await getValidModel(apiKey)
                console.log('Using Gemini Model:', modelName)

                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
                const targetLang = request.targetLanguage || 'English'

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are a professional translator. 
                                Task: Translate the following text to ${targetLang}.
                                Rules:
                                1. Translate naturally and accurately to ${targetLang}.
                                2. IMPORTANT: Preserve the original formatting, paragraph breaks, and lists. Do not merge paragraphs.
                                3. If the text is already in ${targetLang}, correct any grammar or stylistic errors but keep it in ${targetLang}.
                                4. Return ONLY the translated/corrected text, no explanations.
                                
                                Text to translate: "${request.text}"`
                            }]
                        }]
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('Gemini API Error:', errorData)
                    throw new Error(errorData.error?.message || 'API request failed')
                }

                const data = await response.json()
                const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

                if (!translatedText) {
                    throw new Error('No translation found in response')
                }

                console.log('Translation success:', translatedText)
                sendResponse({ translation: translatedText })

            } catch (error) {
                console.error('Translation error:', error)
                // casting error to any to access message safely
                const msg = (error as any).message || String(error)
                sendResponse({ error: 'Translation failed: ' + msg })
            }
        })()
        return true // Keep channel open
    }

    if (request.action === 'summarize') {
        (async () => {
            try {
                const result = await chrome.storage.local.get(['geminiApiKey'])
                const apiKey = result.geminiApiKey as string

                if (!apiKey) {
                    sendResponse({ error: 'API Key not found. Please set it in Settings.' })
                    return
                }

                const modelName = await getValidModel(apiKey)
                console.log('Summarizing with model:', modelName)

                const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `You are an intelligent AI assistant.
                                Task: Summarize the following web page content in ${request.targetLanguage || 'English'}.
                                Rules:
                                1. Provide a concise summary of the main points.
                                2. Use bullet points for readability if there are multiple key topics.
                                3. Keep the tone neutral and professional.
                                4. If the text seems to be just navigation or footer noise, ignore it and summarize the main content.
                                5. Output must be in ${request.targetLanguage || 'English'}.
                                
                                Text to summarize:
                                "${request.text}"`
                            }]
                        }]
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error?.message || 'API request failed')
                }

                const data = await response.json()
                const summary = data.candidates?.[0]?.content?.parts?.[0]?.text

                if (!summary) throw new Error('No summary generated')

                sendResponse({ summary })

            } catch (error) {
                console.error('Summarize error:', error)
                const msg = (error as any).message || String(error)
                sendResponse({ error: 'Summarization failed: ' + msg })
            }
        })()
        return true
    }
})
