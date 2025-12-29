import { useCallback } from 'react';
import { useRouter } from 'next/router'
import { getOvrRating, getColor } from '../../public/functions'
import { redirectToPage } from '../../public/functions'

import { PiGameControllerFill } from "react-icons/pi";
import { MdRateReview } from "react-icons/md";

import { MdVideogameAsset } from "react-icons/md";
import { IoImages } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineHistoryEdu } from "react-icons/md";
import { MdAudioFile } from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { MdRepeatOn } from "react-icons/md";


import styles from '../../styles/gamepage/reviewCard.module.css'

export default function ReviewCard({ review, hasLabel, hasTitle, deleteButton, fillParentForm }) {

    const router = useRouter()

    const ovr = getOvrRating(review)

    const HashTags = useCallback(() => {
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

        const isUpdatedAfterAWeek =
            Math.abs(review.updated - review.created) >= ONE_WEEK_MS;

        const hts = []
        if (review.platinum) hts.push(<span style={{ color: "turquoise" }}>PLATINUM</span>)
        if (review.playtime > 100) hts.push(<span>oneMoreQuest</span>)
        if (review.playtime < 2) hts.push(<span>refoundWindow</span>)
        if (isUpdatedAfterAWeek) hts.push(<span>changedMind</span>)
        if (review.atmosphere > 90) hts.push(<span style={{ color: "lightgreen" }}>immersive</span>)
        if (review.visuals > 90) hts.push(<span style={{ color: "royalblue" }}>photorealistic</span>)
        if (review.story > 90) hts.push(<span style={{ color: "pink" }}>imNotCrying</span>)
        if (review.audio > 90) hts.push(<span style={{ color: "mediumslateblue" }}>headphonesRequired</span>)
        if (review.characters > 90) hts.push(<span style={{ color: "salmon" }}>simp</span>)
        if (review.replayability > 90) hts.push(<span style={{ color: "yellow" }}>infiniteLoop</span>)

        return <>
            {hts.map((h, index) => {
                return <div key={index} className={styles.hashtag}>{h}</div>
            })}
        </>
    }, [review])

    return (
        <div className={styles.card} onClick={() => redirectToPage(router, `/games/${review.title}`, { title: `${review.title}` })}>
            <div className={styles.card__main}>

                <div className={styles.card__image}>{hasTitle ? <h1 className={styles.rotate}><PiGameControllerFill /></h1> : <h1><MdRateReview /></h1>}</div>

                <div className={styles.card__mid}>
                    <div className={styles.card__mid__text}>
                        {hasTitle ? <>
                            <h1 className={styles.card__title}>{review.title}</h1>
                            {hasLabel && <p className={styles.card__user}>by {review.userName}</p>}
                        </>
                            : <>
                                {hasLabel && <h1 className={styles.card__title}>{review.userName}</h1>}
                            </>}
                    </div>
                    <div className={styles.card__mid__icons}>
                        <span style={{ color: getColor(review.gameplay) }} title={"Gameplay: " + review.gameplay}>
                            <MdVideogameAsset />
                        </span>
                        <span style={{ color: getColor(review.visuals) }} title={"Visuals: " + review.visuals}>
                            <IoImages />
                        </span>
                        <span style={{ color: getColor(review.atmosphere) }} title={"Atmosphere: " + review.atmosphere}>
                            <HiSparkles />
                        </span>
                        <span style={{ color: getColor(review.story) }} title={"Story: " + review.story}>
                            <MdOutlineHistoryEdu />
                        </span>
                        <span style={{ color: getColor(review.audio) }} title={"Audio: " + review.audio}>
                            <MdAudioFile />
                        </span>
                        <span style={{ color: getColor(review.characters) }} title={"Characters: " + review.characters}>
                            <FaUsers />
                        </span>
                        <span style={{ color: getColor(review.replayability) }} title={"Replayability: " + review.replayability}>
                            <MdRepeatOn />
                        </span>
                    </div>
                </div>


                <h1 className={styles.card__score} style={{ color: `${getColor(ovr)}` }}>{ovr}</h1>

            </div>
            <div className={styles.card__sub}>
                <HashTags />
            </div>
        </div>
    )
}