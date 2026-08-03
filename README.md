# Running the Project

> [!IMPORTANT]
> GameNotes depends on a **Firebase** backend for authentication and data storage. Since the production database contains user-generated reviews and user accounts, I cannot provide a public development database.

To run the project locally, you will need to:

1. Create your own Firebase project.
2. Configure the required environment variables for your Firebase application.
3. Create the required Firestore collections and security rules.

If you are interested in contributing to the project or exploring the full functionality, feel free to contact me and I can provide the database schema, Firestore structure, and any additional setup information.

After configuring Firebase, install the dependencies and start the development server:

```bash
npm install
npm run dev
```

The application will then be available at:

```text
http://localhost:3000
```

---

# GameNotes

GameNotes is a community-driven video game review platform designed to encourage **objective game analysis** rather than simple overall ratings. Instead of assigning a single score, each review evaluates a game across seven carefully chosen aspects that together provide a more meaningful picture of its design.

Originally developed by **Dávid Butyka**, GameNotes focuses on evaluating games from an artistic and game design perspective while also providing a centralized place for players to share detailed reviews.

---

## Features

- 🎮 Community-written game reviews
- ⭐ Seven-category review system
- 📊 Automatically calculated weighted overall ratings
- 📈 Aggregate statistics for every game
- 👤 Google authentication
- ✍️ Create, edit, and delete your own reviews
- 📚 Dedicated page for every reviewed game
- 📋 User dashboard for managing reviews

---

# Rating System

Unlike traditional review sites that rely on a single overall score, GameNotes evaluates games across seven individual aspects.

Each category contributes differently to the final score through predefined weights.

| Category | Weight |
|----------|-------:|
| Gameplay | ×4 |
| Atmosphere | ×4 |
| Visuals | ×3 |
| Story | ×3 |
| Characters | ×2 |
| Audio | ×2 |
| Replayability | ×1 |

Categories that are completely irrelevant for a particular game may be assigned a score of **0**. These values are ignored during the overall rating calculation instead of lowering the final score.

---

## Rating Categories

### Gameplay
Everything related to controlling and playing the game, including mechanics, level design, mission design, and overall game feel.

### Atmosphere
How immersive the game world is through its art direction, environments, consistency, and attention to detail.

### Visuals
Graphical quality and technical presentation. This category primarily reflects graphical complexity rather than artistic direction.

### Story
Narrative quality, storytelling, and lore.

### Characters
Character writing, development, memorability, and progression throughout the game.

### Audio
Music, sound effects, voice acting, and overall audio design.

### Replayability
How likely players are to revisit the game after completion, including replay value from alternative playstyles, roguelike mechanics, challenge modes, or branching content.

---

# Game Pages

Every reviewed game has its own dedicated page containing:

- Average overall rating
- Average ratings for every category
- Community statistics (such as playtime)
- Complete list of user reviews

This allows visitors to quickly understand both the quantitative and qualitative opinions of the community.

---

# Creating Reviews

Users can create reviews after signing in with a Google account.

From the personal dashboard users can:

- Create new reviews
- Edit existing reviews
- Delete reviews

> **Important:** When creating a review, the game title must match the existing title exactly. Otherwise a new game entry will be created.

---

# Planned Features

Future improvements planned for GameNotes include:

- User search
- Genre-specific rating calculations
- Game comparison page
- Personal game ranking system based on the Elo rating system

---

# Technology Stack

- Next.js
- React
- Firebase Authentication
- Cloud Firestore
- TypeScript
- CSS Modules

---

# Author

**Dávid Butyka**

Portfolio: https://butykadavid.github.io

---

## Contributing

GameNotes is an active hobby project, and contributions are welcome.

Whether you'd like to report a bug, suggest a feature, improve the documentation, or submit code, feel free to open an issue or a pull request. Every contribution is appreciated and helps the project continue to grow.

---

# License

This project is released under the MIT License.