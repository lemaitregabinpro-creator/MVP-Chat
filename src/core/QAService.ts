/**
 * QAService - Gestion des Questions/Réponses Live
 */

export interface QAItem {
    id: string;
    question: string;
    answer: string | null; // null si en attente de réponse
    acknowledgment: string | null; // Message de confirmation système
    timestamp: Date;
    status: 'pending' | 'acknowledged' | 'answered';
}

export class QAService {
    private qaItems: QAItem[] = [];

    constructor() {
        // Initialiser avec des Q&A fictives
        this.initializeSampleQA();
    }

    /**
     * Initialise des Q&A d'exemple
     */
    private initializeSampleQA(): void {
        this.addQA(
            "Quelle est l'exposition de l'appartement ?",
            "L'appartement bénéficie d'une exposition Sud-Ouest, idéale pour profiter du soleil toute la journée."
        );

        this.addQA(
            "Y a-t-il une cave ?",
            "Oui, il y a une cave de 12m² incluse dans le prix."
        );

        this.addQA(
            "Quel est l'état des travaux à prévoir ?",
            "L'appartement est en excellent état, aucun travaux nécessaires. Il a été entièrement rénové en 2020."
        );
    }

    /**
     * Ajoute une nouvelle question (sans réponse)
     * @param question - Texte de la question
     * @returns L'item Q&A créé
     */
    addQuestion(question: string): QAItem {
        const qaItem: QAItem = {
            id: this.generateQAId(),
            question: question.trim(),
            answer: null,
            acknowledgment: null,
            timestamp: new Date(),
            status: 'pending',
        };

        this.qaItems.push(qaItem);
        return qaItem;
    }

    /**
     * Ajoute une Q&A complète (question + réponse)
     * @param question - Texte de la question
     * @param answer - Texte de la réponse
     * @returns L'item Q&A créé
     */
    addQA(question: string, answer: string): QAItem {
        const qaItem: QAItem = {
            id: this.generateQAId(),
            question: question.trim(),
            answer: answer.trim(),
            acknowledgment: null,
            timestamp: new Date(),
            status: 'answered',
        };

        this.qaItems.push(qaItem);
        return qaItem;
    }

    /**
     * Ajoute un message de confirmation système à une question
     * @param qaId - ID de la Q&A
     * @param acknowledgment - Texte de la confirmation
     * @returns true si la Q&A a été trouvée et mise à jour
     */
    addAcknowledgment(qaId: string, acknowledgment: string): boolean {
        const qaItem = this.qaItems.find(item => item.id === qaId);
        
        if (!qaItem) {
            return false;
        }

        qaItem.acknowledgment = acknowledgment.trim();
        qaItem.status = 'acknowledged';
        return true;
    }

    /**
     * Ajoute une réponse à une question existante
     * @param qaId - ID de la Q&A
     * @param answer - Texte de la réponse
     * @returns true si la Q&A a été trouvée et mise à jour
     */
    addAnswer(qaId: string, answer: string): boolean {
        const qaItem = this.qaItems.find(item => item.id === qaId);
        
        if (!qaItem) {
            return false;
        }

        qaItem.answer = answer.trim();
        qaItem.status = 'answered';
        return true;
    }

    /**
     * Récupère toutes les Q&A
     * @returns Liste des Q&A
     */
    getAllQA(): QAItem[] {
        return [...this.qaItems]; // Retourne une copie
    }

    /**
     * Récupère une Q&A par son ID
     * @param qaId - ID de la Q&A
     * @returns La Q&A ou null
     */
    getQAById(qaId: string): QAItem | null {
        return this.qaItems.find(item => item.id === qaId) || null;
    }

    /**
     * Génère un ID unique pour une Q&A
     * @returns ID unique
     */
    private generateQAId(): string {
        return `qa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Simule une réponse automatique du vendeur
     * @param qaId - ID de la Q&A
     * @returns Réponse générée
     */
    generateAutoAnswer(qaId: string): string {
        const responses = [
            "C'est une excellente question, je vous montre ça en vidéo dans un instant !",
            "Merci pour votre question. Je vais vous donner plus de détails en direct.",
            "Excellente question ! Laissez-moi vous expliquer cela en détail.",
            "Je comprends votre question. Voici la réponse que je peux vous donner maintenant.",
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addAnswer(qaId, randomResponse);
        return randomResponse;
    }
}

