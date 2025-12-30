import { getOvrRating } from "../../../public/functions"
import { fetchUserByUid, fetchGamesForUser } from "../../lib/firestore"

import ProfileInfo from "../../components/ProfileInfoComponent"
import FilteredReviewList from "../../components/FilteredReviewListComponent"

import styles from '../../../styles/profilepage/profilePage.module.css'
import Head from "next/head"

export default function ProfilePage({ reviews, user }) {

    const playtime = Math.round(reviews.reduce((a, c) => a + c.playtime, 0))
    const platinums = reviews.reduce((a, c) => c.platinum ? a + 1 : a, 0)
    const avgRating = Math.round(reviews.reduce((a, c) => a + getOvrRating(c), 0) / reviews.length)
    const bestRatedGame = reviews.sort((a, b) => getOvrRating(b) - getOvrRating(a))[0]

    return (
        <>
            <Head>
                <title>GameNotes | {user}</title>
                <meta name="description" content={`${user}'s profile`} />
                <meta name="keywords" content={`GameNotes, Profile, User, Result, Game, Games, Review, Videogame, ${user}`} />
            </Head>

            <div className={styles.main__container}>
                <div className={styles.splitter}>
                    <div className={styles.profile__card__side}>
                        <ProfileInfo user={user} reviewCount={reviews.length} playtime={playtime} platinums={platinums} avgRating={avgRating} bestRatedGame={bestRatedGame} />
                    </div>
                    <div className={styles.reviews__side}>
                        <h2 className={styles.reviews__title}>{user.name}'s reviews</h2>

                        <FilteredReviewList
                            reviews={reviews}
                            reviewCardProps={{
                                hasLabel: false,
                                hasTitle: true,
                                deleteButton: false
                            }}
                            emptyMessage={<h1 className={styles.no__review__message}>No reviews available</h1>}
                            keyGenerator={(review, index) => index}
                        />
                        <div className={styles.bottom__dummy}><p>Yo!<br />Easter Egg!</p></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = async (context) => {

    var user = {}

    if (context.query.createdAt == null) {
        user = await fetchUserByUid(context.query.uid)
    } else {
        user = {
            uid: context.query.uid,
            createdAt: context.query.createdAt,
            image: context.query.image,
            name: context.query.name
        }
    }

    const reviews = await fetchGamesForUser(user.uid)

    return {
        props: {
            reviews,
            user
        }
    }
}