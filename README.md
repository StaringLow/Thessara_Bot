# Thessara_Bot
🔮 Thessara - Bot Discord maison dédié au serveur "La Guilde". https://discord.gg/VzsrYhxrHn
Inclut un dashboard web de configuration inspiré de MEE6 et Koya.

---

## ✨ Fonctionnalités

- 👋 Système de bienvenue automatique avec rôle assigné
- 🎫 Système de tickets avec panel interactif et gestion Staff
- ⚔️ Modération complète (ban, kick, mute, unmute, clear)
- 📋 Logs des actions du serveur (arrivées, départs, sanctions)
- 🌐 Dashboard web local avec connexion via Discord OAuth2

---

## 🛠️ Stack technique

- **Bot** : Node.js + Discord.js v14
- **Dashboard** : Express.js + EJS + Passport Discord OAuth2
- **Hébergement** : Actuellement local (Windows)

---

## 🚀 Installation

1. Installe [Node.js](https://nodejs.org) (version LTS)
2. Clone le repository
3. Crée ton `config.json` à partir du modèle ci-dessous
4. Lance `DEMARRER.bat`
5. Ouvre `http://localhost:3000` dans ton navigateur

### Modèle config.json
```json
{
  "token": "TON_TOKEN_ICI",
  "clientId": "TON_CLIENT_ID",
  "clientSecret": "TON_CLIENT_SECRET",
  "prefix": "!",
  "botName": "Thessara",
  "dashboardPort": 3000,
  "dashboardUrl": "http://localhost:3000",
  "sessionSecret": "un_secret_aleatoire",
  "embedColor": "#5865F2",
  "embedColorError": "#ED4245",
  "embedColorSuccess": "#57F287",
  "embedColorWarn": "#FEE75C",
  "channels": { "welcome": "", "logs": "", "tickets": "" },
  "roles": { "staff": "", "member": "" }
}
```

---

## ⚠️ Note sur le développement

Ce projet est développé en collaboration avec une IA (Claude, par Anthropic).

En tant que propriétaire du projet, je définis les fonctionnalités,
la direction et la vision de Thessara. Le code est généré et maintenu
avec l'aide de l'IA, car je ne dispose pas du temps nécessaire pour
apprendre les différents langages impliqués (JavaScript, Node.js, HTML/CSS).

Environ **85-90%** du code a été produit par IA, sur la base de mes
instructions et besoins précis.

---

## 📌 Statut

🟢 En développement actif

---

## ⚖️ Droits

Ce projet est privé. Tous droits réservés © 2025 StaringLow
Aucune réutilisation autorisée sans permission explicite de l'auteur.
