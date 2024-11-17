import styles from "../styles/loader.module.css"

export default function Loader() {
    return <>
        <div className={styles.loading__container}>
            <h1 className={styles.loading__title}>Loading</h1>
            <div className={styles.loading__circle}></div>
        </div>
    </>
}