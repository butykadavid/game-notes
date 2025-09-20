import { getDateFromTimestamp, getFormattedDate } from '../public/functions'
import styles from '../styles/posts/post.module.css'

export default function PostComponent({ postData }) {

    const date = getFormattedDate(getDateFromTimestamp(postData.createdAt))

    return <>
        <div className={styles.post__card}>
            <div className={styles.title__bar}>
                <h3>{postData.title}</h3>
            </div>
            <div className={styles.text__box}>
                <p>{postData.text}</p>
            </div>
            <div className={styles.footer}>
                <p>{date}</p>
            </div>
        </div>
    </>
}