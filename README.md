# Weliive AI Co-Pilot

MVP d'une interface de chat avec détection automatique de "Hot Leads" pour l'immobilier.

## 🚀 Stack Technique

- **TypeScript** (strict mode)
- **Vite** (bundler)
- **CSS moderne** avec variables CSS

## 📁 Structure du Projet

```
├── src/
│   ├── types/
│   │   └── index.ts          # Définitions de types TypeScript
│   ├── core/
│   │   ├── HotLeadEngine.ts  # Moteur d'analyse des Hot Leads
│   │   └── ChatService.ts    # Gestion des données du chat
│   ├── ui/
│   │   └── UIManager.ts      # Manipulation du DOM
│   ├── styles/
│   │   └── main.css          # Styles CSS
│   └── main.ts               # Point d'entrée
├── index.html                # HTML principal
├── tsconfig.json             # Configuration TypeScript
├── vite.config.ts            # Configuration Vite
└── package.json              # Dépendances
```

## 🛠️ Installation

```bash
npm install
```

## 🎯 Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Build

```bash
npm run build
```

## 🔍 Vérification TypeScript

```bash
npm run type-check
```

## 🏗️ Architecture

### Types (`src/types/index.ts`)
- `Message` : Structure d'un message
- `User` : Informations utilisateur
- `LeadStatus` : Statut d'un lead
- `Lead` : Informations sur un lead détecté

### HotLeadEngine (`src/core/HotLeadEngine.ts`)
- Analyse de texte pour détecter les intentions d'achat
- Structure prête pour intégration avec API OpenAI
- Méthodes : `analyze()`, `analyzeWithConfidence()`, `analyzeWithAI()`

### ChatService (`src/core/ChatService.ts`)
- Gestion des messages
- Simulation automatique
- Génération de réponses automatiques

### UIManager (`src/ui/UIManager.ts`)
- Rendering des messages
- Gestion des événements UI
- Manipulation du DOM avec types stricts

## 🔮 Intégration Future

Le `HotLeadEngine` est conçu pour être facilement remplacé par une vraie API IA :

```typescript
// Dans HotLeadEngine.ts
async analyzeWithAI(text: string): Promise<boolean> {
    const response = await fetch('/api/analyze-lead', {
        method: 'POST',
        body: JSON.stringify({ text }),
    });
    const result = await response.json();
    return result.isHotLead;
}
```

## 📝 License

MIT

