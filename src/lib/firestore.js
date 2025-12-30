import { db } from "../../public/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    orderBy,
    limit,
    doc,
} from "firebase/firestore";
import { getOvrRating, toSearchWordsArray } from "../../public/functions";

// Home page data
export async function fetchRecentGames(limitCount = 5) {
    const q = query(collection(db, "games"), orderBy("created", "desc"), limit(limitCount));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

export async function fetchBestOverallGames(limitCount = 4) {
    const q = query(collection(db, "summaries"), orderBy("average", "desc"), limit(limitCount));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

export async function fetchNewestProfiles(limitCount = 10) {
    const q = query(collection(db, "users"), limit(limitCount));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

export async function fetchRecentPosts(limitCount = 5) {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(limitCount));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

export async function createPost({ title, text, userId }) {
    await addDoc(collection(db, "posts"), {
        title,
        text,
        createdAt: Math.floor(Date.now() / 1000),
        userPath: `users/${userId}`,
    });
}

// Games list / summaries
export async function fetchSummaries({ searchWord = null, limitCount = 25 } = {}) {
    let q;
    if (searchWord) {
        q = query(
            collection(db, "summaries"),
            where("searchArray", "array-contains", searchWord.toLowerCase()),
            limit(limitCount)
        );
    } else {
        q = query(collection(db, "summaries"), orderBy("count", "desc"), limit(limitCount));
    }

    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

// Game detail
export async function fetchGameReviewsByTitle(title) {
    const q = query(collection(db, "games"), where("title", "==", title));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

export async function fetchSummaryByTitle(title) {
    const q = query(collection(db, "summaries"), where("title", "==", title));
    const docs = await getDocs(q);
    const items = docs.docs.map((d) => ({ id: d.id, ...d.data() }));
    return items[0] || null;
}

// Profile
export async function fetchUserByUid(uid) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const docs = await getDocs(q);
    const users = docs.docs.map((d) => ({ ...d.data() }));
    return users[0] || null;
}

export async function fetchGamesForUser(uid) {
    const q = query(collection(db, "games"), where("userPath", "==", `users/${uid}`));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ ...d.data() }));
}

// Admin
export async function fetchAllSummariesOrderedByTitle() {
    const q = query(collection(db, "summaries"), orderBy("title", "asc"));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchAllSummaries() {
    const q = query(collection(db, "summaries"));
    const docs = await getDocs(q);
    return docs.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateSummaryImage(summaryId, url) {
    const ref = doc(db, "summaries", summaryId);
    await updateDoc(ref, { img: url });
}

// Dashboard: upsert game + adjust summaries
export async function upsertUserGame({ userUid, userName, game }) {
    // game: plain object containing all rating fields, notes, etc. with correct types

    let q = query(
        collection(db, "games"),
        where("title", "==", game.title),
        where("userPath", "==", `users/${userUid}`)
    );
    let docs = await getDocs(q);

    let existingGameId = null;
    docs.forEach((d) => {
        existingGameId = d.id;
    });

    const now = Math.floor(Date.now() / 1000);

    if (!existingGameId) {
        // create new review
        await addDoc(collection(db, "games"), {
            ...game,
            userName,
            userPath: `users/${userUid}`,
            created: now,
            updated: now,
        });

        // adjust or create summary
        q = query(collection(db, "summaries"), where("title", "==", game.title));
        docs = await getDocs(q);

        const ratingSource = {
            gameplay: game.gameplay,
            visuals: game.visuals,
            atmosphere: game.atmosphere,
            story: game.story,
            characters: game.characters,
            audio: game.audio,
            replayability: game.replayability,
        };

        const ovr = getOvrRating(ratingSource);

        if (docs.docs.length !== 0) {
            const existing = docs.docs.map((d) => ({ id: d.id, ...d.data() }))[0];

            let count = existing.count;
            let avg = existing.average;
            let sum = count * avg;

            count += 1;
            sum += ovr;
            avg = Math.round(sum / count);

            const summaryRef = doc(db, "summaries", existing.id);
            await updateDoc(summaryRef, {
                count,
                average: avg,
            });
        } else {
            await addDoc(collection(db, "summaries"), {
                count: 1,
                average: ovr,
                title: game.title,
                frenchise: null,
                searchArray: toSearchWordsArray(game.title),
            });
        }
    } else {
        // update existing review
        const gameRef = doc(db, "games", existingGameId);
        await updateDoc(gameRef, {
            ...game,
            updated: now,
        });

        // previous overall from stored game
        const prevOvr = getOvrRating(docs.docs[0].data());

        // adjust summary
        q = query(collection(db, "summaries"), where("title", "==", game.title));
        docs = await getDocs(q);

        const ratingSource = {
            gameplay: game.gameplay,
            visuals: game.visuals,
            atmosphere: game.atmosphere,
            story: game.story,
            characters: game.characters,
            audio: game.audio,
            replayability: game.replayability,
        };

        const ovr = getOvrRating(ratingSource);

        const existing = docs.docs.map((d) => ({ id: d.id, ...d.data() }))[0];

        let count = existing.count;
        let avg = existing.average;
        let sum = count * avg;

        sum -= prevOvr;
        sum += ovr;
        avg = Math.round(sum / count);

        const summaryRef = doc(db, "summaries", existing.id);
        await updateDoc(summaryRef, {
            count,
            average: avg,
        });
    }
}




