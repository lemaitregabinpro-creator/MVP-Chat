/**
 * ThemeManager - Gestion du changement de thème (fond d'écran)
 */

export class ThemeManager {
    private themeModal: HTMLElement;
    private themeModalOverlay: HTMLElement;
    private themeModalClose: HTMLButtonElement;
    private themeButtons: NodeListOf<HTMLButtonElement>;
    private launcherView: HTMLElement;
    private themeToggleButton: HTMLButtonElement;

    constructor() {
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            throw new Error('ThemeManager must be initialized after DOM is loaded');
        }

        const modalEl = document.getElementById('theme-modal');
        const overlayEl = document.getElementById('themeModalOverlay');
        const closeEl = document.getElementById('themeModalClose') as HTMLButtonElement;
        const buttonsEl = document.querySelectorAll('.theme-preview-btn');
        const launcherEl = document.getElementById('launcher-view');
        const toggleEl = document.getElementById('theme-toggle-btn') as HTMLButtonElement;

        if (!modalEl || !overlayEl || !closeEl || buttonsEl.length === 0 || !launcherEl || !toggleEl) {
            const missing = [];
            if (!modalEl) missing.push('theme-modal');
            if (!overlayEl) missing.push('themeModalOverlay');
            if (!closeEl) missing.push('themeModalClose');
            if (buttonsEl.length === 0) missing.push('.theme-preview-btn');
            if (!launcherEl) missing.push('launcher-view');
            if (!toggleEl) missing.push('theme-toggle-btn');
            throw new Error(`Required Theme Modal elements not found: ${missing.join(', ')}`);
        }

        this.themeModal = modalEl;
        this.themeModalOverlay = overlayEl;
        this.themeModalClose = closeEl;
        this.themeButtons = buttonsEl as NodeListOf<HTMLButtonElement>;
        this.launcherView = launcherEl;
        this.themeToggleButton = toggleEl;

        this.setupListeners();
    }

    /**
     * Configure les écouteurs d'événements
     */
    private setupListeners(): void {
        // Ouvrir la modale
        if (!this.themeToggleButton) {
            console.error('Theme toggle button not found');
            return;
        }

        this.themeToggleButton.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            try {
                console.log('Theme toggle button clicked'); // Debug
                this.show();
            } catch (error) {
                console.error('Error showing theme modal:', error);
            }
        });

        // Fermer la modale
        this.themeModalClose.addEventListener('click', () => {
            this.hide();
        });

        this.themeModalOverlay.addEventListener('click', () => {
            this.hide();
        });

        // Gérer la sélection d'un thème
        this.themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const themeName = button.getAttribute('data-theme');
                if (themeName) {
                    this.applyTheme(themeName);
                    this.hide();
                }
            });
        });

        // Fermer avec Escape (utiliser une fonction nommée pour éviter les conflits)
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !this.themeModal.classList.contains('hidden')) {
                event.preventDefault();
                event.stopPropagation();
                this.hide();
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Affiche la modale
     */
    show(): void {
        if (!this.themeModal) {
            console.error('Theme modal element not found');
            return;
        }
        console.log('Showing theme modal'); // Debug
        
        // Retirer la classe hidden
        this.themeModal.classList.remove('hidden');
        
        // Forcer l'affichage via style inline en cas de problème CSS
        this.themeModal.style.display = 'flex';
        this.themeModal.style.zIndex = '9999';
    }

    /**
     * Masque la modale
     */
    hide(): void {
        this.themeModal.classList.add('hidden');
        // Forcer le masquage via style inline
        this.themeModal.style.display = 'none';
    }

    /**
     * Applique un thème (change le fond d'écran)
     * @param themeName - Nom du fichier de thème (ex: "bg-theme-1.webp")
     */
    applyTheme(themeName: string): void {
        const imagePath = `/bg-theme/${themeName}`;
        console.log('Applying theme:', imagePath); // Debug
        this.launcherView.style.backgroundImage = `url("${imagePath}")`;
        this.launcherView.style.backgroundColor = 'transparent';
        
        // Sauvegarder le choix dans localStorage
        localStorage.setItem('selectedTheme', themeName);
    }

    /**
     * Charge le thème sauvegardé au démarrage, ou applique le thème par défaut
     */
    loadSavedTheme(): void {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            console.log('Loading saved theme:', savedTheme); // Debug
            this.applyTheme(savedTheme);
        } else {
            // Appliquer le thème par défaut si aucun thème n'est sauvegardé
            console.log('No saved theme, applying default: bg-theme-1.webp'); // Debug
            this.applyTheme('bg-theme-1.webp');
        }
    }
}

