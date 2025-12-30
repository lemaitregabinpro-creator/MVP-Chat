/**
 * PropertyData - Configuration des données des biens immobiliers
 */

export interface PropertySummary {
    id: string;
    summary: string;
}

export const propertySummaries: Record<string, PropertySummary> = {
    paris: {
        id: 'paris',
        summary: "Ce loft exceptionnel de 120m² offre une vue imprenable sur la Tour Eiffel. Rénové par un architecte de renom, il combine le charme de l'ancien (parquet, moulures) avec une domotique de pointe. Idéal pour les amateurs d'art et de design contemporain."
    },
    lyon: {
        id: 'lyon',
        summary: "Situé au cœur du quartier Confluence, cet appartement éco-responsable se distingue par sa luminosité traversante et sa terrasse végétalisée de 30m². Proche de toutes commodités, il offre un cadre de vie urbain et apaisant."
    },
    nice: {
        id: 'nice',
        summary: "Villa contemporaine sur les hauteurs, offrant une piscine à débordement avec vue mer panoramique. Architecture minimaliste, grands volumes vitrés et jardin méditerranéen de 1500m². Un havre de paix absolu."
    }
};

/**
 * Génère une réponse IA simulée basée sur la question et le bien
 * @param propertyId - ID du bien
 * @param question - Question de l'utilisateur
 * @returns Réponse simulée
 */
export function generateAIResponse(propertyId: string, question: string): string {
    const responses: Record<string, string[]> = {
        paris: [
            "Le loft dispose d'un système domotique complet permettant de contrôler l'éclairage, le chauffage et la sécurité depuis votre smartphone.",
            "La vue sur la Tour Eiffel est accessible depuis le salon principal et la chambre maître. Les grandes baies vitrées offrent une luminosité exceptionnelle.",
            "Le parquet d'origine a été restauré avec soin, conservant son authenticité tout en intégrant un système de chauffage au sol discret."
        ],
        lyon: [
            "L'appartement bénéficie d'une certification énergétique A, avec des matériaux écologiques et un système de récupération d'eau de pluie pour la terrasse.",
            "La terrasse végétalisée de 30m² est orientée sud, parfaite pour les déjeuners ensoleillés. Elle est équipée d'un système d'irrigation automatique.",
            "Le quartier Confluence est très bien desservi par les transports en commun, avec une station de tramway à 3 minutes à pied."
        ],
        nice: [
            "La piscine à débordement offre une vue panoramique sur la Méditerranée. Elle est équipée d'un système de chauffage et d'un éclairage LED pour les soirées.",
            "Le jardin méditerranéen de 1500m² est entretenu par un paysagiste et comprend des oliviers centenaires, des lavandes et un potager bio.",
            "L'architecture minimaliste privilégie les grandes ouvertures vitrées pour profiter de la lumière naturelle et de la vue exceptionnelle."
        ]
    };

    const propertyResponses = responses[propertyId] || responses.paris;
    const randomIndex = Math.floor(Math.random() * propertyResponses.length);
    return propertyResponses[randomIndex];
}

