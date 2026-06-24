import { useEffect, useState } from "react";
import Modal from "./Modal";
import styles from "../../styles/homepage/trivia.module.css";
import {
    fetchSummaries,
    fetchTopTriviaPlayers,
    fetchUserByUid,
    updateUserTriviaBest,
} from "../lib/firestore";
import { signInWithGoogle } from "../../public/firebase";

const buildTriviaTriplets = (summaries) => {
    const rounds = [];
    const usedKeys = new Set();
    const candidates = [...summaries];

    let attempts = 0;
    while (rounds.length < 10 && attempts < 500) {
        attempts += 1;
        if (candidates.length < 3) break;

        const triplet = [];
        const selected = new Set();
        while (triplet.length < 3) {
            const index = Math.floor(Math.random() * candidates.length);
            if (selected.has(index)) continue;
            selected.add(index);
            triplet.push(candidates[index]);
        }

        const key = triplet.map((item) => item.id || item.title).sort().join("|");
        if (usedKeys.has(key)) continue;
        usedKeys.add(key);
        rounds.push(triplet);
    }

    return rounds;
};

const emptyTriviaState = {
    round: 0,
    score: 0,
    activeRoundStartedAt: null,
    rounds: [],
    currentTriplet: [],
    selectedOrder: [],
    countdown: 5,
    started: false,
    finished: false,
    bestScore: 0,
    leaderboard: [],
    error: null,
};

export default function TriviaGameComponent({ user }) {
    const [visible, setVisible] = useState(false);
    const [triviaState, setTriviaState] = useState(emptyTriviaState);
    const [elapsed, setElapsed] = useState(0);

    const resetTrivia = () => {
        setTriviaState(emptyTriviaState);
    };

    const startTrivia = async () => {
        try {
            const summaries = await fetchSummaries({ limitCount: 50 });
            if (!summaries || summaries.length < 3) {
                setTriviaState({
                    ...emptyTriviaState,
                    error: "Not enough summaries available for trivia.",
                });
                setVisible(true);
                return;
            }

            const rounds = buildTriviaTriplets(summaries);
            if (rounds.length === 0) {
                setTriviaState({
                    ...emptyTriviaState,
                    error: "Unable to create trivia rounds.",
                });
                setVisible(true);
                return;
            }

            const leaderboard = await fetchTopTriviaPlayers(5);
            const userDoc = user ? await fetchUserByUid(user.uid) : null;
            const bestScore = userDoc?.bestTriviaScore || 0;

            setTriviaState({
                ...emptyTriviaState,
                rounds,
                leaderboard,
                bestScore,
            });
            setVisible(true);
        } catch (err) {
            console.error(err);
            setTriviaState({
                ...emptyTriviaState,
                error: "Unable to start trivia.",
            });
            setVisible(true);
        }
    };

    const closeTrivia = () => {
        setVisible(false);
        resetTrivia();
    };

    const beginRound = () => {
        setTriviaState((prev) => {
            const nextRound = prev.round;
            if (nextRound >= prev.rounds.length) {
                return prev;
            }

            // Only show countdown on the first round; start subsequent rounds immediately
            const isFirstRound = nextRound === 0;
            return {
                ...prev,
                currentTriplet: prev.rounds[nextRound],
                selectedOrder: [],
                countdown: isFirstRound ? 5 : 0,
                started: !isFirstRound,
                activeRoundStartedAt: isFirstRound ? null : Date.now(),
            };
        });
    };

    const handleCountdownComplete = () => {
        setTriviaState((prev) => ({
            ...prev,
            started: true,
            activeRoundStartedAt: Date.now(),
        }));
    };

    const submitOrder = () => {
        setTriviaState((prev) => {
            if (!prev.started || prev.selectedOrder.length !== 3 || !prev.activeRoundStartedAt) return prev;

            const orderedByScore = [...prev.currentTriplet].sort((a, b) => b.average - a.average);
            const correctOrder = orderedByScore.map((item) => item.id || item.title);
            const selectedIds = prev.selectedOrder;
            let roundScore = 0;
            for (let i = 0; i < 3; i += 1) {
                if (selectedIds[i] === correctOrder[i]) {
                    roundScore += 10000;
                }
            }
            const roundTime = Date.now() - prev.activeRoundStartedAt;
            roundScore += Math.max(0, 10000 - roundTime);

            const nextRound = prev.round + 1;
            const finished = nextRound >= prev.rounds.length;

            return {
                ...prev,
                score: prev.score + roundScore,
                round: nextRound,
                currentTriplet: finished ? prev.currentTriplet : [],
                selectedOrder: [],
                started: false,
                activeRoundStartedAt: null,
                finished,
            };
        });
    };

    useEffect(() => {
        if (!visible) return;
        if (triviaState.finished || triviaState.error) return;

        if (triviaState.currentTriplet.length === 0 && triviaState.rounds.length > 0) {
            beginRound();
            return;
        }

        if (triviaState.started) return;

        const timer = setInterval(() => {
            setTriviaState((prev) => {
                if (prev.countdown <= 1) {
                    clearInterval(timer);
                    handleCountdownComplete();
                    return { ...prev, countdown: 0 };
                }
                return { ...prev, countdown: prev.countdown - 1 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [visible, triviaState.countdown, triviaState.currentTriplet.length, triviaState.rounds.length, triviaState.started, triviaState.finished, triviaState.error]);

    // track elapsed time while a round is active
    useEffect(() => {
        if (!triviaState.started || !triviaState.activeRoundStartedAt) {
            setElapsed(0);
            return;
        }

        const tick = () => setElapsed(Date.now() - triviaState.activeRoundStartedAt);
        tick();
        const t = setInterval(tick, 100);
        return () => clearInterval(t);
    }, [triviaState.started, triviaState.activeRoundStartedAt]);

    useEffect(() => {
        if (!triviaState.finished) return;
        if (!user) return;

        const saveAndRefreshLeaderboard = async () => {
            try {
                if (triviaState.score > triviaState.bestScore) {
                    await updateUserTriviaBest(user.uid, triviaState.score);
                }
                const leaderboard = await fetchTopTriviaPlayers(5);
                setTriviaState((prev) => ({ ...prev, leaderboard }));
            } catch (err) {
                console.error(err);
            }
        };

        saveAndRefreshLeaderboard();
    }, [triviaState.finished, triviaState.score, triviaState.bestScore, user]);

    const handleSelect = (id) => {
        setTriviaState((prev) => {
            if (!prev.started) return prev;
            const hasSelected = prev.selectedOrder.includes(id);
            const selectedOrder = hasSelected
                ? prev.selectedOrder.filter((selected) => selected !== id)
                : [...prev.selectedOrder, id];
            return { ...prev, selectedOrder };
        });
    };

    const canSubmit = triviaState.started && triviaState.selectedOrder.length === 3;
    const roundLabel = triviaState.finished ? triviaState.rounds.length : triviaState.round + 1;
    const benchmarkText = user
        ? (triviaState.score > triviaState.bestScore ? "New personal best!" : "")
        : "Log in to save your score after the game.";

    return (
        <>
            <div className={`${styles.box} ${styles.card__trivia}`} onClick={startTrivia}>
                <div className={styles.card__icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" /></svg>
                </div>
                <h2>Trivia Game</h2>
                <p>Test your GameNotes knowledge</p>
            </div>

            <Modal visible={visible} setVisible={setVisible} title="GameNotes Trivia" width="1000px" height="640px">
                <div className={styles.triviaContainer}>
                    {triviaState.error ? (
                        <div className={styles.triviaMessage}>{triviaState.error}</div>
                    ) : triviaState.finished ? (
                        <>
                            <div className={styles.triviaHeader}>
                                <h2>Game over</h2>
                                <p>Your score: {triviaState.score}</p>
                                <p>{benchmarkText}</p>
                            </div>
                            <div className={styles.triviaSummaryBox}>
                                <div className={styles.scoreBox}>
                                    <div>Personal best</div>
                                    <strong>{triviaState.bestScore}</strong>
                                </div>
                                <div className={styles.scoreBox}>
                                    <div>Rounds</div>
                                    <strong>{triviaState.rounds.length}</strong>
                                </div>
                                <div className={styles.scoreBox}>
                                    <div>Final score</div>
                                    <strong>{triviaState.score}</strong>
                                </div>
                            </div>
                            <div className={styles.triviaLeaderboard}>
                                <h3>Leaderboard</h3>
                                <ul className={styles.triviaLeaderboardList}>
                                    {triviaState.leaderboard.map((userItem, index) => (
                                        <li key={userItem.uid || userItem.id || index} className={styles.triviaLeaderboardItem}>
                                            <span>{index + 1}. {userItem.name || userItem.email || 'Unknown'}</span>
                                            <strong>{userItem.bestTriviaScore || 0}</strong>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.triviaActions}>
                                {!user && (
                                    <button className={styles.triviaButton} onClick={() => signInWithGoogle()}>
                                        Log in to save your score
                                    </button>
                                )}
                                <button className={styles.triviaButton} onClick={closeTrivia}>
                                    Close
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.headerRow}>
                                <div className={styles.headerLeft}>
                                    <h2>Round {roundLabel} / {triviaState.rounds.length}</h2>
                                    <p className={styles.small}>Score: <strong>{triviaState.score}</strong></p>
                                </div>
                                <div className={styles.headerRight}>
                                    <div className={styles.timeBox}>Bonus: <span>{Math.max(0, (10000 - elapsed)).toFixed(0)}</span></div>
                                </div>
                            </div>
                            {triviaState.started ? (
                                <div className={styles.triviaGrid}>
                                    {triviaState.currentTriplet.map((item) => {
                                        const idKey = item.id || item.title;
                                        const selectedIdx = triviaState.selectedOrder.indexOf(idKey);
                                        const bg = item.img || item.imgUrl || item.cover || "";
                                        return (
                                            <button
                                                key={idKey}
                                                type="button"
                                                className={`${styles.triviaSummary} ${selectedIdx >= 0 ? styles.triviaSummarySelected : ""}`}
                                                onClick={() => handleSelect(idKey)}
                                                style={bg ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                                            >
                                                <div className={styles.triviaSummaryOrder}>{selectedIdx >= 0 ? selectedIdx + 1 : ""}</div>
                                                <div className={styles.cardOverlay}>
                                                    <h3>{item.title}</h3>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.countdownOverlay}>
                                    <div className={styles.countdownNumber}>{triviaState.countdown}</div>
                                    <div className={styles.countdownLabel}>
                                        <h3>Get ready</h3>
                                        <p>Order the GameNotes reviews by overall user ratings in descending order as quickly as you can!</p>
                                    </div>
                                </div>
                            )}
                            <div className={styles.triviaActions}>
                                <button
                                    type="button"
                                    className={`${styles.triviaButton} ${!canSubmit ? styles.triviaButtonDisabled : ""}`}
                                    onClick={submitOrder}
                                    disabled={!canSubmit}
                                >
                                    {triviaState.round + 1 >= triviaState.rounds.length ? "Finish game" : "Submit order"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    );
}
