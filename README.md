# 🚀 WhatsApp Micro-CRM (MVP)

**Turn your WhatsApp Chat History into a Revenue Pipeline.**  
An *Indie Hacker* browser extension that connects **WhatsApp Web** with **OpenAI** and **Supabase**.

```mermaid
graph TD
    A[User on WhatsApp Web] -->|Opens Chat| B[Chat Interface]
    B -->|Clicks Snap Chat| C[Content Script]
    C -->|Extracts Messages| D[Extension Side Panel]
    D -->|AI Processing| E{OpenAI GPT-4o-mini}
    E -->|Structured JSON| D
    D -->|Store Lead| F[(Supabase Database)]
    F -->|Read Data| G[Pipeline Dashboard]
