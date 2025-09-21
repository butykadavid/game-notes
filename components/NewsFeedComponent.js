import PostComponent from "./PostComponent"
import styles from "../styles/posts/post.module.css"

export default function NewsFeedComponent({ posts }) {
    return <div className={styles.posts__container}>
        {posts.map((p, index) => {
            return (
                <div key={index}>
                    <PostComponent postData={p} />
                </div>
            )
        })}
        {/* <div className={styles.more__button}>
            <a>Previous posts...</a>
        </div> */}
    </div>
}