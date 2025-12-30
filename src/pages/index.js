import { getColor } from "../../public/functions"
import { useRouter } from "next/router"
import { redirectToPage } from "../../public/functions"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../public/firebase'
import { useState } from "react"
import {
    fetchRecentGames,
    fetchBestOverallGames,
    fetchNewestProfiles,
    fetchRecentPosts,
    createPost,
} from "../lib/firestore"

import Head from "next/head"
import styles from "../../styles/homepage/index.module.css"

import MainPageReview from "../components/MainPageReviewComponent"
import MainPageUser from "../components/MainPageUserComponent"
import GamesComponent from "../components/GamesComponent"
import SubscribtionSectionCompnent from "../components/SubscriptionSectionComponent"
import Title from "../components/TitleComponent"
import NewsFeedComponent from "../components/NewsFeedComponent"
import Modal from "../components/Modal"

export default function Index({ recentGames, bestOvrGames, newestProfiles, posts }) {

    const router = useRouter()
    const [user, loading] = useAuthState(auth)

    const [isModalVisible, setModalVisible] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalText, setModalText] = useState("")

    const submitPost = async () => {
        try {
            await createPost({
                title: modalTitle,
                text: modalText,
                userId: user.uid,
            })
            setModalVisible(false)
        } catch (err) {
            console.error(err)
        }
    }

    var i = 0

    return (
        <>
            <Modal
                visible={isModalVisible}
                setVisible={setModalVisible}
                title="Create new post"
            >
                <div className={styles.modal__container}>
                    <div className={styles.modal__content}>
                        <div className={styles.modal__field}>
                            <p className={styles.modal__label}>Title</p>
                            <input
                                className={styles.modal__input}
                                onChange={(e) => setModalTitle(e.target.value)}
                            />
                        </div>
                        <div className={styles.modal__field}>
                            <p className={styles.modal__label}>Text</p>
                            <textarea
                                className={styles.modal__textarea}
                                rows={10}
                                onChange={(e) => setModalText(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className={styles.modal__footer}>
                        <a className={styles.modal__submit} onClick={() => submitPost()}>
                            Submit
                        </a>
                    </div>
                </div>
            </Modal>

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


                <Title text={"News & announcements"}>
                    {user != null && <>
                        {(!loading && user.uid == process.env.ADMIN) &&
                            <a className={styles.add__news} title={"Create new post"} onClick={() => setModalVisible(true)}>+</a>
                        }
                    </>
                    }
                </Title>
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

    const [recentGames, bestOvrGames, newestProfiles, posts] = await Promise.all([
        fetchRecentGames(5),
        fetchBestOverallGames(4),
        fetchNewestProfiles(10),
        fetchRecentPosts(5),
    ])

    return {
        props: {
            recentGames,
            bestOvrGames,
            newestProfiles,
            posts
        }
    }
}