/**
 * AISummaryModal - Gestion de la modale Résumé IA
 */

import { propertySummaries } from '../config/propertyData';

export class AISummaryModal {
    private modal: HTMLElement;
    private overlay: HTMLElement;
    private closeButton: HTMLButtonElement;
    private summaryText: HTMLElement;
    private chatMessages: HTMLElement;
    private chatInput: HTMLInputElement;
    private chatSend: HTMLButtonElement;
    private currentPropertyId: string | null = null;

    constructor() {
        const modalEl = document.getElementById('ai-summary-modal');
        const overlayEl = document.getElementById('aiSummaryModalOverlay');
        const closeEl = document.getElementById('aiSummaryModalClose') as HTMLButtonElement;
        const summaryEl = document.getElementById('ai-summary-text');
        const messagesEl = document.getElementById('aiSummaryChatMessages');
        const inputEl = document.getElementById('aiSummaryChatInput') as HTMLInputElement;
        const sendEl = document.getElementById('aiSummaryChatSend') as HTMLButtonElement;

        if (!modalEl || !overlayEl || !closeEl || !summaryEl || !messagesEl || !inputEl || !sendEl) {
            throw new Error('Required AI Summary Modal elements not found');
        }

        this.modal = modalEl;
        this.overlay = overlayEl;
        this.closeButton = closeEl;
        this.summaryText = summaryEl;
        this.chatMessages = messagesEl;
        this.chatInput = inputEl;
        this.chatSend = sendEl;

        this.setupListeners();
    }

    /**
     * Configure les écouteurs d'événements
     */
    private setupListeners(): void {
        // Fermer la modale
        this.closeButton.addEventListener('click', () => {
            this.hide();
        });

        this.overlay.addEventListener('click', () => {
            this.hide();
        });

        // Envoyer un message
        this.chatSend.addEventListener('click', () => {
            this.handleChatSubmit();
        });

        this.chatInput.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                this.handleChatSubmit();
            }
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    /**
     * Affiche la modale avec le résumé du bien
     * @param propertyId - ID du bien (paris, lyon, nice)
     */
    show(propertyId: string): void {
        const propertyData = propertySummaries[propertyId];
        
        if (!propertyData) {
            console.error(`Property data not found for ID: ${propertyId}`);
            return;
        }

        this.currentPropertyId = propertyId;
        this.summaryText.textContent = propertyData.summary;
        this.chatMessages.innerHTML = '';
        this.chatInput.value = '';
        this.modal.classList.remove('hidden');
        this.chatInput.focus();
    }

    /**
     * Masque la modale
     */
    hide(): void {
        this.modal.classList.add('hidden');
        this.chatInput.value = '';
        this.currentPropertyId = null;
    }

    /**
     * Gère l'envoi d'un message dans le chat IA
     */
    private handleChatSubmit(): void {
        if (!this.currentPropertyId) {
            return;
        }

        const question = this.chatInput.value.trim();
        
        if (!question) {
            return;
        }

        // Afficher la question de l'utilisateur
        this.renderChatMessage(question, 'user');

        // Vider l'input
        this.chatInput.value = '';

        // Simuler une réponse après un délai
        setTimeout(() => {
            const response = "🚧 **Fonctionnalité à venir** : Cette IA est en cours d'entraînement. Bientôt, elle connaîtra chaque détail technique de ce bien par cœur !";
            this.renderChatMessage(response, 'ai');
        }, 1500);
    }

    /**
     * Rend un message dans le chat
     * @param text - Texte du message
     * @param sender - 'user' ou 'ai'
     */
    private renderChatMessage(text: string, sender: 'user' | 'ai'): void {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-summary-chat-message ${sender}`;
        
        // Convertir le markdown simple (**texte** en gras) en HTML
        const htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        messageDiv.innerHTML = htmlText;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Fait défiler le chat vers le bas
     */
    private scrollToBottom(): void {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

