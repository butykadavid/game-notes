import { useRouter } from 'next/router'
import { getColor, getOvrRating } from '../public/functions'
import { redirectToPage } from '../public/functions'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../public/firebase";

import styles from '../styles/gamepage/reviewCard.module.css'
import { collection, deleteDoc, query, doc, getDocs, where, updateDoc } from 'firebase/firestore'
import { db } from '../public/firebase'

export default function ReviewCard({ review, hasLabel, hasTitle, deleteButton, fillParentForm }) {

    const router = useRouter()
    const [user, loading] = useAuthState(auth);

    const getRatings = () => {
        return {
            gameplay: review.gameplay,
            visuals: review.visuals,
            characters: review.characters,
            story: review.story,
            audio: review.audio,
            atmosphere: review.atmosphere,
            replayability: review.replayability,
        }
    }

    const deleteGame = async (game) => {
        if (confirm("Are you sure you want to delete this review?")) {

            try {

                // Delete game
                var q = query(collection(db, "games"), where("title", "==", game.title), where("userPath", "==", `users/${user.uid}`))
                var docs = await getDocs(q);

                var id;
                docs.forEach(doc => {
                    id = doc.id;
                })

                var docRef = doc(db, 'games', id)

                await deleteDoc(docRef);

                // Adjust summary
                q = query(collection(db, "summaries"), where("title", "==", game.title))
                docs = await getDocs(q)

                const _doc = docs.docs.map(doc => {
                    return { ...doc.data() }
                })

                var count = _doc[0].count
                var avg = _doc[0].average
                var sum = count * avg

                count -= 1
                sum -= getOvrRating(game)

                id;
                docs.forEach(doc => {
                    id = doc.id;
                })

                if (count > 0) {
                    avg = Math.round(sum / count)

                    docRef = doc(db, "summaries", id);
                    await updateDoc(docRef, {
                        count: count,
                        average: avg
                    })
                } else {
                    docRef = doc(db, "summaries", id);
                    await deleteDoc(docRef)
                }

                window.scrollTo(0, 0)
                router.reload()

            } catch (err) {
                console.log(err)
            }

        } else {
            console.log("Process canceled")
        }
    }

    const ratings = getRatings()
    const ovr = getOvrRating(review)

    return (
        <div className={styles.wrapper}>
            {hasTitle ?
                <h3 className={styles.card__title}>
                    {review.title}
                </h3>
                :
                <></>
            }
            <div className={styles.card} onClick={hasTitle ? deleteButton ? null : () => redirectToPage(router, `/games/${review.title}`, { title: `${review.title}` }) : null}>

                {deleteButton ?
                    <div className={styles.delete}>
                        <a onClick={(e) => fillParentForm(review)} title='Edit review'>✎</a>
                        <a onClick={() => deleteGame(review)} title='Delete game'>×</a>
                    </div>
                    : <></>
                }

                <div className={styles.card__img} style={{
                    background: `url(${review.img})`,
                    backgroundPosition: `center`,
                    backgroundSize: `cover`,
                    backgroundRepeat: `no-repeat`
                }}></div>

                {hasLabel ?
                    <div className={styles.card__user} onClick={() => redirectToPage(router, `/profiles/${review.userPath.split('/')[1]}`, { uid: `${review.userPath.split('/')[1]}` })}>
                        <p><span>Author: </span>{review.userName}</p>
                    </div>
                    : <></>
                }

                <div className={styles.card__mid}>

                    <div className={styles.card__desc}>
                        <p>{review.notes}</p>
                    </div>

                    <div className={styles.card__ratings}>
                        {
                            Object.keys(ratings).map(prop => {

                                const name = prop.slice(0, 3)
                                const val = ratings[prop]
                                const color = getColor(val)

                                return (
                                    <div key={`${name} - ${val}`} className={styles.rating}>
                                        <p style={{ color: `${color}` }}>{val}</p>
                                        <p>{name}</p>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

                <div className={styles.card__ovr}>
                    <div style={{ background: `${getColor(ovr)}` }}>
                        <h1>{ovr}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}