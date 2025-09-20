import { db } from "../public/firebase"
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore"
import { getColor } from "../public/functions"
import { useRouter } from "next/router"
import { redirectToPage } from "../public/functions"

import Head from "next/head"
import styles from "../styles/homepage/index.module.css"

import MainPageReview from "../components/MainPageReviewComponent"
import MainPageUser from "../components/MainPageUserComponent"
import GamesComponent from "../components/GamesComponent"
import SubscribtionSectionCompnent from "../components/SubscriptionSectionComponent"
import Title from "../components/TitleComponent"
import NewsFeedComponent from "../components/NewsFeedComponent"

export default function Index({ recentGames, bestOvrGames, newestProfiles, posts }) {

    const router = useRouter()

    var i = 0

    return (
        <>
            <Head>
                <title>GameNotes | HOME</title>
                <meta name="description" content="Top game ratings and reviews" />
                <meta name="keywords" content={`GameNotes, Result, Game, Games, Review, Videogame, Home, Rating`} />
            </Head>

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

                <Title text={"Gamenotes newsfeed"} />
                <NewsFeedComponent posts={posts} />

                <Title text={"Gaming deals"} />
                <SubscribtionSectionCompnent category={"recent"} sectionTitle={"GamePass Recent"} />
                <SubscribtionSectionCompnent category={"popular"} sectionTitle={"GamePass Popular"} />
                <SubscribtionSectionCompnent category={"eaplay"} sectionTitle={"GamePass Eaplay All"} />
                <SubscribtionSectionCompnent category={"uplay"} sectionTitle={"GamePass Ubi+ All"} />

                <GamesComponent />

            </div>
        </>

    )
}

export const getServerSideProps = async () => {

    // get data from db
    // recent reviews
    var q = query(collection(db, "games"), orderBy('updated', 'desc'), limit(5))
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

    // posts
    q = query(collection(db, "posts"), orderBy('createdAt', 'desc'), limit(5))
    docs = await getDocs(q)

    const posts = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    return {
        props: {
            recentGames,
            bestOvrGames,
            newestProfiles,
            posts
        }
    }
}