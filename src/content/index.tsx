import React from 'react'
import ReactDOM from 'react-dom/client'
import Content from './Content'
import styles from '../index.css?inline'

const rootId = 'translate-ai-extension-root'

// Create host element
console.log('Translate AI: Injecting host element...')
const host = document.createElement('div')
host.id = rootId
host.style.position = 'fixed'
host.style.top = '0'
host.style.left = '0'
host.style.width = '100vw'
host.style.height = '100vh'
host.style.zIndex = '2147483647'
host.style.pointerEvents = 'none'
document.body.appendChild(host)
console.log('Translate AI: Host appended')

// Create shadow root
const shadow = host.attachShadow({ mode: 'open' })

// Inject styles
const styleSheet = document.createElement('style')
styleSheet.textContent = styles
shadow.appendChild(styleSheet)

// Render React App
const root = ReactDOM.createRoot(shadow)
root.render(
    <React.StrictMode>
        <Content />
    </React.StrictMode>
)
