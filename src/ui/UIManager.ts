/**
 * UIManager - Gestion de l'interface utilisateur et manipulation du DOM
 */

import type { Message } from '../types';
import type { QAItem } from '../core/QAService';
import { propertySummaries, generateAIResponse } from '../config/propertyData';

export class UIManager {
    private messagesArea: HTMLElement;
    private messageInput: HTMLInputElement;
    private sendButton: HTMLButtonElement;
    private aiAlert: HTMLElement;
    private alertButton: HTMLButtonElement;
    private heartButton: HTMLButtonElement;
    private interestedButton: HTMLButtonElement;
    private viewPropertyButton: HTMLButtonElement;
    private interestModal: HTMLElement;
    private modalOverlay: HTMLElement;
    private offerInput: HTMLInputElement;
    private cancelOfferButton: HTMLButtonElement;
    private submitOfferButton: HTMLButtonElement;
    private successToast: HTMLElement;
    private qaModal: HTMLElement;
    private qaModalOverlay: HTMLElement;
    private qaModalClose: HTMLButtonElement;
    private qaList: HTMLElement;
    private qaInput: HTMLInputElement;
    private qaSendButton: HTMLButtonElement;
    private qaButton: HTMLButtonElement;
    private aiSummaryModal: HTMLElement;
    private aiSummaryModalOverlay: HTMLElement;
    private aiSummaryModalClose: HTMLButtonElement;
    private aiSummaryText: HTMLElement;
    private aiSummaryChatMessages: HTMLElement;
    private aiSummaryChatInput: HTMLInputElement;
    private aiSummaryChatSend: HTMLButtonElement;
    private currentPropertyId: string | null = null;
    private alertAutoHideTimeout: number | null = null;
    private readonly alertAutoHideDelay: number = 8000; // 8 secondes

    constructor() {
        // Sélecteurs typés pour TypeScript strict
        const messagesAreaEl = document.getElementById('messagesArea');
        const messageInputEl = document.getElementById('messageInput') as HTMLInputElement;
        const sendButtonEl = document.querySelector('.send-button') as HTMLButtonElement;
        const aiAlertEl = document.getElementById('aiAlert');
        const alertButtonEl = document.querySelector('.ai-alert-button') as HTMLButtonElement;
        const heartButtonEl = document.getElementById('heartButton') as HTMLButtonElement;
        const interestedButtonEl = document.getElementById('interestedButton') as HTMLButtonElement;
        const viewPropertyButtonEl = document.getElementById('viewPropertyButton') as HTMLButtonElement;
        const interestModalEl = document.getElementById('interest-modal');
        const modalOverlayEl = document.getElementById('modalOverlay');
        const offerInputEl = document.getElementById('offerInput') as HTMLInputElement;
        const cancelOfferButtonEl = document.getElementById('cancelOfferButton') as HTMLButtonElement;
        const submitOfferButtonEl = document.getElementById('submitOfferButton') as HTMLButtonElement;
        const successToastEl = document.getElementById('success-toast');
        const qaModalEl = document.getElementById('qa-modal');
        const qaModalOverlayEl = document.getElementById('qaModalOverlay');
        const qaModalCloseEl = document.getElementById('qaModalClose') as HTMLButtonElement;
        const qaListEl = document.getElementById('qaList');
        const qaInputEl = document.getElementById('qaInput') as HTMLInputElement;
        const qaSendButtonEl = document.getElementById('qaSendButton') as HTMLButtonElement;
        const qaButtonEl = document.getElementById('qaButton') as HTMLButtonElement;
        const aiSummaryModalEl = document.getElementById('ai-summary-modal');
        const aiSummaryModalOverlayEl = document.getElementById('aiSummaryModalOverlay');
        const aiSummaryModalCloseEl = document.getElementById('aiSummaryModalClose') as HTMLButtonElement;
        const aiSummaryTextEl = document.getElementById('ai-summary-text');
        const aiSummaryChatMessagesEl = document.getElementById('aiSummaryChatMessages');
        const aiSummaryChatInputEl = document.getElementById('aiSummaryChatInput') as HTMLInputElement;
        const aiSummaryChatSendEl = document.getElementById('aiSummaryChatSend') as HTMLButtonElement;

        if (!messagesAreaEl || !messageInputEl || !sendButtonEl || !aiAlertEl || !alertButtonEl || 
            !heartButtonEl || !interestedButtonEl || !viewPropertyButtonEl || !interestModalEl || 
            !modalOverlayEl || !offerInputEl || !cancelOfferButtonEl || !submitOfferButtonEl || !successToastEl ||
            !qaModalEl || !qaModalOverlayEl || !qaModalCloseEl || !qaListEl || !qaInputEl || !qaSendButtonEl || !qaButtonEl ||
            !aiSummaryModalEl || !aiSummaryModalOverlayEl || !aiSummaryModalCloseEl || !aiSummaryTextEl || 
            !aiSummaryChatMessagesEl || !aiSummaryChatInputEl || !aiSummaryChatSendEl) {
            throw new Error('Required DOM elements not found');
        }

        this.messagesArea = messagesAreaEl;
        this.messageInput = messageInputEl;
        this.sendButton = sendButtonEl;
        this.aiAlert = aiAlertEl;
        this.alertButton = alertButtonEl;
        this.heartButton = heartButtonEl;
        this.interestedButton = interestedButtonEl;
        this.viewPropertyButton = viewPropertyButtonEl;
        this.interestModal = interestModalEl;
        this.modalOverlay = modalOverlayEl;
        this.offerInput = offerInputEl;
        this.cancelOfferButton = cancelOfferButtonEl;
        this.submitOfferButton = submitOfferButtonEl;
        this.successToast = successToastEl;
        this.qaModal = qaModalEl;
        this.qaModalOverlay = qaModalOverlayEl;
        this.qaModalClose = qaModalCloseEl;
        this.qaList = qaListEl;
        this.qaInput = qaInputEl;
        this.qaSendButton = qaSendButtonEl;
        this.qaButton = qaButtonEl;
        this.aiSummaryModal = aiSummaryModalEl;
        this.aiSummaryModalOverlay = aiSummaryModalOverlayEl;
        this.aiSummaryModalClose = aiSummaryModalCloseEl;
        this.aiSummaryText = aiSummaryTextEl;
        this.aiSummaryChatMessages = aiSummaryChatMessagesEl;
        this.aiSummaryChatInput = aiSummaryChatInputEl;
        this.aiSummaryChatSend = aiSummaryChatSendEl;
    }

    /**
     * Rend un message dans l'interface
     * @param message - Message à afficher
     */
    renderMessage(message: Message): void {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        
        // Ajouter une classe si c'est un Hot Lead
        if (message.isHotLead) {
            messageDiv.classList.add('hot-lead');
        }

        const textDiv = document.createElement('div');
        textDiv.textContent = message.text;
        messageDiv.appendChild(textDiv);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(message.timestamp);
        messageDiv.appendChild(timeDiv);

        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Rend plusieurs messages
     * @param messages - Liste des messages à afficher
     */
    renderMessages(messages: Message[]): void {
        // Nettoyer la zone de messages (sauf le message initial)
        const initialMessage = this.messagesArea.querySelector('.message.ai');
        this.messagesArea.innerHTML = '';
        if (initialMessage) {
            this.messagesArea.appendChild(initialMessage);
        }

        // Rendre tous les messages
        messages.forEach(message => this.renderMessage(message));
    }

    /**
     * Récupère le texte saisi dans l'input
     * @returns Texte saisi
     */
    getInputText(): string {
        return this.messageInput.value.trim();
    }

    /**
     * Vide le champ de saisie
     */
    clearInput(): void {
        this.messageInput.value = '';
    }

    /**
     * Fait défiler la zone de messages vers le bas
     */
    scrollToBottom(): void {
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }

    /**
     * Affiche l'alerte Hot Lead
     */
    showHotLeadAlert(): void {
        this.aiAlert.classList.add('show');
        
        // Masquer automatiquement après le délai
        if (this.alertAutoHideTimeout) {
            clearTimeout(this.alertAutoHideTimeout);
        }
        
        this.alertAutoHideTimeout = window.setTimeout(() => {
            this.hideHotLeadAlert();
        }, this.alertAutoHideDelay);
    }

    /**
     * Masque l'alerte Hot Lead
     */
    hideHotLeadAlert(): void {
        this.aiAlert.classList.remove('show');
        if (this.alertAutoHideTimeout) {
            clearTimeout(this.alertAutoHideTimeout);
            this.alertAutoHideTimeout = null;
        }
    }

    /**
     * Configure les écouteurs d'événements pour l'UI
     * @param onSendMessage - Callback appelé lors de l'envoi d'un message
     * @param onHotLeadAction - Callback appelé lors du clic sur le bouton Hot Lead
     * @param onInterested - Callback appelé lors du clic sur "Je suis intéressé"
     * @param onViewProperty - Callback appelé lors du clic sur "Voir le bien"
     * @param onOfferSubmitted - Callback appelé lors de l'envoi d'une offre
     * @param onQASubmit - Callback appelé lors de l'envoi d'une question Q&A
     */
    setupEventListeners(
        onSendMessage: () => void,
        onHotLeadAction: () => void,
        onInterested: () => void,
        onViewProperty?: () => void,
        onOfferSubmitted?: () => void,
        onQASubmit?: (question: string) => void
    ): void {
        // Envoi avec le bouton
        this.sendButton.addEventListener('click', onSendMessage);

        // Envoi avec la touche Entrée
        this.messageInput.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                onSendMessage();
            }
        });

        // Action sur l'alerte Hot Lead
        this.alertButton.addEventListener('click', onHotLeadAction);

        // Action sur le bouton cœur
        this.heartButton.addEventListener('click', () => {
            this.animateHeart();
        });

        // Action sur le bouton "Je suis intéressé"
        this.interestedButton.addEventListener('click', onInterested);

        // Action sur le bouton "Voir le bien"
        if (onViewProperty) {
            this.viewPropertyButton.addEventListener('click', onViewProperty);
        }

        // Action sur le bouton Q&A
        this.qaButton.addEventListener('click', () => {
            this.showQAModal();
        });

        // Gestion de la modale d'offre
        this.setupModalListeners(onOfferSubmitted);

        // Gestion de la modale Q&A
        this.setupQAModalListeners(onQASubmit);

        // Focus sur l'input au chargement
        this.messageInput.focus();
    }

    /**
     * Configure les écouteurs d'événements pour la modale
     * @param onOfferSubmitted - Callback appelé après l'envoi de l'offre
     */
    private setupModalListeners(onOfferSubmitted?: () => void): void {
        // Fermer la modale avec le bouton Annuler
        this.cancelOfferButton.addEventListener('click', () => {
            this.hideInterestModal();
        });

        // Fermer la modale en cliquant sur l'overlay
        this.modalOverlay.addEventListener('click', () => {
            this.hideInterestModal();
        });

        // Envoyer l'offre
        this.submitOfferButton.addEventListener('click', () => {
            this.handleSubmitOffer(onOfferSubmitted);
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !this.interestModal.classList.contains('hidden')) {
                this.hideInterestModal();
            }
        });
    }

    /**
     * Affiche la modale d'offre
     */
    showInterestModal(): void {
        this.interestModal.classList.remove('hidden');
        this.offerInput.focus();
    }

    /**
     * Masque la modale d'offre
     */
    hideInterestModal(): void {
        this.interestModal.classList.add('hidden');
        this.offerInput.value = '';
    }

    /**
     * Gère l'envoi de l'offre
     * @param onOfferSubmitted - Callback appelé après l'envoi de l'offre
     */
    private handleSubmitOffer(onOfferSubmitted?: () => void): void {
        const offerValue = this.offerInput.value.trim();
        
        if (!offerValue || isNaN(Number(offerValue)) || Number(offerValue) <= 0) {
            // Optionnel: Afficher une erreur
            return;
        }

        // Masquer la modale
        this.hideInterestModal();

        // Afficher la notification
        this.showSuccessToast();

        // Appeler le callback pour ajouter un message système dans le chat
        if (onOfferSubmitted) {
            onOfferSubmitted();
        }
    }

    /**
     * Affiche la notification de succès
     */
    showSuccessToast(): void {
        this.successToast.classList.remove('hidden');
        
        // Masquer après 4 secondes
        setTimeout(() => {
            this.hideSuccessToast();
        }, 4000);
    }

    /**
     * Masque la notification de succès
     */
    hideSuccessToast(): void {
        this.successToast.classList.add('hidden');
    }

    /**
     * Anime le cœur qui monte depuis le bouton
     */
    animateHeart(): void {
        const rect = this.heartButton.getBoundingClientRect();
        const heartX = rect.left + rect.width / 2;
        const heartY = rect.top + rect.height / 2;

        const heartElement = document.createElement('div');
        heartElement.className = 'heart-float';
        heartElement.textContent = '❤️';
        heartElement.style.left = `${heartX}px`;
        heartElement.style.top = `${heartY}px`;

        document.body.appendChild(heartElement);

        // Supprimer l'élément après l'animation
        setTimeout(() => {
            if (heartElement.parentNode) {
                heartElement.parentNode.removeChild(heartElement);
            }
        }, 2000);
    }

    /**
     * Formate une date en format HH:MM
     * @param date - Date à formater
     * @returns Heure formatée
     */
    private formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    /**
     * Active ou désactive le champ de saisie
     * @param enabled - État du champ
     */
    setInputEnabled(enabled: boolean): void {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
    }

    /**
     * Définit le placeholder du champ de saisie
     * @param placeholder - Texte du placeholder
     */
    setInputPlaceholder(placeholder: string): void {
        this.messageInput.placeholder = placeholder;
    }

    /**
     * Configure les écouteurs d'événements pour la modale Q&A
     * @param onQASubmit - Callback appelé lors de l'envoi d'une question
     */
    private setupQAModalListeners(onQASubmit?: (question: string) => void): void {
        // Fermer la modale avec le bouton de fermeture
        this.qaModalClose.addEventListener('click', () => {
            this.hideQAModal();
        });

        // Fermer la modale en cliquant sur l'overlay
        this.qaModalOverlay.addEventListener('click', () => {
            this.hideQAModal();
        });

        // Envoyer une question
        this.qaSendButton.addEventListener('click', () => {
            this.handleQASubmit(onQASubmit);
        });

        // Envoyer avec la touche Entrée
        this.qaInput.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                this.handleQASubmit(onQASubmit);
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !this.qaModal.classList.contains('hidden')) {
                this.hideQAModal();
            }
        });
    }

    /**
     * Affiche la modale Q&A
     */
    showQAModal(): void {
        this.qaModal.classList.remove('hidden');
        this.qaInput.focus();
    }

    /**
     * Masque la modale Q&A
     */
    hideQAModal(): void {
        this.qaModal.classList.add('hidden');
        this.qaInput.value = '';
    }

    /**
     * Gère l'envoi d'une question Q&A
     * @param onQASubmit - Callback appelé avec la question
     */
    private handleQASubmit(onQASubmit?: (question: string) => void): void {
        const question = this.qaInput.value.trim();
        
        if (!question) {
            return;
        }

        // Vider l'input
        this.qaInput.value = '';

        // Appeler le callback
        if (onQASubmit) {
            onQASubmit(question);
        }
    }

    /**
     * Rend une Q&A dans la liste
     * @param qaItem - Item Q&A à afficher
     */
    renderQAItem(qaItem: QAItem): void {
        const qaItemDiv = document.createElement('div');
        qaItemDiv.className = 'qa-item';
        qaItemDiv.setAttribute('data-qa-id', qaItem.id);

        // Question
        const questionDiv = document.createElement('div');
        questionDiv.className = 'qa-question';
        
        const questionIcon = document.createElement('span');
        questionIcon.className = 'qa-question-icon';
        questionIcon.textContent = '👤';
        
        const questionText = document.createElement('div');
        questionText.className = 'qa-question-text';
        questionText.textContent = qaItem.question;
        
        questionDiv.appendChild(questionIcon);
        questionDiv.appendChild(questionText);
        qaItemDiv.appendChild(questionDiv);

        // Message de confirmation système (si présent)
        if (qaItem.acknowledgment) {
            const acknowledgmentDiv = document.createElement('div');
            acknowledgmentDiv.className = 'qa-acknowledgment';
            
            const acknowledgmentIcon = document.createElement('span');
            acknowledgmentIcon.className = 'qa-acknowledgment-icon';
            acknowledgmentIcon.textContent = '🤖';
            
            const acknowledgmentText = document.createElement('div');
            acknowledgmentText.className = 'qa-acknowledgment-text';
            acknowledgmentText.textContent = qaItem.acknowledgment;
            
            acknowledgmentDiv.appendChild(acknowledgmentIcon);
            acknowledgmentDiv.appendChild(acknowledgmentText);
            qaItemDiv.appendChild(acknowledgmentDiv);
        }

        // Réponse ou en attente
        if (qaItem.answer) {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'qa-answer';
            
            const answerHeader = document.createElement('div');
            answerHeader.className = 'qa-answer-header';
            
            const answerBadge = document.createElement('span');
            answerBadge.className = 'qa-answer-badge';
            answerBadge.textContent = '🏷️ Vendeur';
            
            answerHeader.appendChild(answerBadge);
            answerDiv.appendChild(answerHeader);
            
            const answerText = document.createElement('div');
            answerText.className = 'qa-answer-text';
            answerText.textContent = qaItem.answer;
            answerDiv.appendChild(answerText);
            
            qaItemDiv.appendChild(answerDiv);
        } else if (!qaItem.acknowledgment) {
            // Afficher "En attente" seulement si pas de confirmation système
            const pendingDiv = document.createElement('div');
            pendingDiv.className = 'qa-pending';
            pendingDiv.textContent = 'En attente de réponse...';
            qaItemDiv.appendChild(pendingDiv);
        }

        this.qaList.appendChild(qaItemDiv);
        this.scrollQAListToBottom();
    }

    /**
     * Rend toutes les Q&A
     * @param qaItems - Liste des Q&A à afficher
     */
    renderQAItems(qaItems: QAItem[]): void {
        // Nettoyer la liste
        this.qaList.innerHTML = '';

        // Rendre toutes les Q&A
        qaItems.forEach(qaItem => {
            this.renderQAItem(qaItem);
        });
    }

    /**
     * Met à jour une Q&A existante (ajoute la réponse)
     * @param qaItem - Q&A mise à jour
     */
    updateQAItem(qaItem: QAItem): void {
        const existingItem = this.qaList.querySelector(`[data-qa-id="${qaItem.id}"]`);
        
        if (existingItem) {
            // Remplacer l'élément existant
            existingItem.remove();
        }

        // Rendre la Q&A mise à jour
        this.renderQAItem(qaItem);
    }

    /**
     * Fait défiler la liste Q&A vers le bas
     */
    private scrollQAListToBottom(): void {
        this.qaList.scrollTop = this.qaList.scrollHeight;
    }

    /**
     * Configure les écouteurs d'événements pour la modale AI Summary
     */
    setupAISummaryListeners(): void {
        // Fermer la modale avec le bouton de fermeture
        this.aiSummaryModalClose.addEventListener('click', () => {
            this.hideAISummaryModal();
        });

        // Fermer la modale en cliquant sur l'overlay
        this.aiSummaryModalOverlay.addEventListener('click', () => {
            this.hideAISummaryModal();
        });

        // Envoyer un message dans le chat IA
        this.aiSummaryChatSend.addEventListener('click', () => {
            this.handleAISummaryChatSubmit();
        });

        // Envoyer avec la touche Entrée
        this.aiSummaryChatInput.addEventListener('keypress', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                this.handleAISummaryChatSubmit();
            }
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !this.aiSummaryModal.classList.contains('hidden')) {
                this.hideAISummaryModal();
            }
        });
    }

    /**
     * Affiche la modale AI Summary avec le résumé du bien
     * @param propertyId - ID du bien (paris, lyon, nice)
     */
    showAISummaryModal(propertyId: string): void {
        const propertyData = propertySummaries[propertyId];
        
        if (!propertyData) {
            console.error(`Property data not found for ID: ${propertyId}`);
            return;
        }

        this.currentPropertyId = propertyId;
        this.aiSummaryText.textContent = propertyData.summary;
        this.aiSummaryChatMessages.innerHTML = ''; // Réinitialiser le chat
        this.aiSummaryChatInput.value = '';
        this.aiSummaryModal.classList.remove('hidden');
        this.aiSummaryChatInput.focus();
    }

    /**
     * Masque la modale AI Summary
     */
    hideAISummaryModal(): void {
        this.aiSummaryModal.classList.add('hidden');
        this.aiSummaryChatInput.value = '';
        this.currentPropertyId = null;
    }

    /**
     * Gère l'envoi d'un message dans le chat IA
     */
    private handleAISummaryChatSubmit(): void {
        if (!this.currentPropertyId) {
            return;
        }

        const question = this.aiSummaryChatInput.value.trim();
        
        if (!question) {
            return;
        }

        // Afficher la question de l'utilisateur
        this.renderAISummaryChatMessage(question, 'user');

        // Vider l'input
        this.aiSummaryChatInput.value = '';

        // Simuler une réponse après un délai
        setTimeout(() => {
            const response = generateAIResponse(this.currentPropertyId!, question);
            this.renderAISummaryChatMessage(response, 'ai');
        }, 1500);
    }

    /**
     * Rend un message dans le chat IA
     * @param text - Texte du message
     * @param sender - 'user' ou 'ai'
     */
    private renderAISummaryChatMessage(text: string, sender: 'user' | 'ai'): void {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-summary-chat-message ${sender}`;
        messageDiv.textContent = text;
        
        this.aiSummaryChatMessages.appendChild(messageDiv);
        this.scrollAISummaryChatToBottom();
    }

    /**
     * Fait défiler le chat IA vers le bas
     */
    private scrollAISummaryChatToBottom(): void {
        this.aiSummaryChatMessages.scrollTop = this.aiSummaryChatMessages.scrollHeight;
    }
}

