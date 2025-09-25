# 🚚 Food Truck API

API backend développée avec **NestJS**, **Prisma** et **PostgreSQL** pour gérer une plateforme de food trucks.  
Elle inclut l’authentification JWT, la gestion des utilisateurs, des food trucks, des menus, des commandes et des paiements.

---

## ⚙️ Stack technique

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Swagger](https://swagger.io/) (docs auto)
- [JWT Auth](https://jwt.io/)
- [Jest](https://jestjs.io/) pour les tests

---

## 📁 Structure du projet

```
src/
├── common/
│   ├── guard/             # Guards personnalisés
│   ├── middlewares/       # Middleware de gestion des erreurs/succès
│   ├── modules/
│   │   ├── config/        # Gestion des variables d'env
│   │   ├── prisma/        # PrismaService
│   │   └── shared.module.ts
│   ├── strategy/          # Stratégie JWT
│   └── utils/             # Fonctions utilitaires (cryptage)
│
├── modules/
│   ├── auth/              # Authentification (login, signup)
│   ├── user/              # Gestion des utilisateurs
│   └── core.module.ts
│
├── swagger/
│   └── swagger.api.ts     # Configuration Swagger
│
├── main.ts                # Entrée de l'application
├── app.module.ts          # Module racine
```

---

## 📦 Installation

```bash
git clone https://github.com/ton-utilisateur/food-truck-api.git
cd food-truck-api

# Installer les dépendances
yarn install
```

---

## 🔑 Configuration des variables d'environnement

Crée un fichier `.env.development` avec le contenu suivant :

```env
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/foodtruckdb"
JWT_SECRET="votre_cle_jwt"
JWT_EXPIRES_IN="1d"
port=votre port
```

---

## 🧬 Prisma

```bash
# Générer le client Prisma
yarn generate:dev

# Appliquer les migrations (création de la BDD)
yarn migrate:dev

# Ouvrir Prisma Studio pour visualiser la BDD
npx prisma studio
```

---

## 🧪 Lancer le projet

```bash
# En mode développement (hot reload)
yarn start:dev

# En mode production (build + start)
yarn build
yarn start
```

---

## 🧪 Tests

```bash
# Tests unitaires
yarn test

# Couverture
yarn test:cov

# Tests E2E
yarn test:e2e
```

---

## 📘 Swagger API Docs

La documentation de l’API est disponible ici :

```
http://localhost:3000/api
```

Swagger est initialisé dans :  
📄 `src/swagger/swagger.api.ts`

---

## 🚨 Lint & Format

```bash
# Format du code
yarn format

# Linter + corrections
yarn lint
```

---

## 📌 Conventions

- Commits : [Conventional Commits](https://www.conventionalcommits.org/)
- Hooks Git : Husky + lint-staged
- Lint : ESLint + Prettier intégrés

---

## 🛡️ Sécurité

- Authentification avec JWT (`Bearer`)
- Endpoints protégés avec des Guards
- Utilisation des rôles (`CLIENT`, `SELLER`)

---

## 🧭 TODO MVP

- [x] Authentification (JWT)
- [x] Gestion des food trucks
- [x] Création de menus et spécialités
- [x] Commandes et paiements
- [x] Notifications & favoris
- [ ] Websocket temps réel pour suivi de commande
- [ ] Paiement Stripe / autre

---

## 📄 Licence

UNLICENSED – Utilisation interne uniquement