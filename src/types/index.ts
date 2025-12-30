/**
 * Type definitions for Weliive AI Co-Pilot
 */

export type MessageSender = 'user' | 'ai' | 'system';

export interface Message {
    id: string;
    text: string;
    sender: MessageSender;
    timestamp: Date;
    isHotLead?: boolean; // Pour marquer visuellement les messages importants
}

export interface User {
    id: string;
    name?: string;
    email?: string;
}

export type LeadStatus = 'none' | 'potential' | 'hot' | 'converted';

export interface Lead {
    id: string;
    userId: string;
    status: LeadStatus;
    detectedAt: Date;
    confidence?: number; // Score de confiance (0-1)
}

