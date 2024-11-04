import { useRef, useState, useEffect } from "react";
import { toggleOrdering, toggleDirection, activateOrdering } from "../public/functions";

import styles from "../styles/dashboard.module.css"

export default function ReviewFilterComponent({ reviews, setReviews }) {

    const [ordering, setOrdering] = useState('none')
    const [direction, setDirection] = useState('DESC')

    const _orderingContainer = useRef()
    const _directionContainer = useRef()

    useEffect(() => {
        activateOrdering(ordering, direction, setReviews, reviews)
    }, [ordering, direction])

    return (
        <div className={styles.filterBar__container}>
            <div className={styles.ordering}>
                <p>Category</p>
                <div ref={_orderingContainer}>
                    <a onClick={(e) => toggleOrdering(e, "overall", _orderingContainer, setOrdering, styles)}>Ovr</a>
                    <a onClick={(e) => toggleOrdering(e, "gameplay", _orderingContainer, setOrdering, styles)}>Gmp</a>
                    <a onClick={(e) => toggleOrdering(e, "atmosphere", _orderingContainer, setOrdering, styles)}>Atm</a>
                    <a onClick={(e) => toggleOrdering(e, "visuals", _orderingContainer, setOrdering, styles)}>Vis</a>
                    <a onClick={(e) => toggleOrdering(e, "story", _orderingContainer, setOrdering, styles)}>Sto</a>
                    <a onClick={(e) => toggleOrdering(e, "characters", _orderingContainer, setOrdering, styles)}>Cha</a>
                    <a onClick={(e) => toggleOrdering(e, "audio", _orderingContainer, setOrdering, styles)}>Aud</a>
                    <a onClick={(e) => toggleOrdering(e, "replayability", _orderingContainer, setOrdering, styles)}>Rpl</a>
                    <a onClick={(e) => toggleOrdering(e, "platinum", _orderingContainer, setOrdering, styles)}>Plat</a>
                </div>
            </div>
            <div className={styles.direction}>
                <p>Direction</p>
                <div ref={_directionContainer}>
                    <a className={styles.toggled} onClick={(e) => toggleDirection(e, _directionContainer, setDirection, styles)}>DESC</a>
                    <a onClick={(e) => toggleDirection(e, _directionContainer, setDirection, styles)}>ASC</a>
                </div>
            </div>
        </div>
    )
}