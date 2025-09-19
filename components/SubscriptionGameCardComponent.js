import { useRouter } from "next/router"
import { redirectToPage } from "../public/functions"
import styles from "../styles/subscriptionSection/subscriptionGameCard.module.css"
import RatingBarComponent from "./RatingBarComponent"
import { useState } from "react"

export default function SubsciptionGameCardComponent({ game }) {

    const router = useRouter()

    const [optionsToggled, setOptionsToggled] = useState(false)

    const getFirstWordOfTitle = () => {
        // (the regex is for removing superscript characters)
        return game.title.split(' ')[0].replace(/[\u00A9\u00AE\u2122\u00B9\u00B2\u00B3\u2070-\u207F]+/g, '')
    }

    const onCardMouseOver = () => {
        setOptionsToggled(true)
        //redirectToPage(router, `/games`, { searchWord: `${getFirstWordOfTitle()}` })
    }

    return (
        <div className={styles.card} onMouseOver={() => onCardMouseOver()}>
            <div className={styles.img__container}>
                <img src={game.image} alt={`${game.title}'s poster`} />
            </div>
            <div className={styles.content}>
                <h3>{game.title}</h3>

                <RatingBarComponent rating={game.ovrRating * 20} aspectRatio={"10/1"} border={false} label={false} />
            </div>
            {optionsToggled &&
                <div className={styles.toggle__option__box}>
                    <h3>GameNotes search</h3>
                    <h3>Google search</h3>
                </div>
            }
        </div>
    )

}