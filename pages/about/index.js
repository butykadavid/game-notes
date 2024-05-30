import styles from '../../styles/about/about.module.css'
import logo from '../../public/logo.png'

import Image from 'next/image'

import img_1 from '../../public/aboutImages/game-detail-page-1.png'
import img_2 from '../../public/aboutImages/game-reviews-1.png'
import img_3 from '../../public/aboutImages/review-example-1.png'
import img_4 from '../../public/aboutImages/coding-image.jpg'

export default function About() {

    return (

        <div className={styles.main__container}>

            <section className={styles.section__left}>
                <div className={styles.section__info__container}>
                    <div className={styles.section__title}>
                        What is GameNotes?
                    </div>
                    <div className={styles.section__text}>
                        GameNotes is a video game review site that encourages objective rating of videogames, by providing seven main aspects to rate for each game.
                        Due to this system, the final ratings does not necessarily represent how good games are overall, but rather how well designed they are from an artistic point of view.
                    </div>
                </div>
                <div className={styles.section__image__container}>
                    <div className={styles.logo__container}>
                        <Image src={logo} width={125} className={styles.logo} alt="Logo" />
                        <h1>Gamenotes</h1>
                        <p>by <a href='https://butykadavid.github.io' target='_blank'>Dávid Butyka</a></p>
                    </div>
                </div>
            </section>

            <section className={styles.section__right}>
                <div className={styles.section__info__container}>
                    <div className={styles.section__title}>
                        Overall rating calculation
                    </div>
                    <div className={styles.section__text}>
                        <p>
                            Some aspects weight more when calculating the final rating. These are predetermined constants and work the following way:
                        </p>
                        <ul>
                            <li>x4 weight: <b>Gameplay</b>, <b>Atmosphere</b> </li>
                            <li>x3 weight: <b>Visuals</b>, <b>Story</b></li>
                            <li>x2 weight: <b>Characters</b>, <b>Audio</b></li>
                            <li>x1 weight: <b>Replayability</b></li>
                        </ul>
                        <p>
                            Of course according to the genre, budget and the aims of a game, some of these values should vary.
                            This is something that might be implemented in the future.
                            <br />
                            For now if a category is absolutely irrelevant in the context of a game,
                            you can give a 0 for that aspect, as 0 values are ignored while calculating overall ratings.
                            <br />
                            The meanings of the aspects are the following:
                        </p>
                        <ul>
                            <li><b>Gameplay:</b> basically everything that is related to the feeling of controlling and playing the game. Level and mission design also falls into this category.</li>
                            <li><b>Atmosphere:</b> the artstyle, the enviroment, how much the game can make you part of it with its consistent details</li>
                            <li><b>Visuals:</b> graphical complexity, mostly aims to represent how realitic graphics are, therefore usually a high rating for AAA games</li>
                            <li><b>Story:</b> speaks for itself, lore complexity and stroytelling</li>
                            <li><b>Characters:</b> represents how interesting characters are in the game, and how they change as the story progresses</li>
                            <li><b>Audio:</b> audio design, sound effects, music, voice acting, and how these are used to build the atmosphere</li>
                            <li><b>Replayability:</b> represents how likely it is that you will play the game again in a few years,
                                or if there is a repetative, but fun gameplay loop (rougelikes),
                                or if there are alternative challange gamemodes that players are likely to spend some time with after the main story</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.section__image__container}>
                    <Image src={img_2} width={550} className={styles.section__image} alt='Game reviews example' />
                </div>
            </section >

            <section className={styles.section__left}>
                <div className={styles.section__info__container}>
                    <div className={styles.section__title}>
                        Game Summaries
                    </div>
                    <div className={styles.section__text}>
                        <p>
                            On the page of a specific game you can find all the data regarding a specific game.
                            <br />
                            The average overall rating, the average for all categories, and also the average statistics for users, like playtime.
                            <br />
                            Scrolling down you can read all reviews one by one.
                        </p>
                    </div>
                </div>
                <div className={styles.section__image__container}>
                    <Image src={img_1} width={550} className={styles.section__image} alt='Game detail page top view' />
                </div>
            </section>

            <section className={styles.section__right}>
                <div className={styles.section__info__container}>
                    <div className={styles.section__title}>
                        Creating reviews
                    </div>
                    <div className={styles.section__text}>
                        <p>You can very easily create your own reviews by registrating
                            with a Google account and navigating to the user "Dashboard".
                            <br />
                            <b>While creating a review you must write the title and frenchise correctly!</b>
                            <br />
                            This is important because otherwise it is going to be registered for a separate, "new" game.
                            <br />
                            You can edit and delete your reviews by toggling edit mode on the "Dashboard".
                        </p>
                    </div>
                </div>
                <div className={styles.section__image__container}>
                    <Image src={img_3} width={550} className={styles.section__image} alt='Form' />
                </div>
            </section>

            <section className={styles.section__left}>
                <div className={styles.section__info__container}>
                    <div className={styles.section__title}>
                        Future updates
                    </div>
                    <div className={styles.section__text}>
                        <p>
                            The following features are planned for the future:
                        </p>
                        <ul>
                            <li>Filters and ordering options for review lists.</li>
                            <li>Genre specific rating calculations.</li>
                            <li>Game comparison page</li>
                            <li>Alternative ranking system for own reviewed games, based on <a href='https://en.wikipedia.org/wiki/Elo_rating_system' target='_blank'>Elo ranking system</a>.</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.section__image__container}>
                    <Image src={img_4} width={550} className={styles.section__image} alt='Game detail page top view' />
                </div>
            </section>

        </div >

    )

}