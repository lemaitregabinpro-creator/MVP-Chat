/**
 * HotLeadEngine - Moteur d'analyse pour détecter les intentions d'achat
 * Structure prête pour intégration avec API OpenAI
 */

import type { Message } from '../types';

export class HotLeadEngine {
    private readonly hotLeadKeywords: string[];
    private readonly minConfidence: number;

    constructor() {
        // Mots-clés pour détection basique (remplaçable par IA)
        this.hotLeadKeywords = [
            'prix',
            'acheter',
            'achat',
            'loyer',
            'montant',
            'disponible',
            'dispo',
            'visite',
            'visiter',
            'signer',
            'contrat',
            'réservation',
            'réserver'
        ];
        
        this.minConfidence = 0.5;
    }

    /**
     * Analyse un texte et détermine s'il s'agit d'un Hot Lead
     * @param text - Texte à analyser
     * @returns true si un Hot Lead est détecté
     */
    analyze(text: string): boolean {
        if (!text || typeof text !== 'string') {
            return false;
        }

        const lowerText = text.toLowerCase().trim();
        
        // Détection basique par mots-clés
        const keywordMatches = this.hotLeadKeywords.filter(keyword => 
            lowerText.includes(keyword)
        );

        // Si au moins 1 mot-clé est trouvé, c'est un Hot Lead
        return keywordMatches.length > 0;
    }

    /**
     * Analyse un message complet et retourne un score de confiance
     * @param message - Message à analyser
     * @returns Score de confiance entre 0 et 1
     */
    analyzeWithConfidence(message: Message): number {
        const text = message.text.toLowerCase();
        const keywordMatches = this.hotLeadKeywords.filter(keyword => 
            text.includes(keyword)
        );

        // Calcul simple : nombre de mots-clés trouvés / nombre total de mots-clés
        // À remplacer par une vraie analyse IA
        const confidence = Math.min(
            keywordMatches.length / this.hotLeadKeywords.length,
            1.0
        );

        return confidence;
    }

    /**
     * Vérifie si un message est un Hot Lead basé sur le score de confiance
     * @param message - Message à vérifier
     * @returns true si le score dépasse le seuil minimum
     */
    isHotLead(message: Message): boolean {
        const confidence = this.analyzeWithConfidence(message);
        return confidence >= this.minConfidence;
    }

    /**
     * Méthode pour intégrer une API externe (OpenAI, etc.)
     * @param text - Texte à analyser
     * @returns Promise<boolean> - Résultat de l'analyse IA
     */
    async analyzeWithAI(text: string): Promise<boolean> {
        // TODO: Implémenter l'appel à l'API OpenAI
        // Exemple de structure :
        // const response = await fetch('/api/analyze-lead', {
        //     method: 'POST',
        //     body: JSON.stringify({ text }),
        // });
        // const result = await response.json();
        // return result.isHotLead;
        
        // Pour l'instant, fallback sur la méthode basique
        return this.analyze(text);
    }

    /**
     * Met à jour les mots-clés de détection
     * @param keywords - Nouveaux mots-clés
     */
    updateKeywords(keywords: string[]): void {
        this.hotLeadKeywords.length = 0;
        this.hotLeadKeywords.push(...keywords);
    }

    /**
     * Met à jour le seuil de confiance minimum
     * @param confidence - Nouveau seuil (0-1)
     */
    setMinConfidence(confidence: number): void {
        if (confidence < 0 || confidence > 1) {
            throw new Error('Confidence must be between 0 and 1');
        }
        this.minConfidence = confidence;
    }
}

