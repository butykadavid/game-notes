import { db } from "../public/firebase"
import { collection, query, orderBy, getDocs, limit} from "firebase/firestore"
import { getColor} from "../public/functions"
import { useRouter } from "next/router"
import { redirectToPage } from "../public/functions"

import styles from "../styles/homepage/index.module.css"

import MainPageReview from "../components/MainPageReviewComponent"
import MainPageUser from "../components/MainPageUserComponent"
import GamesComponent from "../components/GamesComponent"

export default function Index({ recentGames, bestOvrGames, newestProfiles }) {

    const router = useRouter()

    var i = 0

    return (
        <>
            <div className={styles.main__container}>

                <div className={styles.content__container}>

                    <div className={`${styles.box} ${styles.recentGames__box}`}>

                        <div className={styles.box__title__container}>
                            <h1 className={styles.box__title}>Recent reviews</h1>
                        </div>

                        <div className={styles.box__content}>
                            {
                                recentGames.map(game => {
                                    return (
                                        <MainPageReview key={`${game.userName}-${game.title}-${game.created}`} game={game} displayNamer={game.userName} />
                                    )
                                })
                            }
                        </div>

                    </div>

                    <div className={styles.best__wrapper}>

                        {
                            bestOvrGames.map(bg => {
                                i++
                                return (
                                    <div className={`${styles.box} ${styles.bestGames__box}`} key={`bg-${i}`} onClick={() => redirectToPage(router, `/games/${bg.title}`, { title: `${bg.title}` })}>
                                        <div className={styles.box__title__container}>
                                            <h1 className={styles.box__title}>Overall no.{i}</h1>
                                        </div>
                                        <div className={styles.box__content}>
                                            <h1>{bg.title}</h1>
                                            <p>Score: <span style={{ color: `${getColor(bg.average)}` }}>{bg.average}</span></p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>

                    <div className={`${styles.box} ${styles.recentUsers__box}`}>
                        <div className={styles.box__title__container}>
                            <h1 className={styles.box__title}>Newest users</h1>
                        </div>

                        <div className={styles.box__content}>
                            {
                                newestProfiles.map(user => {
                                    return (
                                        <MainPageUser key={user.uid} user={user} />
                                    )
                                })
                            }
                        </div>
                    </div>

                </div>

                <GamesComponent />

            </div>
        </>

    )
}

export const getServerSideProps = async () => {

    // get data from db
    // recent reviews
    var q = query(collection(db, "games"), orderBy('created', 'desc'), limit(5))
    var docs = await getDocs(q)

    const recentGames = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    // best rated 4
    q = query(collection(db, 'summaries'), orderBy('average', 'desc'), limit(4))
    docs = await getDocs(q)

    const bestOvrGames = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    // profiles
    q = query(collection(db, "users"), limit(10))
    docs = await getDocs(q)

    const newestProfiles = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    return {
        props: {
            recentGames,
            bestOvrGames,
            newestProfiles
        }
    }
}