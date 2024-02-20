import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../public/firebase";
import { query, getDocs, collection, where, doc, deleteDoc } from 'firebase/firestore';

import styles from "../styles/gameCard.module.css"
import card_styles from "../styles/gameCard.module.css"

const GameCardComponent = ({ games, fillParentForm }) => {

    const _games = games;

    const [gameList, orderGames] = useState(_games)

    var viewIndex = null;
    var orderingIndex = null;

    const router = useRouter();

    var start;
    var end;

    const getDateFromTimestamp = (timestamp) => {
        return new Date(timestamp * 1000);
    }

    const getFormattedDate = (date) => {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
        return date.getFullYear() + "." + months[date.getMonth()];
    }

    const getOvrRating = (game) => {

        // calculating overall rating
        // the multipliers are there for weights for certain stats
        // if a stat is 0 it doesn't count

        var invalids = 0;
        if (game.gameplay == 0) invalids += 4;
        if (game.story == 0) invalids += 3;
        if (game.atmosphere == 0) invalids += 4;
        if (game.visuals == 0) invalids += 3;
        if (game.characters == 0) invalids += 2;
        if (game.audio == 0) invalids += 2;
        if (game.replayability == 0) invalids++;

        var ovr = (game.gameplay * 4) + (game.story * 3) + (game.atmosphere * 4) + (game.visuals * 3) +
            (game.characters * 2) + (game.audio * 2) + game.replayability;


        return Math.floor(ovr / (19 - invalids));
    }

    const getColor = n => {
        if (n >= 90) return "#00ff36"
        else if (n >= 80 && n < 90) return "#7ae900"
        else if (n >= 70 && n < 80) return "#a6d100"
        else if (n >= 60 && n < 70) return "#c6b600"
        else if (n >= 50 && n < 60) return "#de9900"
        else if (n >= 40 && n < 50) return "#f07800"
        else if (n >= 30 && n < 40) return "#fb5000"
        else if (n >= 20 && n < 30) return "#ff0000"
        else if (n >= 10 && n < 20) return "#690000"
        else if (n < 10) return "#000000"
    }

    const isReviewOutDated = game => {
        if (getDateFromTimestamp(game.lastPlayed).getFullYear() + 3 < (new Date().getFullYear())) return true

        return false
    }

    const getCardStyle = game => {
        if (!isReviewOutDated(game)) return

        return "linear-gradient(#121224, #121224) padding-box, linear-gradient(to right, yellow, red) border-box"
    }

    //-----------------------------
    // Short click = redirect
    // Long click = fill form
    const mouseDownEvent = () => {
        start = Date.now();
    }

    const mouseUpEvent = game => {
        end = Date.now();
        const diff = (end - start) + 1;

        if (diff > 500) {
            fillParentForm(game)
        } else {
            router.push({
                pathname: `/${game.title}`,
                query: {
                    title: game.title,
                    gameplay: game.gameplay,
                    story: game.story,
                    atmosphere: game.atmosphere,
                    visuals: game.visuals,
                    characters: game.characters,
                    audio: game.audio,
                    replayability: game.replayability,
                    frenchise: game.frenchise,
                    lastPlayed: game.lastPlayed,
                    playtime: game.playtime,
                    playtroughs: game.playtroughs,
                    price: game.price,
                    img: game.img,
                    notes: game.notes,
                    platinum: game.platinum
                }
            })
        }
    }
    //-----------------------------

    const deleteGame = async (game) => {
        if (confirm("Are you sure you want to delete this review?")) {

            try {

                const q = query(collection(db, "games"), where("title", "==", game.title))
                const docs = await getDocs(q);

                var id;
                docs.forEach(doc => {
                    id = doc.id;
                })

                const docRef = doc(db, 'games', id)

                await deleteDoc(docRef);

                router.reload()

            } catch (err) {
                console.log(err)
            }

        } else {
            console.log("Process canceled")
        }
    }

    const toggleListView = e => {
        if (e != null) {
            const buttons = document.getElementsByClassName('view__button')
            const current = document.querySelector(`.${styles.toggled}`)

            if (e.target == current) {
                return;
            }

            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i] == e.target) {
                    e.target.classList.add(`${styles.toggled}`);
                    viewIndex = i;
                    saveObjToSession('viewIndex', viewIndex)
                } else buttons[i].classList.remove(`${styles.toggled}`)
            }
        }

        if (viewIndex == 0) {

            const card = document.getElementsByClassName("card")

            Array.from(card).forEach(e => {
                e.classList.remove(`${card_styles.list__card}`)
            });

        } else if (viewIndex == 1) {

            const card = document.getElementsByClassName("card")

            Array.from(card).forEach(e => {
                e.classList.add(`${card_styles.list__card}`)
            });
        }

    }

    const toggleReButton = e => {
        const buttons = document.getElementsByClassName('order__button')
        const current = document.querySelector(`.${styles.toggled}`)

        if (e.target == current) {
            return;
        }

        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i] == e.target) {
                e.target.classList.add(`${styles.toggled}`);
                orderingIndex = i;
                saveObjToSession('orderingIndex', orderingIndex)
            } else buttons[i].classList.remove(`${styles.toggled}`)
        }

    }

    const sortGamesBy = (sortBy) => {
        const sorted = [...gameList].sort((a, b) => b[sortBy] - a[sortBy])
        orderGames(sorted)
    }

    const getObjFromSession = (objName) => {
        return JSON.parse(sessionStorage.getItem(objName))
    }

    const saveObjToSession = (objName, obj) => {
        sessionStorage.setItem(objName, JSON.stringify(obj))
    }

    useEffect(() => {

        // Loading/saving button states
        const index = getObjFromSession('orderingIndex')
        if (index == null) {
            if (orderingIndex == null) {
                orderingIndex = 0;
                document.querySelector(`.order__button`).classList.add(`${styles.toggled}`)
                saveObjToSession('orderingIndex', orderingIndex)
            } else saveObjToSession('orderingIndex', orderingIndex)
        } else {
            orderingIndex = index

            const buttons = document.getElementsByClassName('order__button')
            buttons[orderingIndex].classList.add(`${styles.toggled}`)
        }

        // Loading/saving button states
        const view = getObjFromSession('viewIndex')
        if (view == null) {
            if (viewIndex == null) {
                viewIndex = 0
                document.querySelector(`.view__button`).classList.add(`${styles.toggled}`)
                saveObjToSession('viewIndex', viewIndex)
            } else saveObjToSession('viewIndex', viewIndex)
        } else {
            viewIndex = view

            const buttons = document.getElementsByClassName('view__button')
            buttons[viewIndex].classList.add(`${styles.toggled}`)
        }

        toggleListView(null)

        // ordering games accourding to loaded ordering
        const orderingKey = orderingIndex;
        const orderings = {
            0: "lastPlayed",
            1: "playtime",
            2: "price",
            // Should be ovr, but it is not saved in db
            3: "gameplay",
            // --------------
            4: "platinum"
        }

        sortGamesBy(orderings[orderingKey])

    }, [])

    return (
        <>

            <div className={styles.re__container}>

                <div>
                    <button className={`order__button ${styles.re__button}`} onClick={(e) => { sortGamesBy("lastPlayed"); toggleReButton(e); }}>Date</button>
                    <button className={`order__button ${styles.re__button}`} onClick={(e) => { sortGamesBy("playtime"); toggleReButton(e); }}>Playtime</button>
                    <button className={`order__button ${styles.re__button}`} onClick={(e) => { sortGamesBy("price"); toggleReButton(e); }}>Price</button>
                    <button className={`order__button ${styles.re__button}`} onClick={(e) => { sortGamesBy("ovr"); toggleReButton(e); }}>Score</button>
                    <button className={`order__button ${styles.re__button}`} onClick={(e) => { sortGamesBy("platinum"); toggleReButton(e); }}>Platinum</button>
                </div>

                <div>
                    <button className={`view__button ${styles.re__button}`} onClick={(e) => toggleListView(e)} title="Toggle list view">▭</button>
                    <button className={`view__button ${styles.re__button}`} onClick={(e) => toggleListView(e)} title="Toggle list view">☰</button>
                </div>
            </div>

            {gameList.map(game => {

                const date = getDateFromTimestamp(game.lastPlayed)
                game.lastPlayed_Date = getFormattedDate(date)
                game.ovr = getOvrRating(game)


                return (

                    <div key={game.title} className={`card ${styles.game__card}`} title={game.notes} style={{ background: getCardStyle(game) }} onMouseDown={mouseDownEvent} onMouseUp={() => mouseUpEvent(game)} >

                        <button className={styles.card_delete} title="Delete game" onClick={() => deleteGame(game)}>x</button>

                        <div className={styles.card__left} style={{ backgroundImage: `url(${game.img})` }} title={game.img}>
                        </div>

                        <h1 className={`${styles.card__title__list} ${game.platinum ? styles.platinum : ""}`}>{game.title}</h1>

                        <div className={styles.card__mid}>

                            <div className={styles.card__mid__content}>

                                <div className={styles.card__mid__content__divider}>

                                    <h1 className={`${styles.card__title} ${game.platinum ? styles.platinum : ""}`}>{game.title}</h1>

                                    <div className={styles.card__ratings}>

                                        <div>
                                            <p>Gameplay</p>
                                            <p style={{ color: getColor(game.gameplay) }}>{game.gameplay}</p>
                                        </div>
                                        <div>
                                            <p>Story</p>
                                            <p style={{ color: getColor(game.story) }}>{game.story}</p>
                                        </div>
                                        <div>
                                            <p>Atmosphere</p>
                                            <p style={{ color: getColor(game.atmosphere) }}>{game.atmosphere}</p>
                                        </div>
                                        <div>
                                            <p>Visuals</p>
                                            <p style={{ color: getColor(game.visuals) }}>{game.visuals}</p>
                                        </div>
                                        <div>
                                            <p>Characters</p>
                                            <p style={{ color: getColor(game.characters) }}>{game.characters}</p>
                                        </div>
                                        <div>
                                            <p>Audio</p>
                                            <p style={{ color: getColor(game.audio) }}>{game.audio}</p>
                                        </div>
                                        <div>
                                            <p>Replayability</p>
                                            <p style={{ color: getColor(game.replayability) }}>{game.replayability}</p>
                                        </div>

                                    </div>

                                </div>

                                <div className={styles.card__ovr}>
                                    <div className={styles.card__ovr__content} style={{ background: getColor(game.ovr) }}>
                                        <p>{game.ovr}</p>
                                    </div>
                                </div>

                            </div>


                            <div className={styles.card__infos}>

                                <div>
                                    <p className={styles.card__info__name}>Last played - </p>
                                    <p>{game.lastPlayed_Date}</p>
                                </div>
                                <div className={styles.card__info__visible}>
                                    <p className={styles.card__info__name}>Playtime - </p>
                                    <p>{game.playtime} h</p>
                                </div>
                                <div>
                                    <p className={styles.card__info__name}>Playthrougs - </p>
                                    <p>{game.playtroughs}</p>
                                </div>
                                <div>
                                    <p className={styles.card__info__name}>Price - </p>
                                    <p>{game.price}$</p>
                                </div>

                            </div>

                        </div>

                    </div>
                )
            })}
        </>
    )
}

export default GameCardComponent;