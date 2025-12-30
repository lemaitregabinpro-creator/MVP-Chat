/**
 * LauncherManager - Gestion de la navigation et de l'affichage des cartes sur la page d'accueil
 */

import { AISummaryModal } from './AISummaryModal';

type GridMode = 'live' | 'explore' | 'alerts';

interface PropertyCard {
    id: string;
    title: string;
    image: string;
    price?: string;
    aiSummaryId?: string;
    propertyId?: string;
    badge?: 'live' | 'alert';
}

export class LauncherManager {
    private propertiesGrid: HTMLElement;
    private navLinks: NodeListOf<HTMLElement>;
    private currentMode: GridMode = 'live';
    private aiSummaryModal: AISummaryModal;

    // Données fictives pour les différents modes
    private liveProperties: PropertyCard[] = [
        { id: '1', title: 'Loft Moderne à Paris', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', propertyId: '1', aiSummaryId: 'paris', badge: 'live' },
        { id: '2', title: 'Appartement Design Lyon', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', propertyId: '2', aiSummaryId: 'lyon', badge: 'live' },
        { id: '3', title: 'Villa Contemporaine Nice', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', propertyId: '3', aiSummaryId: 'nice', badge: 'live' }
    ];

    private exploreProperties: PropertyCard[] = [
        { id: '4', title: 'Studio Cosy Montmartre', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', price: '450.000 €', aiSummaryId: 'paris' },
        { id: '5', title: 'Penthouse Vue Mer Cannes', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80', price: '2.800.000 €', aiSummaryId: 'nice' },
        { id: '6', title: 'Maison de Ville Bordeaux', image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&q=80', price: '680.000 €', aiSummaryId: 'lyon' },
        { id: '7', title: 'Appartement Haussmannien', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', price: '1.150.000 €', aiSummaryId: 'paris' },
        { id: '8', title: 'Loft Industriel Nantes', image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&q=80', price: '520.000 €', aiSummaryId: 'lyon' },
        { id: '9', title: 'Villa Provençale Aix', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', price: '1.950.000 €', aiSummaryId: 'nice' },
        { id: '10', title: 'Duplex Moderne Marseille', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', price: '890.000 €', aiSummaryId: 'lyon' },
        { id: '11', title: 'Appartement Rive Gauche', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', price: '1.450.000 €', aiSummaryId: 'paris' }
    ];

    private alertsProperties: PropertyCard[] = [
        { id: '12', title: 'Loft Moderne à Paris', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', price: '1.250.000 €', aiSummaryId: 'paris', badge: 'alert' },
        { id: '13', title: 'Villa Contemporaine Nice', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', price: '2.100.000 €', aiSummaryId: 'nice', badge: 'alert' }
    ];

    constructor(aiSummaryModal: AISummaryModal) {
        const gridEl = document.querySelector('.properties-grid');
        const navLinksEl = document.querySelectorAll('.header-center .nav-link');

        if (!gridEl || navLinksEl.length === 0) {
            throw new Error('Required DOM elements not found');
        }

        this.propertiesGrid = gridEl as HTMLElement;
        this.navLinks = navLinksEl as NodeListOf<HTMLElement>;
        this.aiSummaryModal = aiSummaryModal;

        this.setupNavigation();
    }

    /**
     * Configure la navigation entre les modes
     */
    private setupNavigation(): void {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const mode = link.getAttribute('data-mode') as GridMode;
                if (mode) {
                    this.switchMode(mode);
                }
            });
        });
    }

    /**
     * Change le mode d'affichage
     * @param mode - Mode à afficher
     */
    switchMode(mode: GridMode): void {
        this.currentMode = mode;

        // Mettre à jour les classes actives
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-mode') === mode) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Mettre à jour le titre
        const subtitle = document.querySelector('.launcher-subtitle');
        if (subtitle) {
            if (mode === 'live') {
                subtitle.textContent = 'Biens en Direct';
            } else if (mode === 'explore') {
                subtitle.textContent = 'Explorer les biens';
            } else if (mode === 'alerts') {
                subtitle.textContent = 'Mes alertes';
            }
        }

        // Rendre la grille
        this.renderGrid(mode);
    }

    /**
     * Rend la grille de propriétés selon le mode
     * @param mode - Mode d'affichage
     */
    renderGrid(mode: GridMode): void {
        this.propertiesGrid.innerHTML = '';

        let properties: PropertyCard[] = [];
        
        if (mode === 'live') {
            properties = this.liveProperties;
        } else if (mode === 'explore') {
            properties = this.exploreProperties;
        } else if (mode === 'alerts') {
            properties = this.alertsProperties;
        }

        properties.forEach(property => {
            const card = this.createPropertyCard(property, mode);
            this.propertiesGrid.appendChild(card);
        });
    }

    /**
     * Crée une carte de propriété
     * @param property - Données de la propriété
     * @param mode - Mode d'affichage
     * @returns Élément HTML de la carte
     */
    private createPropertyCard(property: PropertyCard, mode: GridMode): HTMLElement {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.setAttribute('data-property-id', property.id);

        // Image
        const imageDiv = document.createElement('div');
        imageDiv.className = 'property-image';
        imageDiv.style.backgroundImage = `url('${property.image}')`;

        const overlay = document.createElement('div');
        overlay.className = 'property-overlay';

        // Badge
        if (property.badge) {
            const badge = document.createElement('div');
            badge.className = property.badge === 'live' ? 'property-badge' : 'property-badge badge-alert';
            badge.textContent = property.badge === 'live' ? 'EN DIRECT' : '🔔 Alerte en cours';
            imageDiv.appendChild(badge);
        }

        card.appendChild(imageDiv);
        card.appendChild(overlay);

        // Content
        const content = document.createElement('div');
        content.className = 'property-content';

        const title = document.createElement('h3');
        title.className = 'property-title';
        title.textContent = property.title;
        content.appendChild(title);

        // Prix (si disponible)
        if (property.price) {
            const price = document.createElement('div');
            price.className = 'property-price';
            price.textContent = property.price;
            content.appendChild(price);
        }

        // Actions
        const actions = document.createElement('div');
        actions.className = 'property-actions';

        // Bouton "Entrer dans le bien" seulement pour le mode live
        if (mode === 'live' && property.propertyId) {
            const enterBtn = document.createElement('button');
            enterBtn.className = 'property-button';
            enterBtn.setAttribute('data-property-id', property.propertyId);
            enterBtn.textContent = 'Entrer dans le bien';
            // L'event listener sera géré par setupNavigation dans main.ts
            actions.appendChild(enterBtn);
        }

        // Bouton "Résumé IA" (toujours disponible)
        if (property.aiSummaryId) {
            const aiBtn = document.createElement('button');
            aiBtn.className = 'property-button ai-summary-btn';
            aiBtn.setAttribute('data-id', property.aiSummaryId);
            aiBtn.textContent = '✨ Résumé IA';
            aiBtn.addEventListener('click', () => {
                this.aiSummaryModal.show(property.aiSummaryId!);
            });
            actions.appendChild(aiBtn);
        }

        content.appendChild(actions);
        card.appendChild(content);

        return card;
    }
}

