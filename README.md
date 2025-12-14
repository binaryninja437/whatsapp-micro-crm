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

---

## 💡 The Problem & Solution

### ❌ The Problem
Solo professionals (tutors, photographers, consultants) run their entire business on **WhatsApp**, but WhatsApp was never designed to be a CRM:

- Leads get buried under personal and group chats  
- “I’ll pay you next week” promises are forgotten  
- No dashboard to track pending, active, or closed revenue  
- No visibility into how much money is actually on the table  

---

### ✅ The Solution
A **Sidecar CRM extension for WhatsApp Web** that works alongside your chats:

- **Snap** → Extracts deal details (Name, Status, Money) from chat text using AI  
- **Save** → Stores the lead securely in a cloud database (Supabase)  
- **Track** → Visual pipeline showing active deals and total potential revenue  

---

## 🎯 Who Is This For?

- **Freelance Tutors** – Track student inquiries and fee payments  
- **Wedding Photographers** – Manage bookings, dates, and deposits  
- **Real Estate Agents** – Organize hot leads vs. window shoppers  
- **Home Bakers / Cloud Kitchens** – Track orders placed via DMs  

---

## 🛠️ Tech Stack

- **Framework:** Plasmo (React for Chrome Extensions)  
- **UI:** Tailwind CSS  
- **Backend:** Supabase (PostgreSQL)  
- **AI:** OpenAI (GPT-4o-mini)  
- **Language:** TypeScript  
