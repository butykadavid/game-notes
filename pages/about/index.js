import styles from '../../styles/about/about.module.css'
import logo from '../../public/logo.png'

import Image from 'next/image'

export default function About() {

    return (

        <div className={styles.main__container}>

            <div className={styles.logo__container}>
                <Image src={logo} width={125} className={styles.logo} alt="Logo" />
                <h1>Gamenotes</h1>
                <p>by <a href='https://butykadavid.github.io' target='_blank'>Dávid Butyka</a></p>
            </div>

            <div className={styles.text__container}>
            </div>

        </div>

    )

}