
class MedicalChatbot {
    constructor() {
        this.knowledgeBase = {}; // Stores medical conditions data
        this.loadData(); // Load medical conditions dynamically

        this.intentPatterns = {
            symptoms: [/what are the symptoms of (.+)/i, /symptoms of (.+)/i],
            treatment: [/how to treat (.+)/i, /treatment for (.+)/i, /treatment of (.+)/i],
            disease_lookup: [/which diseases have (.+)/i, /what disease causes (.+)/i]
        };
    }

    async loadData() {
        try {
            const response = await fetch("conditions_real_names_clean.json"); // Ensure correct path
            this.knowledgeBase = await response.json();
            console.log("✅ Medical Data Loaded:", this.knowledgeBase);
        } catch (error) {
            console.error("❌ Error loading medical data:", error);
        }
    }

    processQuery(userInput) {
        console.log("📝 User Input:", userInput);

        for (const [intent, patterns] of Object.entries(this.intentPatterns)) {
            for (const pattern of patterns) {
                const match = userInput.match(pattern);
                console.log("🔍 Checking Pattern:", pattern, "➡ Match:", match);

                if (match) {
                    let entity = match[1].replace(/[^\w\s]|_/g, "").trim().toLowerCase(); // Clean and normalize entity
                    console.log("🎯 Matched Intent:", intent, "💡 Entity:", entity);

                    if (intent === "disease_lookup") {
                        return this.findDiseaseBySymptom(entity);
                    }

                    return this.generateResponse(intent, entity);
                }
            }
        }

        return { message: "I'm not sure I understand. Please ask about symptoms or treatments.", type: "fallback" };
    }

    generateResponse(intent, entity) {
        console.log("🔎 Searching for:", entity);

        // Convert JSON keys to lowercase for matching
        const diseaseKey = Object.keys(this.knowledgeBase).find(
            key => key.toLowerCase() === entity.toLowerCase()
        );

        if (diseaseKey) {
            const condition = this.knowledgeBase[diseaseKey];

            if (intent === "symptoms") {
                return {
                    message: `🩺 **Symptoms of ${diseaseKey}:**\n📌 ${condition.symptoms.join(", ")}`,
                    type: "symptoms"
                };
            } else if (intent === "treatment") {
                return {
                    message: `💊 **Treatment for ${diseaseKey}:**\n\n🩺 **Medicines:** ${condition.medicine || "No specific medicine listed."}\n📌 **General Advice:** ${condition.generalAdvice || "Follow a healthy lifestyle and consult a doctor."}`,
                    type: "treatment"
                };
            }
        }

        return { message: "I don't have information on that condition. Please consult a healthcare provider.", type: "not_found" };
    }

    findDiseaseBySymptom(symptom) {
        console.log("🔎 Searching for diseases with symptom:", symptom);

        let matchingDiseases = [];

        for (const [disease, details] of Object.entries(this.knowledgeBase)) {
            console.log(`➡ Checking ${disease}:`, details.symptoms); // Debugging log

            for (let s of details.symptoms) {
                if (s.toLowerCase().trim() === symptom.toLowerCase().trim()) {
                    matchingDiseases.push(disease);
                    break;
                }
            }
        }

        console.log("📋 Found Diseases:", matchingDiseases); // Log found diseases

        if (matchingDiseases.length > 0) {
            let responseMessage = `🔍 **The symptom '${symptom}' is associated with:**\n\n`;
            matchingDiseases.forEach((disease, index) => {
                responseMessage += `✅ ${index + 1}. ${disease.charAt(0).toUpperCase() + disease.slice(1)}\n`;
            });

            console.log("📝 Response Sent to Chat:", responseMessage); // Final Debugging Log

            return {
                message: responseMessage.trim(),
                type: "reverse_lookup"
            };
        }

        return { message: `No diseases found with the symptom '${symptom}'. Please consult a doctor.`, type: "not_found" };
    }
}

// ✅ Initialize Chatbot
const chatbot = new MedicalChatbot();

// ✅ Handle user input from chat form
document.getElementById("chat-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const userInput = document.getElementById("user-input").value.trim();

    if (!userInput) return;

    appendMessage("You", userInput);

    const response = chatbot.processQuery(userInput);
    appendMessage("MediSync", response.message);

    document.getElementById("user-input").value = ""; // Clear input field
});

// ✅ Append message to chat box
function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender === "You" ? "user" : "bot");
    messageElement.innerHTML = `<strong>${sender}:</strong><br>${message.replace(/\n/g, "<br>")}`; // Supports line breaks
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
}

// ✅ Debugging: Fetch JSON Manually from Console
async function testJsonFetch() {
    try {
        const response = await fetch("conditions_real_names_clean.json"); // Corrected path
        const data = await response.json();
        console.log("🔬 Testing JSON Fetch:", data);
    } catch (error) {
        console.error("❌ JSON Fetch Error:", error);
    }
}

// Uncomment to run this test when the page loads
// testJsonFetch();
