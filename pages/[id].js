import { useRef } from "react";

import styles from "../styles/gamePage.module.css"

export default function gamePage(game) {

    const _barcode = useRef()
    const _barcode_scanner = useRef()
    const _bottomElement = useRef()

    const getDateFromTimestamp = (timestamp) => {
        return new Date(timestamp * 1000);
    }

    const getFormattedDate = (date) => {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OKT", "NOV", "DEC"];
        return date.getFullYear() + "." + months[date.getMonth()] + "." + getDayFormat(date.getDate());
    }

    const getDayFormat = (day) => {
        return day.toString().length == 1 ? `0${day}` : day
    }

    const getOvrRating = () => {

        // calculating overall rating
        // the multipliers are there for weights for certain stats
        // if a stat is 0 it doesn't count

        var invalids = 0;
        if (game.gameplay == 0) invalids += 4;
        if (game.story == 0) invalids += 3;
        if (game.atmosphere == 0) invalids += 4;
        if (game.visuals == 0) invalids += 3;
        if (game.characters == 0) invalids += 2;
        if (game.audio == 0) invalids += 2;
        if (game.replayability == 0) invalids++;

        var ovr = (Number(game.gameplay) * 4) + (Number(game.story) * 3) + (Number(game.atmosphere) * 4) +
            (Number(game.visuals) * 3) + (Number(game.characters) * 2) + (Number(game.audio) * 2) + Number(game.replayability);

        return Math.floor(ovr / (19 - invalids));
    }

    const getColor = n => {
        if (n >= 90) return "#00ff36"
        else if (n >= 80 && n < 90) return "#7ae900"
        else if (n >= 70 && n < 80) return "#a6d100"
        else if (n >= 60 && n < 70) return "#c6b600"
        else if (n >= 50 && n < 60) return "#de9900"
        else if (n >= 40 && n < 50) return "#f07800"
        else if (n >= 30 && n < 40) return "#fb5000"
        else if (n >= 20 && n < 30) return "#ff0000"
        else if (n >= 10 && n < 20) return "#690000"
        else if (n < 10) return "#000000"
    }

    const sortAspects = () => {
        var aspects = [["gameplay", game.gameplay], ["visuals", game.visuals], ["atmosphere", game.atmosphere],
        ["story", game.story], ["audio", game.audio], ["characters", game.characters], ["replayability", game.replayability]]

        aspects = aspects.sort((a, b) => a[1] - b[1]).reverse()

        return aspects
    }

    const onPageScroll = (e) => {
        var curr_left = _barcode.current.style.left.toString().slice(0, _barcode.current.style.left.toString().length - 2)
        if (curr_left == "") curr_left = 2;
        if (e.deltaY > 0 && e.shiftKey) {
            _barcode.current.style.left = `${Number(curr_left) + 0.5}vw`;
        } else if (e.deltaY < 0 && e.shiftKey) {
            _barcode.current.style.left = `${Number(curr_left) - 0.5}vw`;
        }
    }

    const aspects = sortAspects();
    const lastPlayed = getFormattedDate(getDateFromTimestamp(game.lastPlayed))
    const ovr = getOvrRating();

    return (
        <>

            {/* Hacking global css, coz I can't get it to work -_(°-°)_- */}
            <style jsx global>{`
                *{
                    font-family: 'Montserrat', sans-serif;
                    text-transform: uppercase;

                    cursor: default;
                }

                html,
                body {
                  background: #121224;
                  overflow-x: hidden;
                  padding: 0;
                  margin: 0;
                  font-family: Roboto, sans-serif;
                  scroll-behavior: smooth;
                }
                
                body::-webkit-scrollbar{
                  display: none;
                }
            `}</style>

            {/* desktop view*/}
            <div className={styles.desktop} onTouchMove={onPageScroll} onWheel={onPageScroll}>

                <h1 className={styles.barcode} ref={_barcode}>{game.title}</h1>

                <h1 className={styles.barcode_scanner} ref={_barcode_scanner}>{game.title}</h1>

                <h1 className={styles.game__title}>{game.title}</h1>

                <div className={styles.main__left} style={{
                    background: `linear-gradient(to right, rgba(20, 20, 40, 0.85), rgba(20, 20, 40, 0.85)), url(${game.img})`,
                    backgroundAttachment: `fixed`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `cover`
                }}>

                    <div className={styles.bestAspects__container}>

                        <div className={styles.bestAspects__bar}>
                            <div className={styles.aspect}>
                                <p>{aspects[0][1]}</p>
                                <p>{aspects[0][0]}</p>
                            </div>

                            <div className={styles.aspect}>
                                <p>{aspects[1][1]}</p>
                                <p>{aspects[1][0]}</p>
                            </div>

                            <div className={styles.aspect}>
                                <p>{aspects[2][1]}</p>
                                <p>{aspects[2][0]}</p>
                            </div>

                            <div className={styles.hidden__aspect}>
                                <div className={styles.aspect}>
                                    <p>{aspects[3][1]}</p>
                                    <p>{aspects[3][0]}</p>
                                </div>

                                <div className={styles.aspect}>
                                    <p>{aspects[4][1]}</p>
                                    <p>{aspects[4][0]}</p>
                                </div>

                                <div className={styles.aspect}>
                                    <p>{aspects[5][1]}</p>
                                    <p>{aspects[5][0]}</p>
                                </div>

                                <div className={styles.aspect}>
                                    <p>{aspects[6][1]}</p>
                                    <p>{aspects[6][0]}</p>
                                </div>
                            </div>

                        </div>

                        <h4 className={styles.bestAspects__label}></h4>
                    </div>

                </div>
                <div className={styles.main__right}>

                    <img src={game.img} className={styles.game__image} />

                    <div className={styles.game__desc}>
                        <p>{game.notes}</p>
                    </div>

                </div>

                <div className={styles.stats__container} ref={_bottomElement}>

                    <div className={styles.aspect}>
                        <p>{game.playtime}</p>
                        <p>Playtime</p>
                    </div>
                    <div className={styles.aspect}>
                        <p>{game.playtroughs}</p>
                        <p>Playtroughs</p>
                    </div>
                    <div className={styles.aspect}>
                        <p>{lastPlayed}</p>
                        <p>Last played</p>
                    </div>
                    <div className={styles.aspect}>
                        <p>{game.price}$</p>
                        <p>Price</p>
                    </div>

                </div>

                <div className={styles.ovr__container}>
                    <h1 className={styles.game__ovr} style={{ color: `${getColor(ovr)}` }}>{ovr}</h1>
                    <p>Overall score</p>
                </div>

            </div>

            {/* mobile view*/}
            <div className={styles.mobile} onTouchMove={onPageScroll} onWheel={onPageScroll}>
                <div className={styles.main__left} style={{
                    background: `linear-gradient(to right, rgba(20, 20, 40, 0.85), rgba(20, 20, 40, 0.0)), url(${game.img})`,
                    backgroundRepeat: `no-repeat`,
                    backgroundSize: `cover`,
                    backgroundPosition: `center`
                }}>

                </div>

                <h1 className={styles.game__title}>{game.title}</h1>

                <div className={styles.main__right}>

                    <div className={styles.game__desc}>
                        <p>{game.notes}</p>
                    </div>

                </div>

                <div className={styles.ratings__container}>

                    <div className={styles.aspect}>
                        <p>{aspects[0][1]}</p>
                        <p>{aspects[0][0]}</p>
                    </div>

                    <div className={styles.aspect}>
                        <p>{aspects[1][1]}</p>
                        <p>{aspects[1][0]}</p>
                    </div>

                    <div className={styles.aspect}>
                        <p>{aspects[2][1]}</p>
                        <p>{aspects[2][0]}</p>
                    </div>

                    <div className={styles.aspect}>
                        <p>{aspects[3][1]}</p>
                        <p>{aspects[3][0]}</p>
                    </div>

                    <div className={styles.aspect}>
                        <p>{aspects[4][1]}</p>
                        <p>{aspects[4][0]}</p>
                    </div>

                    <div className={styles.aspect}>
                        <p>{aspects[5][1]}</p>
                        <p>{aspects[5][0]}</p>
                    </div>

                    <div className={styles.aspect}>
                        <p>{aspects[6][1]}</p>
                        <p>{aspects[6][0]}</p>
                    </div>
                </div>

                <div className={styles.ovr__container}>
                    <h1 className={styles.game__ovr} style={{ color: `${getColor(ovr)}` }}>{ovr}</h1>
                    <p>Overall score</p>
                </div>

                <div className={styles.stats__container}>

                    <div className={styles.aspect}>
                        <p>{game.playtime}</p>
                        <p>Playtime</p>
                    </div>
                    <div className={styles.aspect}>
                        <p>{game.playtroughs}</p>
                        <p>Playtroughs</p>
                    </div>
                    <div className={styles.aspect}>
                        <p>{lastPlayed}</p>
                        <p>Last played</p>
                    </div>
                    <div className={styles.aspect}>
                        <p>{game.price}$</p>
                        <p>Price</p>
                    </div>

                </div>

            </div>

        </>
    )
}

export const getServerSideProps = async (context) => {
    try {
        return { props: context.query }
    } catch (err) {
        console.err("Error occured while retriving data");
    }
}