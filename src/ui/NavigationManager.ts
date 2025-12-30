/**
 * NavigationManager - Gestion de la navigation entre les vues
 */

export type View = 'launcher' | 'live' | 'details';

export class NavigationManager {
    private launcherView: HTMLElement;
    private liveView: HTMLElement;
    private detailsView: HTMLElement;
    private currentView: View = 'launcher';

    constructor() {
        const launcherEl = document.getElementById('launcher-view');
        const liveEl = document.getElementById('live-view');
        const detailsEl = document.getElementById('details-view');

        if (!launcherEl || !liveEl || !detailsEl) {
            throw new Error('Required view elements not found');
        }

        this.launcherView = launcherEl;
        this.liveView = liveEl;
        this.detailsView = detailsEl;
    }

    /**
     * Navigue vers une vue spécifique
     * @param view - Vue à afficher
     */
    navigateTo(view: View): void {
        if (this.currentView === view) {
            return;
        }

        // Masquer toutes les vues
        this.launcherView.classList.add('hidden');
        this.liveView.classList.add('hidden');
        this.detailsView.classList.add('hidden');

        // Afficher la nouvelle vue
        if (view === 'launcher') {
            this.launcherView.classList.remove('hidden');
        } else if (view === 'live') {
            this.liveView.classList.remove('hidden');
        } else if (view === 'details') {
            this.detailsView.classList.remove('hidden');
        }

        this.currentView = view;
    }

    /**
     * Récupère la vue actuelle
     * @returns Vue actuelle
     */
    getCurrentView(): View {
        return this.currentView;
    }

    /**
     * Vérifie si on est sur la vue Live
     * @returns true si on est sur la vue Live
     */
    isLiveView(): boolean {
        return this.currentView === 'live';
    }

    /**
     * Vérifie si on est sur la vue Launcher
     * @returns true si on est sur la vue Launcher
     */
    isLauncherView(): boolean {
        return this.currentView === 'launcher';
    }

    /**
     * Vérifie si on est sur la vue Details
     * @returns true si on est sur la vue Details
     */
    isDetailsView(): boolean {
        return this.currentView === 'details';
    }
}

