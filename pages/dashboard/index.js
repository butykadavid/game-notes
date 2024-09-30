import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRef, useState, useEffect } from "react";
import { auth, signInWithGoogle, signOutFunc, db } from "../../public/firebase";
import { query, getDocs, collection, where, addDoc, updateDoc, doc } from 'firebase/firestore';

import styles from "../../styles/dashboard.module.css"
import loaderStyles from "../../styles/loader.module.css"

import ReviewCard from "../../components/ReviewCardComponent";
import Title from "../../components/TitleComponent";
import { getOvrRating, toSearchWordsArray } from "../../public/functions";

export default function Dashboard() {

    const [user, loading] = useAuthState(auth);

    const [items, setItems] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    const [isEditEnabled, toggleEdit] = useState(false)

    const [ordering, setOrdering] = useState('none')
    const [direction, setDirection] = useState('DESC')

    const router = useRouter();

    const refreshSite = () => {
        router.reload();
    }

    const _editMode = useRef()
    const _formMode = useRef()

    const _orderingContainer = useRef()
    const _directionContainer = useRef()

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
                    frenchise: _frenchise.current.value,
                    lastPlayed: new Date(_lastPlayed.current.value).getTime() / 1000,
                    playtime: Number(_playtime.current.value),
                    playtroughs: Number(_playtroughs.current.value),
                    price: Number(_price.current.value),
                    img: _img.current.value,
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
                        frenchise: _frenchise.current.value,
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
                    frenchise: _frenchise.current.value,
                    lastPlayed: new Date(_lastPlayed.current.value).getTime() / 1000,
                    playtime: Number(_playtime.current.value),
                    playtroughs: Number(_playtroughs.current.value),
                    price: Number(_price.current.value),
                    img: _img.current.value,
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
        _frenchise.current.value = game.frenchise;
        _lastPlayed.current.value = formatDate(game.lastPlayed * 1000);
        _playtime.current.value = game.playtime;
        _playtroughs.current.value = game.playtroughs;
        _price.current.value = game.price;
        _img.current.value = game.img;
        _notes.current.value = game.notes;
        _platinum.current.checked = game.platinum;

        // also opening form
        toggleForm()
        window.scrollTo(0, 0);
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
        _frenchise.current.value = null;
        _lastPlayed.current.value = null;
        _playtime.current.value = null;
        _playtroughs.current.value = null;
        _price.current.value = null;
        _img.current.value = null;
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

    const toggleOrdering = (event, category) => {
        Array.from(_orderingContainer.current.children).forEach(e => {
            if (e == event.target && e.classList.contains(styles.toggled)) {
                e.classList.remove(styles.toggled)
                setOrdering('none')
            }
            else if (e == event.target && !e.classList.contains(styles.toggled)) {
                e.classList.add(styles.toggled)
                setOrdering(category)
            }
            else if (!e == event.target) e.classList.remove(styles.toggled)
        })
    }

    const toggleDirection = (event) => {
        Array.from(_directionContainer.current.children).forEach(e => {
            if (e == event.target && !e.classList.contains(styles.toggled)) {
                e.classList.add(styles.toggled)
                setDirection(event.target.innerHTML)
            }
            else if (e == event.target && e.classList.contains(styles.toggled)) return
            else if (!e == event.target) e.classList.remove(styles.toggled)
        })
    }

    const activateOrdering = () => {
        if (direction === 'ASC') {
            if (ordering === "overall") setItems([...items].sort((a, b) => getOvrRating(a) - getOvrRating(b)))
            else if (ordering === "none") setItems([...items].sort((a, b) => b["title"] - a["title"]))
            else setItems([...items].sort((a, b) => a[ordering] - b[ordering]))
        }
        else {
            if (ordering === "overall") setItems([...items].sort((a, b) => getOvrRating(b) - getOvrRating(a)))
            else if (ordering === "none") setItems([...items].sort((a, b) => a["title"] - b["title"]))
            else setItems([...items].sort((a, b) => b[ordering] - a[ordering]))
        }
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
    }, [items])

    useEffect(() => {
        activateOrdering()
    }, [ordering, direction])

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
            <div className={styles.main__container} >


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

                            <div className={styles.form__horizontal}>
                                <div className={styles.form__left}>
                                    <div className={styles.form__left__left}>
                                        <div>
                                            <label htmlFor="title">Title</label>
                                            <input type="text" id="title" ref={_title}></input>
                                        </div>

                                        <div>
                                            <label htmlFor="gameplay">Gameplay</label>
                                            <input type="number" id="gameplay" ref={_gameplay}></input>
                                        </div>

                                        <div>
                                            <label htmlFor="story">Story</label>
                                            <input type="number" id="story" ref={_story}></input>
                                        </div>

                                        <div>
                                            <label htmlFor="atmos">Atmosphere</label>
                                            <input type="number" id="atmos" ref={_atmosphere}></input>
                                        </div>
                                        <div className={styles.checkbox_div}>
                                            <label htmlFor="platinum">Platinum</label>
                                            <input type="checkbox" id="platinum" ref={_platinum}></input>
                                        </div>
                                    </div>
                                    <div className={styles.form__left__right}>
                                        <div>
                                            <label htmlFor="visuals">Visuals</label>
                                            <input type="number" id="visuals" ref={_visuals}></input>
                                        </div>

                                        <div>
                                            <label htmlFor="chars">Characters</label>
                                            <input type="number" id="chars" ref={_characters}></input>
                                        </div>

                                        <div>
                                            <label htmlFor="audio">Audio</label>
                                            <input type="number" id="audio" ref={_audio}></input>
                                        </div>

                                        <div>
                                            <label htmlFor="replay">Replayability</label>
                                            <input type="number" id="replay" ref={_replayability}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.form__right}>

                                    <div className={styles.form__right__group}>
                                        <div className={styles.form__right__left}>
                                            <div>
                                                <label htmlFor="french">Frenchise</label>
                                                <input type="text" id="french" ref={_frenchise}></input>
                                            </div>

                                            <div>
                                                <label htmlFor="lastPlayed">Last played at</label>
                                                <input type="date" id="lastPlayed" ref={_lastPlayed}></input>
                                            </div>

                                            <div>
                                                <label htmlFor="playtime">Playtime</label>
                                                <input type="number" id="playtime" ref={_playtime}></input>
                                            </div>
                                        </div>


                                        <div className={styles.form__right__right}>
                                            <div>
                                                <label htmlFor="playtroughs">Playtroughs</label>
                                                <input type="number" id="playtroughs" ref={_playtroughs}></input>
                                            </div>
                                            <div>
                                                <label htmlFor="price">Price</label>
                                                <input type="number" id="price" ref={_price}></input>
                                            </div>
                                            <div>
                                                <label htmlFor="img">Image link</label>
                                                <input type="url" id="img" ref={_img}></input>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.form__notes}>
                                        <label htmlFor="note">Note</label>
                                        <textarea id="note" rows="3" ref={_notes}></textarea>
                                    </div>

                                </div>
                            </div>

                            <div className={styles.loginWrapper}><a className={styles.login} onClick={() => uploadNewGame()}>Add</a></div>

                        </div>

                        <div className={styles.filterBar__container}>

                            <div className={styles.ordering}>
                                <p>Category</p>
                                <div ref={_orderingContainer}>
                                    <a onClick={(e) => toggleOrdering(e, "overall")}>Ovr</a>
                                    <a onClick={(e) => toggleOrdering(e, "gameplay")}>Gmp</a>
                                    <a onClick={(e) => toggleOrdering(e, "atmosphere")}>Atm</a>
                                    <a onClick={(e) => toggleOrdering(e, "visuals")}>Vis</a>
                                    <a onClick={(e) => toggleOrdering(e, "story")}>Sto</a>
                                    <a onClick={(e) => toggleOrdering(e, "characters")}>Cha</a>
                                    <a onClick={(e) => toggleOrdering(e, "audio")}>Aud</a>
                                    <a onClick={(e) => toggleOrdering(e, "replayability")}>Rpl</a>
                                    <a onClick={(e) => toggleOrdering(e, "platinum")}>Plat</a>
                                </div>
                            </div>
                            <div className={styles.direction}>
                                <p>Direction</p>
                                <div ref={_directionContainer}>
                                    <a className={styles.toggled} onClick={(e) => toggleDirection(e)}>DESC</a>
                                    <a onClick={(e) => toggleDirection(e)}>ASC</a>
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
                                <>
                                    {
                                        items.map(g => {
                                            return (
                                                <ReviewCard review={g} hasLabel={false} hasTitle={true} deleteButton={isEditEnabled} fillParentForm={fillForm} key={`${g.created} - ${g.title}`} />
                                            )
                                        })
                                    }
                                </>
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