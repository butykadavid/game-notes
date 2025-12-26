import styles from '../../styles/titleComponent.module.css'
import { Children } from "react"

export default function Title({ text, children }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title__container}>
                <h1>{text}</h1>
                <div>
                    {Children.map(children, child =>
                        <div>{child}</div>
                    )}
                </div>
            </div>
        </div>
    )
}