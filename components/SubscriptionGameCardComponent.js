import { useRouter } from "next/router"
import { redirectToPage } from "../public/functions"
import styles from "../styles/subscriptionSection/subscriptionGameCard.module.css"
import RatingBarComponent from "./RatingBarComponent"

export default function SubsciptionGameCardComponent({ game }) {

    const router = useRouter()

    const getFirstWordOfTitle = () => {
        // (the regex is for removing superscript characters)
        return game.title.split(' ')[0].replace(/[\u00A9\u00AE\u2122\u00B9\u00B2\u00B3\u2070-\u207F]+/g, '')
    }

    const onCardClick = () => {
        redirectToPage(router, `/games`, { searchWord: `${getFirstWordOfTitle()}` })
    }

    return (
        <div className={styles.card} onClick={() => onCardClick()}>
            <div className={styles.img__container}>
                <img src={game.image} alt={`${game.title}'s poster`}/>
            </div>
            <div className={styles.content}>
                <h3>{game.title}</h3>

                <RatingBarComponent rating={game.ovrRating * 20} aspectRatio={"10/1"} border={false} label={false}/>
            </div>
        </div>
    )

}