/**
 * Main entry point for Weliive AI Co-Pilot application
 */

import { ChatService } from './core/ChatService';
import { QAService } from './core/QAService';
import { UIManager } from './ui/UIManager';
import { NavigationManager } from './ui/NavigationManager';
import { AISummaryModal } from './ui/AISummaryModal';
import { LauncherManager } from './ui/LauncherManager';
import { LoginModal } from './ui/LoginModal';
import { NotificationManager } from './ui/NotificationManager';
import { ThemeManager } from './ui/ThemeManager';
import type { Message } from './types';

class App {
    private chatService: ChatService;
    private qaService: QAService;
    private uiManager: UIManager | null = null;
    private navigationManager: NavigationManager;
    private aiSummaryModal: AISummaryModal;
    private launcherManager: LauncherManager | null = null;
    private loginModal: LoginModal | null = null;
    private notificationManager: NotificationManager;
    private themeManager: ThemeManager | null = null;
    private chatInitialized: boolean = false;

    constructor() {
        // Initialiser le gestionnaire de navigation
        this.navigationManager = new NavigationManager();

        // Initialiser les services (mais ne pas démarrer la simulation tout de suite)
        this.chatService = new ChatService({
            simulationEnabled: false, // Désactivé par défaut, activé quand on entre dans le live
            simulationDelay: 3000,
            simulationInterval: 2000,
            autoResponseDelay: 1000,
        });

        // Initialiser le service Q&A
        this.qaService = new QAService();

        // Initialiser le gestionnaire de notifications
        this.notificationManager = new NotificationManager();

        // Initialiser la modale AI Summary (accessible depuis la page d'accueil)
        this.aiSummaryModal = new AISummaryModal();

        // Initialiser la modale de connexion
        this.loginModal = new LoginModal(this.notificationManager);

        // Initialiser le gestionnaire de launcher
        this.launcherManager = new LauncherManager(this.aiSummaryModal);

        // Initialiser le gestionnaire de thème
        try {
            this.themeManager = new ThemeManager();
            this.themeManager.loadSavedTheme();
        } catch (error) {
            console.warn('ThemeManager initialization failed:', error);
            // Continuer sans le gestionnaire de thème si l'initialisation échoue
        }

        // Configurer la navigation
        this.setupNavigation();
        this.setupHeaderActions();
    }

    /**
     * Configure la navigation entre les vues
     */
    private setupNavigation(): void {
        // Écouter les clics sur les boutons "Entrer dans le bien" (délégué pour gérer les éléments dynamiques)
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const button = target.closest('.property-button:not(.ai-summary-btn)') as HTMLElement;
            if (button) {
                const propertyId = button.getAttribute('data-property-id');
                if (propertyId) {
                    event.preventDefault();
                    this.navigateToLive(propertyId);
                }
            }
        });

        // Les boutons "Résumé IA" sont gérés par LauncherManager
        // Mais on doit aussi gérer ceux qui existent déjà dans le HTML initial
        document.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('ai-summary-btn') || target.closest('.ai-summary-btn')) {
                const button = target.classList.contains('ai-summary-btn') ? target : target.closest('.ai-summary-btn') as HTMLElement;
                const propertyId = button.getAttribute('data-id');
                if (propertyId) {
                    event.preventDefault();
                    this.aiSummaryModal.show(propertyId);
                }
            }
        });

        // Écouter le clic sur le bouton retour (Live View)
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.navigateToLauncher();
            });
        }

        // Écouter le clic sur le bouton retour (Details View)
        const backToLiveButton = document.getElementById('backToLiveButton');
        if (backToLiveButton) {
            backToLiveButton.addEventListener('click', () => {
                this.handleBackToLive();
            });
        }
    }

    /**
     * Navigue vers la vue Live et initialise le chat si nécessaire
     */
    private navigateToLive(propertyId: string): void {
        this.navigationManager.navigateTo('live');
        
        // Initialiser le chat seulement la première fois
        if (!this.chatInitialized) {
            this.initializeChat();
            this.chatInitialized = true;
        } else {
            // Redémarrer la simulation si elle était arrêtée
            this.chatService.startSimulation();
        }
    }

    /**
     * Navigue vers la vue Launcher
     */
    private navigateToLauncher(): void {
        this.navigationManager.navigateTo('launcher');
        // Arrêter la simulation quand on quitte la vue live
        this.chatService.stopSimulation();
    }

    /**
     * Initialise le chat (message initial + simulation)
     */
    private initializeChat(): void {
        // Initialiser le UIManager seulement quand on entre dans la vue live
        if (!this.uiManager) {
            this.uiManager = new UIManager();
        }

        // Message initial
        if (this.chatService.getMessages().length === 0) {
            const initialMessage = this.chatService.addMessage(
                "Bonjour ! Je suis intéressé par votre appartement.",
                'ai'
            );
        }

        // Configurer les écouteurs d'événements du chat
        this.setupEventListeners();

        // Démarrer la simulation
        this.chatService.setSimulationEnabled(true);
        this.chatService.startSimulation();
    }

    /**
     * Configure tous les écouteurs d'événements
     */
    private setupEventListeners(): void {
        if (!this.uiManager) {
            return;
        }

        // Envoi de message
        this.uiManager.setupEventListeners(
            () => this.handleSendMessage(),
            () => this.handleHotLeadAction(),
            () => this.handleInterested(),
            () => this.handleViewProperty(),
            () => this.handleOfferSubmitted(),
            (question: string) => this.handleQASubmit(question)
        );

        // Charger les Q&A initiales
        this.loadInitialQA();

        // Écouter les nouveaux messages du service
        this.setupMessageListener();
    }

    /**
     * Charge les Q&A initiales dans l'interface
     */
    private loadInitialQA(): void {
        if (!this.uiManager) {
            return;
        }

        const qaItems = this.qaService.getAllQA();
        this.uiManager.renderQAItems(qaItems);
    }

    /**
     * Configure l'écoute des nouveaux messages
     */
    private setupMessageListener(): void {
        let initialMessageCount = 0;
        const initialMessageInHTML = 1; // Le message initial présent dans le HTML
        
        // Utiliser le système de callbacks du ChatService
        this.chatService.onMessage((message: Message) => {
            if (!this.uiManager) {
                return;
            }

            // Toujours rendre les messages système
            if (message.sender === 'system') {
                this.uiManager.renderMessage(message);
                return;
            }

            // Ignorer les messages initiaux qui sont déjà dans le HTML
            // On compte les messages pour ignorer seulement le premier
            if (initialMessageCount < initialMessageInHTML) {
                initialMessageCount++;
                return;
            }
            
            // Rendre tous les nouveaux messages
            this.uiManager.renderMessage(message);
            
            // Afficher l'alerte si c'est un Hot Lead
            if (message.isHotLead && message.sender === 'user') {
                this.uiManager.showHotLeadAlert();
            }
        });
    }

    /**
     * Gère l'envoi d'un message
     */
    private handleSendMessage(): void {
        if (!this.uiManager) {
            return;
        }

        const text = this.uiManager.getInputText();
        
        if (!text) {
            return;
        }

        // Arrêter la simulation quand l'utilisateur tape
        this.chatService.stopSimulation();

        // Vider l'input immédiatement
        this.uiManager.clearInput();

        // Ajouter le message (le callback onMessage gérera le rendu)
        const message = this.chatService.addMessage(text, 'user');

        // Afficher l'alerte si c'est un Hot Lead (le message est déjà rendu par le callback)
        if (message.isHotLead && this.uiManager) {
            this.uiManager.showHotLeadAlert();
        }

        // Générer une réponse automatique après un délai
        // Le callback onMessage gérera aussi le rendu de la réponse
        setTimeout(() => {
            this.chatService.generateAutoResponse();
        }, this.chatService.getAutoResponseDelay());
    }

    /**
     * Gère l'action sur le bouton Hot Lead
     */
    private handleHotLeadAction(): void {
        if (!this.uiManager) {
            return;
        }

        this.uiManager.hideHotLeadAlert();
        
        // Le callback onMessage gérera le rendu
        this.chatService.addMessage(
            "✅ Alerte Hot Lead traitée - Contact prioritaire activé",
            'ai'
        );
    }

    /**
     * Gère l'action sur le bouton "Je suis intéressé"
     * Affiche la modale d'offre
     */
    private handleInterested(): void {
        if (!this.uiManager) {
            return;
        }

        // Afficher la modale d'offre
        this.uiManager.showInterestModal();
    }

    /**
     * Gère l'action sur le bouton "Voir le bien"
     */
    private handleViewProperty(): void {
        // Naviguer vers la vue détails
        this.navigationManager.navigateTo('details');
    }

    /**
     * Gère le retour depuis la vue détails vers le live
     */
    private handleBackToLive(): void {
        this.navigationManager.navigateTo('live');
    }

    /**
     * Gère l'envoi d'une offre (appelé depuis UIManager)
     */
    private handleOfferSubmitted(): void {
        // Ajouter un message système dans le chat
        if (this.uiManager) {
            this.chatService.addMessage(
                "Une offre a été envoyée !",
                'system'
            );
        }
    }

    /**
     * Configure les actions du header
     */
    private setupHeaderActions(): void {
        // Bouton de recherche
        const searchButton = document.querySelector('.icon-btn[aria-label="Recherche"]');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.notificationManager.showComingSoon('Recherche');
            });
        }

        // Lien de connexion
        const loginLink = document.querySelector('.login-link');
        if (loginLink && this.loginModal) {
            loginLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.loginModal.show();
            });
        }

        // Bouton "Créer une alerte"
        const createAlertButton = document.querySelector('.cta-btn-header');
        if (createAlertButton) {
            createAlertButton.addEventListener('click', () => {
                this.notificationManager.showComingSoon('Création d\'alerte');
            });
        }
    }

    /**
     * Gère l'envoi d'une question Q&A
     * @param question - Texte de la question
     */
    private handleQASubmit(question: string): void {
        if (!this.uiManager) {
            return;
        }

        // Ajouter la question (sans réponse)
        const qaItem = this.qaService.addQuestion(question);
        this.uiManager.renderQAItem(qaItem);

        // Ajouter le message de confirmation système après 300ms
        setTimeout(() => {
            const acknowledgment = "Merci ! Votre question a été transmise. Le vendeur vous répondra dans les plus brefs délais.";
            this.qaService.addAcknowledgment(qaItem.id, acknowledgment);
            const updatedQA = this.qaService.getQAById(qaItem.id);
            
            if (updatedQA && this.uiManager) {
                this.uiManager.updateQAItem(updatedQA);
            }
        }, 300);

        // Simuler une réponse du vendeur après 3 secondes (après la confirmation)
        setTimeout(() => {
            const answer = this.qaService.generateAutoAnswer(qaItem.id);
            const updatedQA = this.qaService.getQAById(qaItem.id);
            
            if (updatedQA && this.uiManager) {
                this.uiManager.updateQAItem(updatedQA);
            }
        }, 3000);
    }
}

// Initialiser l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Exporter pour utilisation externe si nécessaire
export { App };

