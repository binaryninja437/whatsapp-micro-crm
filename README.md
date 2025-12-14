# 🚀 WhatsApp Micro-CRM (MVP)

**Turn your WhatsApp Chat History into a Revenue Pipeline.**  
An *Indie Hacker* browser extension that connects **WhatsApp Web** with **OpenAI** and **Supabase**.

---

## 🌳 How It Works (Architecture)

```mermaid
graph TD
    A[User on WhatsApp Web] -->|Opens Chat| B[Chat Interface]
    B -->|Clicks 'Snap Chat'| C[Content Script]
    C -->|Scrapes Last 15 Messages| D[Extension Side Panel]
    D -->|Sends Text| E{OpenAI GPT-4o}
    E -->|Returns JSON| D
    D -->|Saves Lead| F[(Supabase Database)]
    F -->|Fetches All Leads| G[Pipeline Dashboard]
