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
        <div className={styles.post__card} style={{ border: 'none', boxShadow: 'none' }}>
            <p style={{ color: '#dedede' }}>Click for More...</p>
        </div>
    </div>
}