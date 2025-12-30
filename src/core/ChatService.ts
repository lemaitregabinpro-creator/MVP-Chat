/**
 * ChatService - Gestion des données et logique métier du chat
 */

import type { Message, MessageSender } from '../types';
import { HotLeadEngine } from './HotLeadEngine';

export interface ChatServiceConfig {
    simulationEnabled?: boolean;
    simulationDelay?: number;
    simulationInterval?: number;
    autoResponseDelay?: number;
}

export class ChatService {
    private messages: Message[] = [];
    private hotLeadEngine: HotLeadEngine;
    private config: Required<ChatServiceConfig>;
    private simulationIntervalId: number | null = null;
    private messageIndex: number = 0;
    private onMessageCallbacks: Array<(message: Message) => void> = [];

    // Messages prédéfinis pour la simulation
    private readonly sampleMessages: Array<{ text: string; sender: MessageSender; isHotLead?: boolean }> = [
        { text: "Quel est le prix de cet appartement ?", sender: "user", isHotLead: true },
        { text: "L'appartement est-il disponible immédiatement ?", sender: "user", isHotLead: false },
        { text: "Je souhaite visiter cette semaine si possible.", sender: "user", isHotLead: false },
        { text: "Quel est le montant du loyer mensuel ?", sender: "user", isHotLead: true },
        { text: "Y a-t-il des charges supplémentaires ?", sender: "user", isHotLead: false },
        { text: "Je suis prêt à acheter si le prix est correct.", sender: "user", isHotLead: true },
        { text: "Pouvez-vous me donner plus de détails sur le quartier ?", sender: "user", isHotLead: false },
        { text: "Quel est le prix final avec toutes les charges ?", sender: "user", isHotLead: true },
    ];

    constructor(config: ChatServiceConfig = {}) {
        this.hotLeadEngine = new HotLeadEngine();
        this.config = {
            simulationEnabled: config.simulationEnabled ?? true,
            simulationDelay: config.simulationDelay ?? 3000,
            simulationInterval: config.simulationInterval ?? 2000,
            autoResponseDelay: config.autoResponseDelay ?? 1000,
        };
    }

    /**
     * Ajoute un message au chat
     * @param text - Texte du message
     * @param sender - Expéditeur du message
     * @returns Le message créé
     */
    addMessage(text: string, sender: MessageSender = 'user'): Message {
        const message: Message = {
            id: this.generateMessageId(),
            text: text.trim(),
            sender,
            timestamp: new Date(),
            isHotLead: false,
        };

        // Détecter si c'est un Hot Lead
        if (sender === 'user') {
            message.isHotLead = this.hotLeadEngine.isHotLead(message);
        }

        this.messages.push(message);
        
        // Notifier les callbacks
        this.notifyMessageCallbacks(message);
        
        return message;
    }

    /**
     * Génère une réponse automatique (simulation)
     * @returns Le message de réponse
     */
    generateAutoResponse(): Message {
        const responses = [
            "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
            "Je prends note de votre demande et vous recontacterai rapidement.",
            "Votre message a bien été reçu. Nous vous répondrons sous peu.",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return this.addMessage(randomResponse, 'ai');
    }

    /**
     * Récupère tous les messages
     * @returns Liste des messages
     */
    getMessages(): Message[] {
        return [...this.messages]; // Retourne une copie pour éviter les mutations externes
    }

    /**
     * Récupère le dernier message
     * @returns Dernier message ou null
     */
    getLastMessage(): Message | null {
        return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
    }

    /**
     * Vérifie si le dernier message est un Hot Lead
     * @returns true si le dernier message est un Hot Lead
     */
    isLastMessageHotLead(): boolean {
        const lastMessage = this.getLastMessage();
        return lastMessage?.isHotLead ?? false;
    }

    /**
     * Démarre la simulation automatique
     */
    startSimulation(): void {
        if (!this.config.simulationEnabled || this.simulationIntervalId !== null) {
            return;
        }

        setTimeout(() => {
            this.simulationIntervalId = window.setInterval(() => {
                this.simulateNextMessage();
            }, this.config.simulationInterval);
        }, this.config.simulationDelay);
    }

    /**
     * Arrête la simulation automatique
     */
    stopSimulation(): void {
        if (this.simulationIntervalId !== null) {
            clearInterval(this.simulationIntervalId);
            this.simulationIntervalId = null;
        }
    }

    /**
     * Simule l'ajout du prochain message
     */
    private simulateNextMessage(): void {
        if (this.messageIndex >= this.sampleMessages.length) {
            this.messageIndex = 0; // Réinitialiser pour boucler
        }

        const sample = this.sampleMessages[this.messageIndex];
        this.addMessage(sample.text, sample.sender);
        
        this.messageIndex++;
    }

    /**
     * Génère un ID unique pour un message
     * @returns ID unique
     */
    private generateMessageId(): string {
        return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Active ou désactive la simulation
     * @param enabled - État de la simulation
     */
    setSimulationEnabled(enabled: boolean): void {
        this.config.simulationEnabled = enabled;
        if (enabled) {
            this.startSimulation();
        } else {
            this.stopSimulation();
        }
    }

    /**
     * Récupère l'instance du HotLeadEngine
     * @returns Instance du HotLeadEngine
     */
    getHotLeadEngine(): HotLeadEngine {
        return this.hotLeadEngine;
    }

    /**
     * Récupère le délai de réponse automatique
     * @returns Délai en millisecondes
     */
    getAutoResponseDelay(): number {
        return this.config.autoResponseDelay;
    }

    /**
     * Enregistre un callback appelé à chaque nouveau message
     * @param callback - Fonction appelée avec le nouveau message
     */
    onMessage(callback: (message: Message) => void): void {
        this.onMessageCallbacks.push(callback);
    }

    /**
     * Notifie tous les callbacks d'un nouveau message
     * @param message - Message à notifier
     */
    private notifyMessageCallbacks(message: Message): void {
        this.onMessageCallbacks.forEach(callback => {
            try {
                callback(message);
            } catch (error) {
                console.error('Error in message callback:', error);
            }
        });
    }
}

