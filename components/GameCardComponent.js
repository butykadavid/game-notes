import styles from "../styles/gameCard.module.css"

const GameCardComponent = ({ games, fillParentForm }) => {

    const getDateFromTimestamp = (timestamp) => {
        return new Date(timestamp * 1000);
    }

    const getFormattedDate = (date) => {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
        return date.getFullYear() + "." + months[date.getMonth()];
    }

    const getOvrRating = (game) => {
        // calculating overall rating
        // the multipliers are there for weights for certain stats
        var ovr = (game.gameplay * 4) + (game.story * 3) + (game.atmosphere * 4) + (game.visuals * 3) +
            (game.characters * 2) + (game.audio * 2) + game.replayability;
        return Math.floor(ovr / 19);
    }

    const getColor = n => {
        if (n >= 90) return "#00ff36"
        else if (n >= 80 && n < 90) return "#6be700"
        else if (n >= 70 && n < 80) return "#8ecf00"
        else if (n >= 60 && n < 70) return "#a3b700"
        else if (n >= 50 && n < 60) return "#b19d00"
        else if (n >= 40 && n < 50) return "#b98400"
        else if (n >= 30 && n < 40) return "#bc6900"
        else if (n >= 20 && n < 30) return "#bb4e00"
        else if (n >= 10 && n < 20) return "#b43000"
        else if (n < 10) return "#aa0000"
    }

    const isReviewOutDated = game => {
        if (getDateFromTimestamp(game.lastPlayed).getFullYear() + 3 < (new Date().getFullYear())) return true

        return false
    }

    const getCardStyle = game => {
        if (!isReviewOutDated(game)) return

        return "linear-gradient(#121224, #121224) padding-box, linear-gradient(to right, yellow, red) border-box"
    }

    const cardDoubleClick = game => {
        fillParentForm(game)
    }

    return games.map(game => {

        const date = getDateFromTimestamp(game.lastPlayed)
        game.lastPlayed_Date = getFormattedDate(date)
        game.ovr = getOvrRating(game)

        return <>

            <div className={styles.game__card} title={game.notes} style={{ background: getCardStyle(game) }} onDoubleClick={() => cardDoubleClick(game)}>

                <div className={styles.card__left} style={{ backgroundImage: `url(${game.img})` }} title={game.img}>
                </div>

                <div className={styles.card__mid}>

                    <div className={styles.card__mid__content}>

                        <div className={styles.card__mid__content__divider}>

                            <h1 className={styles.card__title}>{game.title}</h1>

                            <div className={styles.card__ratings}>

                                <div>
                                    <p>Gameplay</p>
                                    <p style={{ color: getColor(game.gameplay) }}>{game.gameplay}</p>
                                </div>
                                <div>
                                    <p>Story</p>
                                    <p style={{ color: getColor(game.story) }}>{game.story}</p>
                                </div>
                                <div>
                                    <p>Atmosphere</p>
                                    <p style={{ color: getColor(game.atmosphere) }}>{game.atmosphere}</p>
                                </div>
                                <div>
                                    <p>Visuals</p>
                                    <p style={{ color: getColor(game.visuals) }}>{game.visuals}</p>
                                </div>
                                <div>
                                    <p>Characters</p>
                                    <p style={{ color: getColor(game.characters) }}>{game.characters}</p>
                                </div>
                                <div>
                                    <p>Audio</p>
                                    <p style={{ color: getColor(game.audio) }}>{game.audio}</p>
                                </div>
                                <div>
                                    <p>Replayability</p>
                                    <p style={{ color: getColor(game.replayability) }}>{game.replayability}</p>
                                </div>

                            </div>

                        </div>

                        <div className={styles.card__ovr}>
                            <p style={{ background: getColor(game.ovr) }}>{game.ovr}</p>
                        </div>

                    </div>


                    <div className={styles.card__infos}>

                        <div>
                            <p>Last played - </p>
                            <p>{game.lastPlayed_Date}</p>
                        </div>
                        <div>
                            <p>Playtime - </p>
                            <p>{game.playtime} h</p>
                        </div>
                        <div>
                            <p>Playthrougs - </p>
                            <p>{game.playtroughs}</p>
                        </div>
                        <div>
                            <p>Price - </p>
                            <p>{game.price}$</p>
                        </div>

                    </div>

                </div>

            </div>

        </>

    })

}

export default GameCardComponent;