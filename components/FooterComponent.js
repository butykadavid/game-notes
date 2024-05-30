import { redirectToPage } from '../public/functions'

import Image from 'next/image'

import styles from '../styles/footer/footer.module.css'
import logo from '../public/logo.png'
import web from '../public/social_web.png'
import linked from '../public/social_linkedin.png'
import { useRouter } from 'next/router'

export default function Footer() {

    const router = useRouter()

    return (

        <div className={styles.main__container}>

            <div className={styles.main__part}>
                <p>By Dávid Butyka</p>
                <div>
                    <a href='https://butykadavid.github.io' target='_blank'><Image src={web} width={30} alt='website_logo'/></a>
                    <a><Image src={linked} width={30} alt='linkedIn_logo'/></a>
                </div>
            </div>

            <div className={styles.main__part} onClick={() => redirectToPage(router, '/', {})}>
                <Image src={logo} width={75} className={styles.logo} alt='logo'/>
                <p>Gamenotes</p>
            </div>

            <div className={styles.main__part}>
                <a onClick={() => redirectToPage(router, '/', {})}>Home</a>
                <a onClick={() => redirectToPage(router, '/games', {})}>Games</a>
                <a onClick={() => redirectToPage(router, '/about', {})}>About</a>
                <a onClick={() => redirectToPage(router, '/feedback', {})}>Feedback</a>
            </div>

        </div>

    )

}