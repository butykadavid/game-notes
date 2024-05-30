import styles from '../styles/titleComponent.module.css'

export default function Title({text}){
    return (

        <div className={styles.wrapper}>
            <div className={styles.title__container}>
                <h1>{text}</h1>
            </div>
        </div>
    )
}