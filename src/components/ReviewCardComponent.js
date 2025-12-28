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

    return (
        <div className={styles.card} onClick={() => redirectToPage(router, `/games/${review.title}`, { title: `${review.title}` })}>
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
                    <span style={{ color: getColor(review.gameplay) }} title={review.gameplay}>
                        <MdVideogameAsset />
                    </span>
                    <span style={{ color: getColor(review.visuals) }} title={review.visuals}>
                        <IoImages />
                    </span>
                    <span style={{ color: getColor(review.atmosphere) }} title={review.atmosphere}>
                        <HiSparkles />
                    </span>
                    <span style={{ color: getColor(review.story) }} title={review.story}>
                        <MdOutlineHistoryEdu />
                    </span>
                    <span style={{ color: getColor(review.audio) }} title={review.audio}>
                        <MdAudioFile />
                    </span>
                    <span style={{ color: getColor(review.characters) }} title={review.characters}>
                        <FaUsers />
                    </span>
                    <span style={{ color: getColor(review.replayability) }} title={review.replayability}>
                        <MdRepeatOn />
                    </span>
                </div>
            </div>


            <h1 className={styles.card__score} style={{ color: `${getColor(ovr)}` }}>{ovr}</h1>

        </div>
    )
}