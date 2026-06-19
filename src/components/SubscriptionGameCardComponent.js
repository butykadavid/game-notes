import { useRouter } from "next/router"
import { redirectToPage, normalizeGameTitle } from "../lib/functions"
import styles from "../../styles/subscriptionSection/subscriptionGameCard.module.css"
import RatingBarComponent from "./RatingBarComponent"
import { useState } from "react"
import Image from "next/image"
import logo from '../../public/logo.png'
import google_logo from '../../public/google_logo.svg'
import Link from "next/link"
import { getFirstWordOfTitle } from "@/lib/functions"

export default function SubsciptionGameCardComponent({ game }) {

    const router = useRouter()

    const [optionsToggled, setOptionsToggled] = useState(false)

    const onCardMouseOver = () => setOptionsToggled(true)

    const onCardMouseLeave = () => setOptionsToggled(false)

    return (
        <div className={styles.card} onMouseOver={() => onCardMouseOver()} onMouseLeave={() => onCardMouseLeave()}>
            <div className={styles.img__container}>
                <img src={game.image} alt={`${game.title}'s poster`} />
            </div>
            <div className={styles.content}>
                <h3>{game.title}</h3>

                <RatingBarComponent rating={game.ovrRating * 20} aspectRatio={"10/1"} border={false} label={false} />
            </div>
            {optionsToggled &&
                <div className={styles.toggle__option__box}>
                    <div className={styles.toggle__option} onClick={() => redirectToPage(router, `/games`, { searchWord: `${getFirstWordOfTitle(game.title)}` })}>
                        <div style={{ width: '25px' }}>
                            <Image src={logo} alt="Logo" style={{ width: '100%' }} />
                        </div>
                        <h4>GameNotes search</h4>
                    </div>
                    <Link className={styles.toggle__option} href={`https://google.com/search?q=${game.title.split(' ').join("+")}`} target="_blank" style={{ textDecoration: "none" }}>
                        <div style={{ width: '20px' }}>
                            <Image src={google_logo} alt="Logo" style={{ width: '100%' }} />
                        </div>
                        <h4>Google search</h4>
                    </Link>
                    <div className={styles.toggle__option} onClick={() => redirectToPage(router, `/dashboard`, { createReviewTitle: normalizeGameTitle(game.title) })}>
                        <div style={{ background: '#d5d5d5', borderRadius: '3px' }}>
                            <h3 style={{ color: '#252525', fontWeight: '900', fontSize: '9px', padding: '3px 6px', margin: '0', }}>NEW</h3>
                        </div>
                        <h4>Write review</h4>
                    </div>
                </div>
            }
        </div >
    )

}