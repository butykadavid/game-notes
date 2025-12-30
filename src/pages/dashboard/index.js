import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { auth, signInWithGoogle, signOutFunc, db } from "../../../public/firebase";
import { query, getDocs, collection, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getOvrRating, toSearchWordsArray } from "../../../public/functions";

import styles from "../../../styles/dashboard.module.css"
import loaderStyles from "../../../styles/loader.module.css"

import ReviewCard from "../../components/ReviewCardComponent";
import Title from "../../components/TitleComponent";
import FilteredReviewList from "../../components/FilteredReviewListComponent";
import Head from "next/head";

import { IoCalendarClearSharp } from "react-icons/io5";
import { MdVideogameAsset } from "react-icons/md";
import { IoImages } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { MdAudioFile } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { MdRepeatOn } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { MdNotes } from "react-icons/md";

export default function Dashboard({ summaries, createReviewTitle }) {

    const [user, loading] = useAuthState(auth);

    const [items, setItems] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isEditEnabled, toggleEdit] = useState(false)

    const router = useRouter();

    const refreshSite = () => {
        router.reload();
    }

    const _editMode = useRef()
    const _formMode = useRef()

    const _form = useRef()

    const _title = useRef()
    const _gameplay = useRef()
    const _story = useRef()
    const _atmosphere = useRef()
    const _visuals = useRef()
    const _characters = useRef()
    const _audio = useRef()
    const _replayability = useRef()
    const _lastPlayed = useRef()
    const _playtime = useRef()
    const _notes = useRef()
    const _platinum = useRef()

    const uploadNewGame = async () => {

        try {
            var q = query(collection(db, "games"), where("title", "==", _title.current.value), where("userPath", "==", `users/${user.uid}`))
            var docs = await getDocs(q);

            var id;
            docs.forEach(doc => {
                id = doc.id;
            })

            if (docs.docs.length === 0) {

                // Adding new review
                await addDoc(collection(db, "games"), {
                    title: _title.current.value,
                    gameplay: Number(_gameplay.current.value),
                    story: Number(_story.current.value),
                    atmosphere: Number(_atmosphere.current.value),
                    visuals: Number(_visuals.current.value),
                    characters: Number(_characters.current.value),
                    audio: Number(_audio.current.value),
                    replayability: Number(_replayability.current.value),
                    frenchise: null,
                    lastPlayed: new Date(_lastPlayed.current.value).getTime() / 1000,
                    playtime: Number(_playtime.current.value),
                    playtroughs: null,
                    price: null,
                    notes: _notes.current.value,
                    platinum: _platinum.current.checked,
                    userName: user.displayName,
                    userPath: `users/${user.uid}`,
                    created: Math.floor(Date.now() / 1000),
                    updated: Math.floor(Date.now() / 1000)
                });

                // Adjusting summary
                q = query(collection(db, "summaries"), where("title", "==", _title.current.value))
                docs = await getDocs(q)

                const _g = {
                    gameplay: _gameplay.current.value,
                    visuals: _visuals.current.value,
                    atmosphere: _atmosphere.current.value,
                    story: _story.current.value,
                    characters: _characters.current.value,
                    audio: _audio.current.value,
                    replayability: _replayability.current.value
                }

                const ovr = getOvrRating(_g)

                if (docs.docs.length != 0) {

                    const _doc = docs.docs.map(doc => {
                        return { ...doc.data() }
                    })

                    var count = _doc[0].count
                    var avg = _doc[0].average
                    var sum = count * avg

                    count++

                    sum += ovr

                    avg = Math.round(sum / count)

                    id;
                    docs.forEach(doc => {
                        id = doc.id;
                    })

                    const docRef = doc(db, "summaries", id);
                    await updateDoc(docRef, {
                        count: count,
                        average: avg
                    })
                } else {
                    await addDoc(collection(db, "summaries"), {
                        count: 1,
                        average: ovr,
                        title: _title.current.value,
                        frenchise: null,
                        searchArray: toSearchWordsArray(_title.current.value)
                    })
                }
            }
            else {
                // updating existing review
                var docRef = doc(db, "games", id);
                await updateDoc(docRef, {
                    title: _title.current.value,
                    gameplay: Number(_gameplay.current.value),
                    story: Number(_story.current.value),
                    atmosphere: Number(_atmosphere.current.value),
                    visuals: Number(_visuals.current.value),
                    characters: Number(_characters.current.value),
                    audio: Number(_audio.current.value),
                    replayability: Number(_replayability.current.value),
                    lastPlayed: new Date(_lastPlayed.current.value).getTime() / 1000,
                    playtime: Number(_playtime.current.value),
                    notes: _notes.current.value,
                    platinum: _platinum.current.checked,
                    updated: Math.floor(Date.now() / 1000)
                })

                // Get previous ovr
                const prevOvr = getOvrRating(docs.docs[0].data())

                // Adjusting summary
                q = query(collection(db, "summaries"), where("title", "==", _title.current.value))
                docs = await getDocs(q)

                const _g = {
                    gameplay: _gameplay.current.value,
                    visuals: _visuals.current.value,
                    atmosphere: _atmosphere.current.value,
                    story: _story.current.value,
                    characters: _characters.current.value,
                    audio: _audio.current.value,
                    replayability: _replayability.current.value
                }

                const ovr = getOvrRating(_g)

                const _doc = docs.docs.map(doc => {
                    return { ...doc.data() }
                })

                var count = _doc[0].count
                var avg = _doc[0].average
                var sum = count * avg

                sum -= prevOvr
                sum += ovr

                avg = Math.round(sum / count)

                id;
                docs.forEach(doc => {
                    id = doc.id;
                })

                docRef = doc(db, "summaries", id);
                await updateDoc(docRef, {
                    count: count,
                    average: avg
                })

            }

            clearFields()

            refreshSite()
        } catch (err) {
            console.log(err)
        }
    }

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const toggleForm = () => {
        const f = _form.current
        if (f.style.display == "flex") {
            f.style.display = "none"
            _formMode.current.style.background = '#c5c5d5'
            _formMode.current.style.color = '#404080'
        }
        else {
            f.style.display = "flex"
            _formMode.current.style.background = '#121224'
            _formMode.current.style.color = '#00ffc3'
        }
    }

    const fillForm = (game) => {
        if (!isEditEnabled) return

        _title.current.value = game.title;
        _gameplay.current.value = game.gameplay;
        _story.current.value = game.story;
        _atmosphere.current.value = game.atmosphere;
        _visuals.current.value = game.visuals;
        _characters.current.value = game.characters;
        _audio.current.value = game.audio;
        _replayability.current.value = game.replayability;
        _lastPlayed.current.value = formatDate(game.lastPlayed * 1000);
        _playtime.current.value = game.playtime;
        _notes.current.value = game.notes;
        _platinum.current.checked = game.platinum;

        // also opening form
        toggleForm()
        window.scrollTo(0, 0);
    }

    const resetForm = () => {
        _title.current.value = ""
        _gameplay.current.value = ""
        _story.current.value = ""
        _atmosphere.current.value = ""
        _visuals.current.value = ""
        _characters.current.value = ""
        _audio.current.value = ""
        _replayability.current.value = ""
        _lastPlayed.current.value = ""
        _playtime.current.value = ""
        _notes.current.value = ""
        _platinum.current.value = ""
    }

    const toggleEditMode = () => {
        toggleEdit(!isEditEnabled)

        if (isEditEnabled) {
            _editMode.current.style.background = '#c5c5d5'
            _editMode.current.style.color = '#404080'
        }
        else {
            _editMode.current.style.background = '#121224'
            _editMode.current.style.color = '#00ffc3'
        }
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
        _lastPlayed.current.value = null;
        _playtime.current.value = null;
        _notes.current.value = null;
        _platinum.current.checked = false;
    }

    const fetchData = async () => {
        setIsLoading(true)

        try {
            const q = query(collection(db, 'games'), where('userPath', '==', `users/${user.uid}`))
            const docs = await getDocs(q)

            const data = docs.docs.map(d => {
                return { ...d.data() }
            })

            setItems(data)

        } catch (err) {
            console.log(err)
        }

        setIsLoading(false)
    }


    const signOut = () => {
        setIsLoading(true)
        signOutFunc()
        router.push('/')
    }

    useEffect(() => {
        if (user) fetchData()
    }, [user])

    useEffect(() => {
        window.scrollTo(0, 0)
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (!_form.current || !_title.current || createReviewTitle == null) return

        _title.current.value = createReviewTitle

        const f = _form.current
        f.style.display = "flex"
        _formMode.current.style.background = '#121224'
        _formMode.current.style.color = '#00ffc3'
    }, [createReviewTitle, _form.current, _title.current])

    if (loading) {
        return (
            <div className={styles.main__container}>
                <div className={loaderStyles.loading__container}>
                    <h1 className={loaderStyles.loading__title}>Loading</h1>
                    <div className={loaderStyles.loading__circle}></div>
                </div>
            </div>
        )
    }

    return (

        <>
            <Head>
                <title>GameNotes | Dashboard</title>
            </Head>

            <div className={styles.main__container}>


                {user != null ?

                    <>

                        <Title text={`Welcome ${user.displayName}`} />

                        <div className={styles.optionBar__container}>

                            <div>
                                <a ref={_formMode} onClick={() => toggleForm()}>Add game</a>
                                <a ref={_editMode} onClick={() => toggleEditMode()}>Edit mode</a>
                                <a onClick={() => signOut()}>Sign out</a>
                            </div>

                        </div>

                        <div className={styles.form} ref={_form}>
                            <div className={styles.form__content}>
                                <div className={styles.form__section}>
                                    <div className={styles.form__field}>
                                        <label htmlFor="title">
                                            <span>Title</span>
                                        </label>
                                        <input type="text" list="titles" id="title" ref={_title} placeholder="Enter game title" />
                                        <datalist id="titles">
                                            {summaries.map((t, i) => {
                                                return (
                                                    <option key={i} value={t.title}>{t.title}</option>
                                                )
                                            })}
                                        </datalist>
                                    </div>
                                </div>

                                <div className={styles.form__section}>
                                    <h3 className={styles.form__section__title}>Ratings</h3>
                                    <div className={styles.form__grid}>
                                        <div className={styles.form__field}>
                                            <label htmlFor="gameplay">
                                                <MdVideogameAsset />
                                                <span>Gameplay</span>
                                            </label>
                                            <input type="number" id="gameplay" ref={_gameplay} min="0" max="100" placeholder="0-100" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="story">
                                                <MdOutlineHistoryEdu />
                                                <span>Story</span>
                                            </label>
                                            <input type="number" id="story" ref={_story} min="0" max="100" placeholder="0-100" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="atmos">
                                                <IoImages />
                                                <span>Atmosphere</span>
                                            </label>
                                            <input type="number" id="atmos" ref={_atmosphere} min="0" max="100" placeholder="0-100" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="visuals">
                                                <HiSparkles />
                                                <span>Visuals</span>
                                            </label>
                                            <input type="number" id="visuals" ref={_visuals} min="0" max="100" placeholder="0-100" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="chars">
                                                <FaUsers />
                                                <span>Characters</span>
                                            </label>
                                            <input type="number" id="chars" ref={_characters} min="0" max="100" placeholder="0-100" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="audio">
                                                <MdAudioFile />
                                                <span>Audio</span>
                                            </label>
                                            <input type="number" id="audio" ref={_audio} min="0" max="100" placeholder="0-100" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="replay">
                                                <MdRepeatOn />
                                                <span>Replayability</span>
                                            </label>
                                            <input type="number" id="replay" ref={_replayability} min="0" max="100" placeholder="0-100" />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.form__section}>
                                    <h3 className={styles.form__section__title}>Details</h3>
                                    <div className={styles.form__row}>
                                        <div className={styles.form__field}>
                                            <label htmlFor="lastPlayed">
                                                <IoCalendarClearSharp />
                                                <span>Last Played</span>
                                            </label>
                                            <input type="date" id="lastPlayed" ref={_lastPlayed} />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="playtime">
                                                <MdAccessTime />
                                                <span>Playtime (hours)</span>
                                            </label>
                                            <input type="number" id="playtime" ref={_playtime} min="0" placeholder="0" />
                                        </div>

                                        <div className={styles.form__field}>
                                            <label htmlFor="platinum" className={styles.checkbox__label}>
                                                <FaTrophy />
                                                <span>Platinum</span>
                                                <input type="checkbox" id="platinum" ref={_platinum} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.form__section}>
                                    <div className={styles.form__field}>
                                        <label htmlFor="note">
                                            <MdNotes />
                                            <span>Notes</span>
                                        </label>
                                        <textarea id="note" rows="4" ref={_notes} placeholder="Add your notes here..."></textarea>
                                    </div>
                                </div>

                                <div className={styles.form__button__container}>
                                    <button className={styles.form__button__reset} onClick={() => resetForm()}>Reset</button>
                                    <button className={styles.form__button__submit} onClick={() => uploadNewGame()}>Add Game</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.gameCard__container}>

                            {isLoading ?
                                <div className={loaderStyles.loading__container}>
                                    <h1 className={loaderStyles.loading__title}>Loading</h1>
                                    <div className={loaderStyles.loading__circle}></div>
                                </div>
                                :
                                <FilteredReviewList
                                    reviews={items}
                                    reviewCardProps={{
                                        hasLabel: false,
                                        hasTitle: true,
                                        deleteButton: isEditEnabled,
                                        fillParentForm: fillForm
                                    }}
                                    keyGenerator={(review) => `${review.created} - ${review.title}`}
                                />
                            }

                        </div>

                    </>

                    :

                    <div className={styles.login__container}>

                        <h1>403 - no permission</h1>
                        <p>You are not logged in!</p>
                        <a className={styles.login} onClick={signInWithGoogle}>Log in</a>

                    </div>

                }

            </div>
        </>
    )
}

export const getServerSideProps = async (context) => {

    const createReviewTitle = context.query.createReviewTitle

    const q = query(collection(db, 'summaries'))
    const docs = await getDocs(q)

    const summaries = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    return {
        props: {
            summaries,
            createReviewTitle: createReviewTitle || null
        }
    }
}