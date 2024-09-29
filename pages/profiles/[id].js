import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../../public/firebase"
import { getOvrRating } from "../../public/functions"
import { useRef, useState, useEffect } from "react";

import styles from '../../styles/profilepage/profilePage.module.css'
import ProfileInfo from "../../components/ProfileInfoComponent"
import ReviewCard from "../../components/ReviewCardComponent"

export default function ProfilePage({ reviews, user }) {

    const [items, setItems] = useState([...reviews].sort((a,b) => getOvrRating(b) - getOvrRating(a)))

    const [ordering, setOrdering] = useState('none')
    const [direction, setDirection] = useState('DESC')

    const _orderingContainer = useRef()
    const _directionContainer = useRef()

    const playtime = Math.round(reviews.reduce((a, c) => a + c.playtime, 0))
    const platinums = reviews.reduce((a, c) => c.platinum ? a + 1 : a, 0)
    const avgRating = Math.round(reviews.reduce((a, c) => a + getOvrRating(c), 0) / reviews.length)
    const bestRatedGame = reviews.sort((a, b) => getOvrRating(b) - getOvrRating(a))[0]

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

    useEffect(() => {
    }, [items])

    useEffect(() => {
        activateOrdering()
    }, [ordering, direction])

    return (
        <div className={styles.main__container}>
            <div className={styles.splitter}>
                <div className={styles.profile__card__side}>
                    <ProfileInfo user={user} reviewCount={reviews.length} playtime={playtime} platinums={platinums} avgRating={avgRating} bestRatedGame={bestRatedGame} />
                </div>
                <div className={styles.reviews__side}>
                    <h2 className={styles.reviews__title}>{user.name}'s reviews</h2>

                    <div className={styles.filterBar__container}>

                        <div className={styles.ordering}>
                            <p>Category</p>
                            <div ref={_orderingContainer}>
                                <a className={styles.toggled} onClick={(e) => toggleOrdering(e, "overall")}>Ovr</a>
                                <a onClick={(e) => toggleOrdering(e, "gameplay")}>Gmp</a>
                                <a onClick={(e) => toggleOrdering(e, "atmosphere")}>Atm</a>
                                <a onClick={(e) => toggleOrdering(e, "visuals")}>Vis</a>
                                <a onClick={(e) => toggleOrdering(e, "story")}>Sto</a>
                                <a onClick={(e) => toggleOrdering(e, "characters")}>Cha</a>
                                <a onClick={(e) => toggleOrdering(e, "audio")}>Aud</a>
                                <a onClick={(e) => toggleOrdering(e, "replayability")}>Rpl</a>
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

                    {items.length != 0 ? <>
                        {
                            items.map((r, index) => {
                                return (
                                    <ReviewCard review={r} key={`${r.created} - ${r.title}`} hasLabel={false} hasTitle={true} deleteButton={false} />
                                )
                            })
                        } </>
                        :
                        <h1 className={styles.no__review__message}>No reviews available</h1>
                    }
                    <div className={styles.bottom__dummy}><p>Yo!<br />Easter Egg!</p></div>
                </div>
            </div>
        </div>

    )
}

export const getServerSideProps = async (context) => {

    var user = {}

    if (context.query.createdAt == null) {
        const q = query(collection(db, 'users'), where('uid', '==', context.query.uid))
        const docs = await getDocs(q)

        user = docs.docs[0].data()
    } else {
        user = {
            uid: context.query.uid,
            createdAt: context.query.createdAt,
            image: context.query.image,
            name: context.query.name
        }
    }

    const q = query(collection(db, 'games'), where('userPath', '==', `users/${user.uid}`))
    const docs = await getDocs(q)

    const reviews = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    return {
        props: {
            reviews,
            user
        }
    }
}