import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../../public/firebase"
import { getOvrRating } from "../../public/functions"
import { useState, useEffect } from "react"

import ProfileInfo from "../../components/ProfileInfoComponent"
import ReviewCard from "../../components/ReviewCardComponent"
import ReviewFilterComponent from "../../components/ReviewFilterComponent"

import styles from '../../styles/profilepage/profilePage.module.css'

export default function ProfilePage({ reviews, user }) {

    const [items, setItems] = useState([...reviews].sort((a,b) => getOvrRating(b) - getOvrRating(a)))

    const playtime = Math.round(reviews.reduce((a, c) => a + c.playtime, 0))
    const platinums = reviews.reduce((a, c) => c.platinum ? a + 1 : a, 0)
    const avgRating = Math.round(reviews.reduce((a, c) => a + getOvrRating(c), 0) / reviews.length)
    const bestRatedGame = reviews.sort((a, b) => getOvrRating(b) - getOvrRating(a))[0]

    useEffect(() => {
    }, [items])

    return (
        <div className={styles.main__container}>
            <div className={styles.splitter}>
                <div className={styles.profile__card__side}>
                    <ProfileInfo user={user} reviewCount={reviews.length} playtime={playtime} platinums={platinums} avgRating={avgRating} bestRatedGame={bestRatedGame} />
                </div>
                <div className={styles.reviews__side}>
                    <h2 className={styles.reviews__title}>{user.name}'s reviews</h2>

                    <ReviewFilterComponent reviews={items} setReviews={setItems} />

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