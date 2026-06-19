import Link from "next/link"
import { useRouter } from "next/router"
import { redirectToPage } from "../lib/functions"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../public/firebase'
import { useState } from "react"
import {
    fetchRecentGames,
    fetchBestOverallGames,
    fetchNewestProfiles,
    fetchRecentPosts,
    fetchSiteActivityFromLastYear,
    createPost,
} from "../lib/firestore"
import { getColor } from "../lib/functions"

import Head from "next/head"
import styles from "../../styles/homepage/index.module.css"

import MainPageReview from "../components/MainPageReviewComponent"
import GamesComponent from "../components/GamesComponent"
import SubscribtionSectionCompnent from "../components/SubscriptionSectionComponent"
import Title from "../components/TitleComponent"
import NewsFeedComponent from "../components/NewsFeedComponent"
import Modal from "../components/Modal"

export default function Index({ recentGames, bestOvrGames, newestProfiles, posts, siteActivity }) {

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

                    <div className={styles.extras__wrapper}>
                        <Link href={"/gaming-deals"} className={`${styles.box} ${styles.feature__ad__box} ${styles.card__gaming_deals}`}>
                            <div className={styles.card__icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M176,112H152a8,8,0,0,1,0-16h24a8,8,0,0,1,0,16ZM104,96H96V88a8,8,0,0,0-16,0v8H72a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16ZM241.48,200.65a36,36,0,0,1-54.94,4.81c-.12-.12-.24-.24-.35-.37L146.48,160h-37L69.81,205.09l-.35.37A36.08,36.08,0,0,1,44,216,36,36,0,0,1,8.56,173.75a.68.68,0,0,1,0-.14L24.93,89.52A59.88,59.88,0,0,1,83.89,40H172a60.08,60.08,0,0,1,59,49.25c0,.06,0,.12,0,.18l16.37,84.17a.68.68,0,0,1,0,.14A35.74,35.74,0,0,1,241.48,200.65ZM172,144a44,44,0,0,0,0-88H83.89A43.9,43.9,0,0,0,40.68,92.37l0,.13L24.3,176.59A20,20,0,0,0,58,194.3l41.92-47.59a8,8,0,0,1,6-2.71Zm59.7,32.59-8.74-45A60,60,0,0,1,172,160h-4.2L198,194.31a20.09,20.09,0,0,0,17.46,5.39,20,20,0,0,0,16.23-23.11Z" /></svg>
                            </div>
                            <h2>Gaming Deals</h2>
                            <p>Find the hottest GamePass offers</p>
                        </Link>
                        <Link href={"/about"} className={`${styles.box} ${styles.feature__ad__box} ${styles.card__tutorials}`}>
                            <div className={styles.card__icon}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 2C4.11929 2 3 3.11929 3 4.5V19.5C3 20.8807 4.11929 22 5.5 22H12.8096C12.3832 21.5557 12.0194 21.051 11.7322 20.5H5.5C4.94772 20.5 4.5 20.0523 4.5 19.5H11.3135C11.159 19.0218 11.0585 18.5195 11.0189 18H4.5V4.5C4.5 3.94772 4.94772 3.5 5.5 3.5H17C17.5523 3.5 18 3.94772 18 4.5V11.0189C18.5195 11.0585 19.0218 11.159 19.5 11.3135V4.5C19.5 3.11929 18.3807 2 17 2H5.5ZM23 17.5C23 14.4624 20.5376 12 17.5 12C14.4624 12 12 14.4624 12 17.5C12 20.5376 14.4624 23 17.5 23C20.5376 23 23 20.5376 23 17.5ZM16.9138 15.097L19.7203 16.9373C19.8073 16.9933 19.8757 17.0677 19.9254 17.1604C19.9751 17.251 20 17.3502 20 17.458C20 17.5614 19.9762 17.6606 19.9285 17.7555C19.8809 17.8504 19.8146 17.9258 19.7296 17.9819L16.9231 19.8965C16.8713 19.931 16.8184 19.9569 16.7646 19.9741C16.7128 19.9914 16.6568 20 16.5967 20C16.518 20 16.4424 19.9838 16.3699 19.9515C16.2973 19.917 16.2331 19.8717 16.1772 19.8157C16.1233 19.7574 16.0798 19.6906 16.0466 19.6151C16.0155 19.5397 16 19.461 16 19.379V15.621C16 15.5369 16.0155 15.4571 16.0466 15.3816C16.0798 15.3062 16.1233 15.2404 16.1772 15.1843C16.231 15.1283 16.2942 15.0841 16.3667 15.0517C16.4393 15.0172 16.5159 15 16.5967 15C16.7128 15 16.8184 15.0323 16.9138 15.097ZM6 6C6 5.44772 6.44772 5 7 5H15C15.5523 5 16 5.44772 16 6V8C16 8.55228 15.5523 9 15 9H7C6.44772 9 6 8.55228 6 8V6ZM7.5 7.5H14.5V6.5H7.5V7.5Z" fill="currentColor" /></svg>
                            </div>
                            <h2>Tutorials & Guides</h2>
                            <p>Learn how to use GameNotes</p>
                        </Link>
                        <Link href={"/games"} className={`${styles.box} ${styles.feature__ad__box} ${styles.card__reviews}`}>
                            <div className={styles.card__icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" /></svg>
                            </div>
                            <h2>Explore Reviews</h2>
                            <p>Discover community game reviews</p>
                        </Link>
                        <a onClick={() => setModalVisible(true)} className={`${styles.box} ${styles.feature__ad__box} ${styles.card__create_review}`}>
                            <div className={styles.card__icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,58.34l-32-32a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,88,128v32a8,8,0,0,0,8,8h32a8,8,0,0,0,5.66-2.34l96-96A8,8,0,0,0,229.66,58.34ZM124.69,152H104V131.31l64-64L188.69,88ZM200,76.69,179.31,56,192,43.31,212.69,64ZM224,128v80a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h80a8,8,0,0,1,0,16H48V208H208V128a8,8,0,0,1,16,0Z" /></svg>
                            </div>
                            <h2>Review a game</h2>
                            <p>Share your opinion with the community</p>
                        </a>
                        <a className={`${styles.box} ${styles.feature__ad__box} ${styles.card__trivia}`}>
                            <div className={styles.card__icon}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M560-360q17 0 29.5-12.5T602-402q0-17-12.5-29.5T560-444q-17 0-29.5 12.5T518-402q0 17 12.5 29.5T560-360Zm-30-128h60q0-29 6-42.5t28-35.5q30-30 40-48.5t10-43.5q0-45-31.5-73.5T560-760q-41 0-71.5 23T446-676l54 22q9-25 24.5-37.5T560-704q24 0 39 13.5t15 36.5q0 14-8 26.5T578-596q-33 29-40.5 45.5T530-488ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" /></svg>
                            </div>
                            <h2>Trivia Game</h2>
                            <p>Test your gaming knowledge</p>
                        </a>

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

    const [recentGames, bestOvrGames, newestProfiles, posts, siteActivity] = await Promise.all([
        fetchRecentGames(5),
        fetchBestOverallGames(4),
        fetchNewestProfiles(10),
        fetchRecentPosts(5),
        fetchSiteActivityFromLastYear(),
    ])

    return {
        props: {
            recentGames,
            bestOvrGames,
            newestProfiles,
            posts,
            siteActivity
        }
    }
}