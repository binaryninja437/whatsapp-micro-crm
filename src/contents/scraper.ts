import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["https://web.whatsapp.com/*"]
}

const scrapeChat = () => {
    // Try multiple selectors for contact name (WhatsApp Web DOM changes frequently)
    let contactName = "Unknown Contact"

    // List of invalid/placeholder texts to skip
    const invalidTexts = [
        "click here",
        "contact info",
        "group info",
        "search",
        "type a message",
        "unknown",
        "profile"
    ]

    const isValidName = (text: string | null | undefined): boolean => {
        if (!text) return false
        const lower = text.toLowerCase().trim()
        if (lower.length < 2 || lower.length > 50) return false
        // Skip if contains invalid placeholder text
        for (const invalid of invalidTexts) {
            if (lower.includes(invalid)) return false
        }
        // Skip timestamps (contains :)
        if (lower.includes(':') && lower.length < 10) return false
        return true
    }

    // Method 1: Look for the chat header with span[title] - most reliable
    const headerSpan = document.querySelector('#main header span[title]')
    if (headerSpan && isValidName(headerSpan.getAttribute("title"))) {
        contactName = headerSpan.getAttribute("title")!
    }

    // Method 2: Try the conversation-panel-header
    if (contactName === "Unknown Contact") {
        const panelHeader = document.querySelector('[data-testid="conversation-panel-header"] span[title]')
        if (panelHeader && isValidName(panelHeader.getAttribute("title"))) {
            contactName = panelHeader.getAttribute("title")!
        }
    }

    // Method 3: Look for the first clickable span in header with a title
    if (contactName === "Unknown Contact") {
        const headerArea = document.querySelector('#main header')
        if (headerArea) {
            const titleSpans = headerArea.querySelectorAll('span[title]')
            for (const span of titleSpans) {
                const title = span.getAttribute("title")
                if (isValidName(title)) {
                    contactName = title!
                    break
                }
            }
        }
    }

    // Method 4: Look for the first prominent text in header that looks like a name
    if (contactName === "Unknown Contact") {
        const headerArea = document.querySelector('#main header')
        if (headerArea) {
            const allSpans = headerArea.querySelectorAll('span')
            for (const span of allSpans) {
                const text = span.textContent?.trim()
                // Check if it looks like a name (not too short, not a button/link text)
                if (isValidName(text) && !span.closest('button')) {
                    contactName = text!
                    break
                }
            }
        }
    }

    // Scrape messages - try multiple selectors
    let messages: string[] = []

    // Method 1: Try to find message bubbles with copyable-text
    const copyableMessages = document.querySelectorAll('[data-pre-plain-text]')
    if (copyableMessages.length > 0) {
        const msgArray = Array.from(copyableMessages).slice(-15)
        messages = msgArray.map(el => {
            // Get the actual message text, not metadata
            const textSpan = el.querySelector('span.selectable-text')
            return textSpan?.textContent || el.textContent || ""
        }).filter(msg => msg.trim().length > 0)
    }

    // Method 2: Try div[role="row"] with message text
    if (messages.length === 0) {
        const messageRows = Array.from(document.querySelectorAll('div[role="row"]')).slice(-15)
        messages = messageRows.map((row) => {
            // Try specific message text selector
            const msgText = row.querySelector('.selectable-text')?.textContent
            if (msgText) return msgText
            return row.textContent || ""
        }).filter(msg => msg.trim().length > 0 && msg.length < 1000)
    }

    // Method 3: Try message-in and message-out classes
    if (messages.length === 0) {
        const allMessages = document.querySelectorAll('.message-in, .message-out')
        const msgArray = Array.from(allMessages).slice(-15)
        messages = msgArray.map(el => {
            const textEl = el.querySelector('.selectable-text, [data-testid="msg-text"]')
            return textEl?.textContent || ""
        }).filter(msg => msg.trim().length > 0)
    }

    // Method 4: Last resort - get all span.selectable-text directly
    if (messages.length === 0) {
        const selectableTexts = document.querySelectorAll('#main span.selectable-text')
        const msgArray = Array.from(selectableTexts).slice(-15)
        messages = msgArray.map(el => el.textContent || "").filter(msg => msg.trim().length > 0)
    }

    return {
        contactName,
        messages
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SCRAPE_CHAT") {
        try {
            const data = scrapeChat()
            sendResponse({ success: true, data })
        } catch (error) {
            console.error("Scraping failed:", error)
            sendResponse({ success: false, error: error.message })
        }
    }
})
