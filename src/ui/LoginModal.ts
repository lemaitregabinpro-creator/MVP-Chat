/**
 * LoginModal - Gestion de la modale de connexion
 */

import { NotificationManager } from './NotificationManager';

export class LoginModal {
    private modal: HTMLElement;
    private overlay: HTMLElement;
    private closeButton: HTMLButtonElement;
    private loginButtons: NodeListOf<HTMLButtonElement>;
    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        const modalEl = document.getElementById('login-modal');
        const overlayEl = document.getElementById('loginModalOverlay');
        const closeEl = document.getElementById('loginModalClose') as HTMLButtonElement;
        const loginButtonsEl = document.querySelectorAll('.login-btn');

        if (!modalEl || !overlayEl || !closeEl || loginButtonsEl.length === 0) {
            throw new Error('Required Login Modal elements not found');
        }

        this.modal = modalEl;
        this.overlay = overlayEl;
        this.closeButton = closeEl;
        this.loginButtons = loginButtonsEl as NodeListOf<HTMLButtonElement>;
        this.notificationManager = notificationManager;

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

        // Gérer les clics sur les boutons de connexion
        this.loginButtons.forEach(button => {
            button.addEventListener('click', () => {
                const provider = button.getAttribute('data-provider');
                if (provider) {
                    this.handleLogin(provider);
                }
            });
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    /**
     * Affiche la modale
     */
    show(): void {
        this.modal.classList.remove('hidden');
    }

    /**
     * Masque la modale
     */
    hide(): void {
        this.modal.classList.add('hidden');
    }

    /**
     * Gère la tentative de connexion
     * @param provider - Fournisseur de connexion
     */
    private handleLogin(provider: string): void {
        const providerNames: Record<string, string> = {
            google: 'Google',
            apple: 'Apple',
            email: 'Email'
        };

        const providerName = providerNames[provider] || provider;
        this.notificationManager.showComingSoon(`Connexion ${providerName}`);
    }
}

