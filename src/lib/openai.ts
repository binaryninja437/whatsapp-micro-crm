import OpenAI from "openai"

const apiKey = process.env.PLASMO_PUBLIC_OPENAI_KEY

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required because extensions run in the browser
})

interface LeadAnalysis {
    summary: string
    status: string
    next_step: string
    deal_value: string
}

export async function analyzeChatWithAI(chatText: string): Promise<LeadAnalysis> {
    if (!apiKey) {
        console.warn("No OpenAI API key found")
        return {
            summary: "API key not configured",
            status: "Cold",
            next_step: "Configure OpenAI API key",
            deal_value: "Unknown"
        }
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cheapest and fastest model
            messages: [
                {
                    role: "system",
                    content: `You are a CRM Assistant for a freelancer. 
          Analyze the WhatsApp chat history provided. 
          Extract the following fields in strict JSON format:
          1. summary: A 1-sentence summary of the business intent.
          2. status: One of ["Hot Lead", "Warm Lead", "Cold", "Closed", "Pending Payment"].
          3. next_step: A concrete action item (e.g., "Send Invoice", "Follow up on Tuesday").
          4. deal_value: Estimated money involved (e.g. "₹50,000" or "Unknown").
          
          If the chat is personal or junk, set status to "Cold".`
                },
                {
                    role: "user",
                    content: chatText
                }
            ],
            response_format: { type: "json_object" } // Enforces valid JSON
        })

        // Parse the clean JSON from OpenAI
        const result = JSON.parse(response.choices[0].message.content || "{}")
        return {
            summary: result.summary || "No summary",
            status: result.status || "Cold",
            next_step: result.next_step || "Review manually",
            deal_value: result.deal_value || "Unknown"
        }
    } catch (error) {
        console.error("OpenAI API error:", error)
        return {
            summary: `AI analysis failed: ${error.message}`,
            status: "Cold",
            next_step: "Manual review required",
            deal_value: "Unknown"
        }
    }
}
