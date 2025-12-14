import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import { analyzeChatWithAI } from "./lib/openai"
import "./style.css"
import { clsx } from "clsx"

// --- Helper: Color Logic ---
const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || ""
    if (s.includes("hot") || s.includes("urgent")) return "bg-red-100 text-red-800 border-red-200"
    if (s.includes("warm") || s.includes("negotiation")) return "bg-amber-100 text-amber-800 border-amber-200"
    if (s.includes("closed") || s.includes("won") || s.includes("paid")) return "bg-green-100 text-green-800 border-green-200"
    if (s.includes("cold") || s.includes("junk")) return "bg-slate-100 text-slate-600 border-slate-200"
    return "bg-blue-50 text-blue-600 border-blue-100"
}

// --- Component: Dashboard View ---
function Dashboard() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLeads = async () => {
        setLoading(true)
        // Fetch all leads, newest first
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Error fetching leads:", error)
        } else {
            setLeads(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    if (loading) return <div className="p-8 text-center text-gray-400">Loading Pipeline...</div>

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 pb-20">
            {/* 💰 Money Header */}
            <div className="bg-black text-white p-4 rounded-xl mb-4 shadow-lg">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Pipeline</h2>
                <p className="text-2xl font-bold">~ {leads.length} Active Leads</p>
            </div>

            <div className="space-y-3">
                {leads.map((lead) => {
                    // Parse the summary which is stored as JSON
                    const summaryData = typeof lead.summary === 'string' ? JSON.parse(lead.summary) : lead.summary
                    const status = summaryData?.status || "Unknown"
                    const summaryText = summaryData?.summary || JSON.stringify(summaryData)
                    const dealValue = summaryData?.deal_value || ""

                    return (
                        <div key={lead.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-800 truncate w-32">{lead.contact_name}</h3>
                                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full border", getStatusColor(status))}>
                                    {status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{summaryText}</p>
                            {dealValue && dealValue !== "Unknown" && (
                                <div className="mt-1 text-sm font-bold text-green-600">{dealValue}</div>
                            )}
                            <div className="mt-2 text-[10px] text-gray-400 font-mono">
                                {new Date(lead.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// --- Component: Main App ---
export default function SidePanel() {
    const [activeTab, setActiveTab] = useState<"snap" | "dashboard">("snap")
    const [snapStatus, setSnapStatus] = useState("idle")
    const [currentLead, setCurrentLead] = useState<any>(null)

    const handleSnap = async () => {
        setSnapStatus("loading")
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!tab?.id) return

        chrome.tabs.sendMessage(tab.id, { action: "SCRAPE_CHAT" }, async (response) => {
            if (!response || !response.success) {
                setSnapStatus("error")
                alert("Please open a chat on WhatsApp Web first.")
                return
            }

            try {
                const chatHistory = response.data.messages?.join("\n") || ""
                const aiResult = await analyzeChatWithAI(chatHistory)

                await supabase.from("leads").insert({
                    contact_name: response.data.contactName,
                    summary: aiResult,
                    messages: response.data.messages
                })

                setCurrentLead({
                    name: response.data.contactName,
                    status: aiResult.status,
                    summary: aiResult.summary,
                    deal_value: aiResult.deal_value,
                    next_step: aiResult.next_step
                })
                setSnapStatus("success")
            } catch (err) {
                setSnapStatus("idle")
                alert("Error: " + err.message)
            }
        })
    }

    return (
        <div className="w-full h-screen flex flex-col font-sans bg-white">
            {/* View Container */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === "dashboard" ? (
                    <Dashboard />
                ) : (
                    // SNAP VIEW
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        {snapStatus === "success" && currentLead ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
                                <div className={clsx("p-4 rounded-xl border shadow-sm", getStatusColor(currentLead.status))}>
                                    <h2 className="text-xl font-bold">{currentLead.name}</h2>
                                    <div className="mt-1 text-sm opacity-90">{currentLead.status}</div>
                                    {currentLead.deal_value && currentLead.deal_value !== "Unknown" && (
                                        <div className="mt-2 text-lg font-bold">{currentLead.deal_value}</div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Summary</h3>
                                    <p className="text-sm text-gray-700">{currentLead.summary}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Next Step</h3>
                                    <p className="text-sm text-gray-700">{currentLead.next_step}</p>
                                </div>
                                <button onClick={() => setSnapStatus("idle")} className="w-full text-gray-400 text-xs py-2 hover:text-gray-600">← Scan Next</button>
                            </div>
                        ) : snapStatus === "loading" ? (
                            <div className="h-full flex flex-col justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
                                <p className="text-gray-500 text-sm">Extracting Deal Info...</p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col justify-center items-center">
                                <div className="text-4xl mb-4">📸</div>
                                <p className="text-gray-500 text-sm mb-6 text-center px-4">
                                    Open a client chat and click Snap to extract deal details.
                                </p>
                                <button
                                    onClick={handleSnap}
                                    className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
                                >
                                    Snap Chat
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 📱 Bottom Tab Bar */}
            <div className="h-14 border-t border-gray-200 bg-white grid grid-cols-2">
                <button
                    onClick={() => setActiveTab("snap")}
                    className={clsx("flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                        activeTab === "snap" ? "text-black bg-gray-50" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <span>📸 Snap</span>
                </button>
                <button
                    onClick={() => setActiveTab("dashboard")}
                    className={clsx("flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
                        activeTab === "dashboard" ? "text-black bg-gray-50" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <span>📊 Pipeline</span>
                </button>
            </div>
        </div>
    )
}
