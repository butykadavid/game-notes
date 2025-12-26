import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, signInWithGoogle } from '../public/firebase'
import { useRouter } from 'next/router'
import { redirectToPage } from '../public/functions'
import { useEffect, useState } from 'react'

import Image from 'next/image'

import logo from '../public/logo.png'
import styles from '../styles/nav/navBar.module.css'

const adminId = process.env.ADMIN;

export default function NavBar() {

    const [placeholder, setPlaceHolder] = useState('Your favorite game...')

    const [user, loading] = useAuthState(auth)
    const router = useRouter()

    const onSearch = e => {
        if (e.key !== "Enter") return

        redirectToPage(router, `/games`, { searchWord: `${e.target.value}` })

        e.target.value = ""
        e.target.blur()
    }

    const sandwitchClick = () => {
        const side_bar = document.querySelector('#side_bar')
        if (side_bar.style.display == 'flex') {
            side_bar.style.display = 'none'
            return
        }

        side_bar.style.display = 'flex'
    }

    useEffect(() => {
        document.addEventListener('click', (e) => {
            const button = document.querySelector('#menuButton')
            const side_bar = document.querySelector('#side_bar')
            if (e.target == button) return
            if (e.target == side_bar) return

            if (side_bar.style.display == 'flex') {
                side_bar.style.display = 'none'
                return
            }
        })
    }, [])

    if (!loading) {

        return (

            <div className={styles.main__bar}>

                <div className={styles.logo} onClick={() => redirectToPage(router, '/', {})}>
                    <h1>GameNotes</h1><Image src={logo} width={75} alt='logo' />
                </div>

                <div className={styles.search__bar}>
                    <input type="search" name='searchBar' title='searchBar' placeholder={placeholder} onFocus={() => setPlaceHolder('')} onBlur={() => setPlaceHolder('Your favorite game...')} onKeyUp={(e) => onSearch(e)} />
                </div>

                {user == null ?

                    <>

                        <div className={styles.bar__item__container}>

                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/', {})}>Home</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/games', {})}>Games</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/about', {})}>About</a>
                            <a className={`${styles.bar__item} ${styles.logIn}`} onClick={signInWithGoogle}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Sign In With Google
                            </a>

                        </div>

                        <div className={styles.sandwitch}>
                            <button onClick={() => sandwitchClick()} id='menuButton'>
                                ⋮
                            </button>
                        </div>

                        <div className={styles.side__panel} id='side_bar'>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/', {})}>Home</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/games', {})}>Games</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/about', {})}>About</a>
                            <a className={`${styles.bar__item} ${styles.logIn}`} onClick={signInWithGoogle}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Sign In With Google
                            </a>
                        </div>

                    </>

                    :

                    <>

                        <div className={styles.bar__item__container}>

                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/', {})}>Home</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/games', {})}>Games</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/about', {})}>About</a>
                            <a className={`${styles.bar__item} ${styles.admin}`} style={{ visibility: `${user.uid === adminId ? "visible" : "hidden"}` }} onClick={() => redirectToPage(router, '/admin', {})}>Admin</a>
                            <a className={`${styles.bar__item} ${styles.dashboard}`} onClick={() => redirectToPage(router, '/dashboard', {})}>Dashboard</a>

                        </div>

                        <div className={styles.sandwitch}>
                            <button onClick={() => sandwitchClick()} id='menuButton'>
                                ⋮
                            </button>
                        </div>

                        <div className={styles.side__panel} id='side_bar'>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/', {})}>Home</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/games', {})}>Games</a>
                            <a className={styles.bar__item} onClick={() => redirectToPage(router, '/about', {})}>About</a>
                            <a className={`${styles.bar__item} ${styles.admin}`} style={{ visibility: `${user.uid === adminId ? "visible" : "hidden"}` }} onClick={() => redirectToPage(router, '/admin', {})}>Admin</a>
                            <a className={`${styles.bar__item} ${styles.dashboard}`} onClick={() => redirectToPage(router, '/dashboard', {})}>Dashboard</a>
                        </div>

                    </>
                }

            </div>
        )
    }
    else {
        return (

            <div className={styles.main__bar}>

                <div className={styles.logo} onClick={() => redirectToPage(router, '/', {})}>
                    <h1>GameNotes</h1><Image src={logo} width={75} alt='logo' />
                </div>

            </div>
        )
    }
}