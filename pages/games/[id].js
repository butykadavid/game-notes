import { db } from "../../public/firebase"
import { collection, query, where, getDocs } from "firebase/firestore";
import { getOvrRating, getColor } from "../../public/functions";

import styles from "../../styles/gamepage/gamePage.module.css"
import Head from "next/head"

import RatingBarComponent from "../../components/RatingBarComponent";
import ReviewCard from "../../components/ReviewCardComponent";
import ReviewFilterComponent from "../../components/ReviewFilterComponent";
import { useState } from "react";

export default function gamePage({ title, reviews, background }) {

    const [items, setItems] = useState(reviews)

    var avgOvr = 0;

    const getAverageValues = () => {
        var gameplay = 0
        var visuals = 0
        var characters = 0
        var story = 0
        var audio = 0
        var atmosphere = 0
        var replayability = 0

        reviews.map(r => {
            gameplay += r.gameplay
            visuals += r.visuals
            characters += r.characters
            story += r.story
            audio += r.audio
            atmosphere += r.atmosphere
            replayability += r.replayability
            avgOvr += getOvrRating(r)
        })

        const rLen = reviews.length
        gameplay = Math.round(gameplay / rLen)
        visuals = Math.round(visuals / rLen)
        characters = Math.round(characters / rLen)
        story = Math.round(story / rLen)
        audio = Math.round(audio / rLen)
        atmosphere = Math.round(atmosphere / rLen)
        replayability = Math.round(replayability / rLen)
        avgOvr = Math.round(avgOvr / rLen)

        return {
            gameplay: gameplay,
            visuals: visuals,
            characters: characters,
            story: story,
            audio: audio,
            atmosphere: atmosphere,
            replayability: replayability,
        }
    }

    const getSumValues = () => {

        var playtime = 0
        var playtroughs = 0
        var platinums = 0

        reviews.map(r => {
            playtime += r.playtime
            playtroughs += r.playtroughs
            platinums += (r.platinum ? 1 : 0)
        })

        return {
            playtime: playtime,
            playtroughs: playtroughs,
            platinums: platinums
        }

    }

    const avgVals = getAverageValues()
    const sumVals = getSumValues()

    return (
        <>

            <Head>
                <title>GameNotes | {title}</title>
                <meta name="description" content={`Reviews of "${title}"`} />
                <meta name="keywords" content={`GameNotes, Result, Game, Games, Review, ${title}, Videogame`}/>
            </Head>

            {/* desktop view*/}
            <div className={styles.main__container}>
                <div className={`${styles.first__page} ${styles.page}`} style={{
                    background: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.5)), url(${background})`,
                    backgroundAttachment: `fixed`,
                    backgroundPosition: `center`,
                    backgroundSize: `cover`,
                    backgroundRepeat: `no-repeat`
                }} >

                    <div className={styles.center__container}>
                        <h1 className={styles.title}>{title}</h1>
                        <RatingBarComponent rating={avgOvr} aspectRatio={"25/1"} border={true} label={true}/>
                    </div>

                    <div className={styles.stat__box}>
                        <div className={styles.stat__box__section}>
                            {
                                Object.keys(avgVals).map(prop => {
                                    const name = prop
                                    const val = avgVals[prop]
                                    const color = getColor(val)
                                    return (
                                        <div key={name} className={styles.stat}>
                                            <p style={{ color: `${color}` }}>{val}</p>
                                            <p>{name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.stat__box__section}>
                            {
                                Object.keys(sumVals).map(prop => {
                                    const name = prop
                                    const val = sumVals[prop]
                                    const color = getColor(val)
                                    return (
                                        <div key={name} className={styles.stat}>
                                            <p>{val}</p>
                                            <p>{name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>

                <div className={`${styles.page} ${styles.reviews__page}`}>

                    <div className={styles.dummy}></div>

                    <ReviewFilterComponent reviews={items} setReviews={setItems} />

                    {
                        items.map(review => {
                            return (
                                <ReviewCard key={`${review.userName}-${review.created}`} review={review} hasLabel={true} />
                            )
                        })
                    }
                </div>
            </div>

        </>
    )
}

export const getServerSideProps = async (context) => {

    const title = context.query.title

    const q = query(collection(db, 'games'), where('title', '==', title))
    const docs = await getDocs(q)

    const reviews = docs.docs.map(doc => {
        return { ...doc.data() }
    })

    const background = reviews[0].img

    return { props: { title, reviews, background } }
}