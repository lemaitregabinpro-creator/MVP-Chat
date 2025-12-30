/**
 * NotificationManager - Gestion des notifications "Coming Soon"
 */

export class NotificationManager {
    private toast: HTMLElement;
    private toastText: HTMLElement;
    private hideTimeout: number | null = null;

    constructor() {
        const toastEl = document.getElementById('coming-soon-toast');
        const toastTextEl = document.getElementById('comingSoonText');

        if (!toastEl || !toastTextEl) {
            throw new Error('Coming Soon Toast elements not found');
        }

        this.toast = toastEl;
        this.toastText = toastTextEl;
    }

    /**
     * Affiche une notification "Coming Soon"
     * @param message - Message à afficher
     */
    showComingSoon(message: string): void {
        // Annuler le timeout précédent si existe
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Mettre à jour le texte
        this.toastText.textContent = `🚧 Fonctionnalité ${message} à venir`;

        // Afficher le toast
        this.toast.classList.remove('hidden');

        // Masquer après 3 secondes
        this.hideTimeout = window.setTimeout(() => {
            this.hide();
        }, 3000);
    }

    /**
     * Masque la notification
     */
    hide(): void {
        this.toast.classList.add('hidden');
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
}

