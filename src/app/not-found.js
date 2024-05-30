import Link from 'next/link'
import Image from 'next/image'

import logo from '../../public/logo.png'

import styles from './not-found.module.css'
import styles_root from './globals.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <Image src={logo} width={125} className={styles.logo} alt="Logo" />
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className={styles.link} href="/">Return Home</Link>
    </div>
  )
}