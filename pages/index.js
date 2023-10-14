import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, signOutFunc, db } from "../public/firebase";
import { query, getDocs, collection, where, addDoc, updateDoc, doc, orderBy } from 'firebase/firestore';

import GameCardComponent from "../components/GameCardComponent"

import styles from "../styles/index.module.css"
import { useRef } from "react";

export default function Index({ games }) {

    const router = useRouter();

    const refreshSite = () => {
        router.reload();
    }

    const [user] = useAuthState(auth);

    const _form = useRef()

    const _title = useRef()
    const _gameplay = useRef()
    const _story = useRef()
    const _atmosphere = useRef()
    const _visuals = useRef()
    const _characters = useRef()
    const _audio = useRef()
    const _replayability = useRef()
    const _frenchise = useRef()
    const _lastPlayed = useRef()
    const _playtime = useRef()
    const _playtroughs = useRef()
    const _price = useRef()
    const _img = useRef()
    const _notes = useRef()

    const uploadNewGame = async () => {

        try {
            const q = query(collection(db, "games"), where("title", "==", _title.current.value))
            const docs = await getDocs(q);

            var id;
            docs.forEach(doc => {
                id = doc.id;
            })

            if (docs.docs.length === 0) {
                await addDoc(collection(db, "games"), {
                    title: _title.current.value,
                    gameplay: Number(_gameplay.current.value),
                    story: Number(_story.current.value),
                    atmosphere: Number(_atmosphere.current.value),
                    visuals: Number(_visuals.current.value),
                    characters: Number(_characters.current.value),
                    audio: Number(_audio.current.value),
                    replayability: Number(_replayability.current.value),
                    frenchise: _frenchise.current.value,
                    lastPlayed: new Date(_lastPlayed.current.value).getTime() / 1000,
                    playtime: Number(_playtime.current.value),
                    playtroughs: Number(_playtroughs.current.value),
                    price: Number(_price.current.value),
                    img: _img.current.value,
                    notes: _notes.current.value
                });
            }
            else {
                const docRef = doc(db, "games", id);
                await updateDoc(docRef, {
                    title: _title.current.value,
                    gameplay: Number(_gameplay.current.value),
                    story: Number(_story.current.value),
                    atmosphere: Number(_atmosphere.current.value),
                    visuals: Number(_visuals.current.value),
                    characters: Number(_characters.current.value),
                    audio: Number(_audio.current.value),
                    replayability: Number(_replayability.current.value),
                    frenchise: _frenchise.current.value,
                    lastPlayed: new Date(_lastPlayed.current.value).getTime() / 1000,
                    playtime: Number(_playtime.current.value),
                    playtroughs: Number(_playtroughs.current.value),
                    price: Number(_price.current.value),
                    img: _img.current.value,
                    notes: _notes.current.value
                })
            }

        } catch (err) {
            console.log(err);
        }

        clearFields();

        refreshSite();

    }

    const toggleForm = () => {
        const f = _form.current
        if (f.style.display == "flex") f.style.display = "none"
        else f.style.display = "flex"
    }

    const clearFields = () => {
        _title.current.value = null;
        _gameplay.current.value = null;
        _story.current.value = null;
        _atmosphere.current.value = null;
        _visuals.current.value = null;
        _characters.current.value = null;
        _audio.current.value = null;
        _replayability.current.value = null;
        _frenchise.current.value = null;
        _lastPlayed.current.value = null;
        _playtime.current.value = null;
        _playtroughs.current.value = null;
        _price.current.value = null;
        _img.current.value = null;
        _notes.current.value = null;
    }

    return (

        <>
            {/* Hacking global css, coz I can't get it to work -_(°-°)_- */}
            <style jsx global>{`
                *{
                    font-family: 'Montserrat', sans-serif;
                    text-transform: uppercase;

                    cursor: default;
                }

                html,
                body {
                  background: #121224;
                  overflow-x: hidden;
                  padding: 0;
                  margin: 0;
                  font-family: Roboto, sans-serif;
                }
                
                body::-webkit-scrollbar{
                  display: none;
                }
            `}</style>

            {user != null ?

                <>
                    {user.uid == 'NupJEpLKYQXDBGrsq3B7ehyz8x42' ?

                        <div className={styles.main__container}>

                            <div className={styles.welcome__container}>

                                <h1><span className={styles.welcome__text}>Welcome</span> {user.displayName}</h1>

                                <div>
                                    <a className={styles.toggleButton} onClick={toggleForm}>Toggle form</a>
                                    <a className={styles.logout} onClick={signOutFunc}>Log out</a>
                                </div>

                            </div>

                            <div className={styles.form} ref={_form}>

                                <div className={styles.form__horizontal}>
                                    <div className={styles.form__left}>
                                        <div className={styles.form__left__left}>
                                            <div>
                                                <label for="title">Title</label>
                                                <input type="text" id="title" ref={_title}></input>
                                            </div>

                                            <div>
                                                <label for="gameplay">Gameplay</label>
                                                <input type="number" id="gameplay" ref={_gameplay}></input>
                                            </div>

                                            <div>
                                                <label for="story">Story</label>
                                                <input type="number" id="story" ref={_story}></input>
                                            </div>

                                            <div>
                                                <label for="atmos">Atmosphere</label>
                                                <input type="number" id="atmos" ref={_atmosphere}></input>
                                            </div>
                                        </div>
                                        <div className={styles.form__left__right}>
                                            <div>
                                                <label for="visuals">Visuals</label>
                                                <input type="number" id="visuals" ref={_visuals}></input>
                                            </div>

                                            <div>
                                                <label for="chars">Characters</label>
                                                <input type="number" id="chars" ref={_characters}></input>
                                            </div>

                                            <div>
                                                <label for="audio">Audio</label>
                                                <input type="number" id="audio" ref={_audio}></input>
                                            </div>

                                            <div>
                                                <label for="replay">Replayability</label>
                                                <input type="number" id="replay" ref={_replayability}></input>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.form__right}>

                                        <div className={styles.form__right__group}>
                                            <div className={styles.form__right__left}>
                                                <div>
                                                    <label for="french">Frenchise</label>
                                                    <input type="text" id="french" ref={_frenchise}></input>
                                                </div>

                                                <div>
                                                    <label for="lastPlayed">Last played at</label>
                                                    <input type="date" id="lastPlayed" ref={_lastPlayed}></input>
                                                </div>

                                                <div>
                                                    <label for="playtime">Playtime</label>
                                                    <input type="number" id="playtime" ref={_playtime}></input>
                                                </div>
                                            </div>


                                            <div className={styles.form__right__right}>
                                                <div>
                                                    <label for="playtroughs">Playtroughs</label>
                                                    <input type="number" id="playtroughs" ref={_playtroughs}></input>
                                                </div>
                                                <div>
                                                    <label for="price">Price</label>
                                                    <input type="number" id="price" ref={_price}></input>
                                                </div>
                                                <div>
                                                    <label for="img">Image link</label>
                                                    <input type="url" id="img" ref={_img}></input>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.form__notes}>
                                            <label for="note">Note</label>
                                            <textarea id="note" rows="3" ref={_notes}></textarea>
                                        </div>

                                    </div>
                                </div>

                                <div className={styles.loginWrapper}><a className={styles.login} onClick={uploadNewGame}>Add</a></div>

                            </div>

                            <div className={styles.gameCard__container}>

                                <GameCardComponent games={games} />

                            </div>

                        </div>

                        :

                        <div className={styles.main__container}>
                            <h1>403 - NO PERMISSION</h1>
                            <a className={styles.logout} onClick={signOutFunc}>Log out</a>
                        </div>
                    }
                </>

                :

                <div className={styles.login__container}>

                    <div className={styles.loginWrapper}>

                        <a className={styles.login} onClick={signInWithGoogle}>Log in</a>

                    </div>

                </div>

            }
        </>
    )
}

export const getStaticProps = async () => {

    // get data from db
    const q = query(collection(db, "games"), orderBy('lastPlayed', 'desc'))
    const docs = await getDocs(q)

    const games = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    return {
        props: {
            games: games
        }
    }
}