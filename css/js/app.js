/**
 * Weliive AI Co-Pilot - Chat Manager
 * Gère l'état et les interactions du chat
 */

class ChatManager {
    constructor() {
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput');
        this.aiAlert = document.getElementById('aiAlert');
        
        // Configuration de la simulation
        this.simulationEnabled = true;
        this.simulationDelay = 3000; // Délai avant démarrage (ms)
        this.simulationInterval = 2000; // Intervalle entre messages (ms)
        this.alertAutoHideDelay = 8000; // Délai avant masquage auto de l'alerte (ms)
        
        // Messages prédéfinis pour la simulation
        this.sampleMessages = [
            { text: "Quel est le prix de cet appartement ?", type: "user", trigger: true },
            { text: "L'appartement est-il disponible immédiatement ?", type: "user", trigger: false },
            { text: "Je souhaite visiter cette semaine si possible.", type: "user", trigger: false },
            { text: "Quel est le montant du loyer mensuel ?", type: "user", trigger: true },
            { text: "Y a-t-il des charges supplémentaires ?", type: "user", trigger: false },
            { text: "Je suis prêt à acheter si le prix est correct.", type: "user", trigger: true },
            { text: "Pouvez-vous me donner plus de détails sur le quartier ?", type: "user", trigger: false },
            { text: "Quel est le prix final avec toutes les charges ?", type: "user", trigger: true },
        ];
        
        this.messageIndex = 0;
        this.chatInterval = null;
        
        this.init();
    }
    
    /**
     * Initialise le ChatManager
     */
    init() {
        this.setupEventListeners();
        
        if (this.simulationEnabled) {
            this.startChatSimulation();
        }
    }
    
    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Envoi de message avec le bouton
        const sendButton = document.querySelector('.send-button');
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        // Envoi de message avec la touche Entrée
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    this.sendMessage();
                }
            });
            
            // Arrêter la simulation si l'utilisateur tape
            this.messageInput.addEventListener('input', () => {
                this.stopChatSimulation();
            });
        }
        
        // Bouton d'action de l'alerte Hot Lead
        const alertButton = document.querySelector('.ai-alert-button');
        if (alertButton) {
            alertButton.addEventListener('click', () => this.handleHotLead());
        }
    }
    
    /**
     * Obtient l'heure actuelle au format HH:MM
     * @returns {string} Heure formatée
     */
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    
    /**
     * Ajoute un message à la zone de chat
     * @param {string} text - Texte du message
     * @param {string} type - Type de message ('user' ou 'ai')
     */
    addMessage(text, type = 'user') {
        if (!this.messagesArea) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        messageDiv.appendChild(textDiv);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();
        messageDiv.appendChild(timeDiv);
        
        this.messagesArea.appendChild(messageDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        
        // Vérifier si le message déclenche une alerte Hot Lead
        if (this.detectHotLead(text)) {
            this.showHotLeadAlert();
        }
    }
    
    /**
     * Envoie un message depuis l'input
     */
    sendMessage() {
        if (!this.messageInput) return;
        
        const text = this.messageInput.value.trim();
        if (text) {
            this.addMessage(text, 'user');
            this.messageInput.value = '';
            
            // Réponse automatique après 1 seconde
            setTimeout(() => {
                this.addMessage("Merci pour votre message. Je vous répondrai dans les plus brefs délais.", 'ai');
            }, 1000);
        }
    }
    
    /**
     * Détecte si un message contient des mots-clés indiquant un "Hot Lead"
     * Cette fonction peut être remplacée par une vraie IA plus tard
     * @param {string} messageText - Texte du message à analyser
     * @returns {boolean} True si un Hot Lead est détecté
     */
    detectHotLead(messageText) {
        if (!messageText || typeof messageText !== 'string') {
            return false;
        }
        
        const lowerText = messageText.toLowerCase();
        const hotLeadKeywords = ['prix', 'acheter', 'achat', 'loyer', 'montant'];
        
        return hotLeadKeywords.some(keyword => lowerText.includes(keyword));
    }
    
    /**
     * Affiche l'alerte Hot Lead
     */
    showHotLeadAlert() {
        if (!this.aiAlert) return;
        
        this.aiAlert.classList.add('show');
        
        // Masquer l'alerte automatiquement après le délai configuré
        setTimeout(() => {
            this.hideHotLeadAlert();
        }, this.alertAutoHideDelay);
    }
    
    /**
     * Masque l'alerte Hot Lead
     */
    hideHotLeadAlert() {
        if (!this.aiAlert) return;
        
        this.aiAlert.classList.remove('show');
    }
    
    /**
     * Gère l'action du bouton Hot Lead
     */
    handleHotLead() {
        this.hideHotLeadAlert();
        this.addMessage("✅ Alerte Hot Lead traitée - Contact prioritaire activé", 'ai');
    }
    
    /**
     * Simule l'ajout d'un message automatique
     */
    simulateChat() {
        if (this.messageIndex >= this.sampleMessages.length) {
            this.messageIndex = 0; // Réinitialiser pour boucler
        }
        
        const message = this.sampleMessages[this.messageIndex];
        this.addMessage(message.text, message.type);
        
        this.messageIndex++;
    }
    
    /**
     * Démarre la simulation automatique du chat
     */
    startChatSimulation() {
        if (!this.simulationEnabled) return;
        
        setTimeout(() => {
            this.chatInterval = setInterval(() => {
                this.simulateChat();
            }, this.simulationInterval);
        }, this.simulationDelay);
    }
    
    /**
     * Arrête la simulation automatique du chat
     */
    stopChatSimulation() {
        if (this.chatInterval) {
            clearInterval(this.chatInterval);
            this.chatInterval = null;
        }
    }
    
    /**
     * Active ou désactive la simulation
     * @param {boolean} enabled - État de la simulation
     */
    setSimulationEnabled(enabled) {
        this.simulationEnabled = enabled;
        if (!enabled) {
            this.stopChatSimulation();
        } else {
            this.startChatSimulation();
        }
    }
}

// Initialisation au chargement de la page
let chatManager;

window.addEventListener('DOMContentLoaded', () => {
    chatManager = new ChatManager();
});

// Exposer certaines fonctions globalement pour compatibilité avec les attributs onclick dans le HTML
// (Bien que nous ayons migré vers des event listeners, on garde ces fonctions pour compatibilité)
window.handleHotLead = function() {
    if (chatManager) {
        chatManager.handleHotLead();
    }
};

window.sendMessage = function() {
    if (chatManager) {
        chatManager.sendMessage();
    }
};

window.handleKeyPress = function(event) {
    if (chatManager && event.key === 'Enter') {
        chatManager.sendMessage();
    }
};

