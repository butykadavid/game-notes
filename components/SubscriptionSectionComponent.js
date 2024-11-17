import { useEffect, useState } from "react";

import { getGamePassData } from "../public/APIHandler";
import styles from "../styles/subscriptionSection/subscriptionSection.module.css"
import SubsciptionGameCardComponent from "./SubscriptionGameCardComponent";
import Loader from "./LoaderComponent";

export default function SubscriptionSectionCompnent({ category, sectionTitle }) {

    const [games, setGames] = useState([])
    const [isLoading, setLoading] = useState(true)

    const getGames = async () => {
        setGames(await getGamePassData(category))
    }

    useEffect(() => {
        if (games.length > 0) {
            setLoading(false)
        }
    }, [games])

    useEffect(() => {
        getGames()
    }, [])

    return (
        <div className={styles.section}>
            <div className={styles.fade__in__div}></div>
            <div className={styles.fade__out__div}></div>

            <h2>{sectionTitle}</h2>

            <div className={styles.container}>
                {isLoading
                    ?
                    <Loader />
                    :
                    <>
                        {
                            games.map((g, index) => {
                                return (
                                    <SubsciptionGameCardComponent game={g} key={index} />
                                )
                            })
                        }
                    </>
                }

            </div>
        </div>
    )

}