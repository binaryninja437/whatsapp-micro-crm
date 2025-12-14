# 🚀 WhatsApp Micro-CRM (MVP)

**Turn your WhatsApp Chat History into a Revenue Pipeline.**  
An *Indie Hacker* browser extension that connects **WhatsApp Web** to **OpenAI** & **Supabase**.

---

## 🌳 How It Works (Architecture)

```mermaid
graph TD
    A[User on WhatsApp Web] -->|Opens Chat| B(Chat Interface)
    B -->|Clicks 'Snap Chat'| C[Content Script]
    C -->|Scrapes Last 15 Msgs| D[Extension Side Panel]
    D -->|Sends Text| E{OpenAI GPT-4o}
    E -->|Returns JSON| D
    D -->|Saves Lead| F[(Supabase Database)]
    F -->|Fetches All Leads| G[Pipeline Dashboard]

## 💡 The Problem & Solution

### ❌ The Problem

Solo professionals (tutors, photographers, consultants) run their businesses on **WhatsApp**:

- Leads get buried under personal chats  
- “I’ll pay you next week” promises are forgotten  
- No dashboard to see how much money is pending  

### ✅ The Solution

A **“Sidecar” browser extension** for WhatsApp Web.

- **Snap**: Extracts deal details (Name, Status, Money) from chat text using AI  
- **Save**: Stores the lead in a cloud database (Supabase)  
- **Track**: Shows a pipeline view of all active deals and total potential revenue  

---

## 🎯 Who Is This For?

- **Freelance Tutors** – tracking student inquiries and fee payments  
- **Wedding Photographers** – managing inquiry dates and booking deposits  
- **Real Estate Agents** – organizing hot leads vs. window shoppers  
- **Home Bakers / Cloud Kitchens** – tracking orders placed via DMs  

---

## 🛠️ Tech Stack

- **Framework**: Plasmo (React for Chrome Extensions)  
- **UI**: Tailwind CSS  
- **Backend**: Supabase (PostgreSQL)  
- **AI**: OpenAI (GPT-4o-mini)  
- **Language**: TypeScript  

---

## 🚀 Quick Start Guide

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/whatsapp-micro-crm.git
cd whatsapp-micro-crm
npm install
# or
pnpm install
