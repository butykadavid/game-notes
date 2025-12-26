import { collection, deleteDoc, query, doc, getDocs, where } from 'firebase/firestore'
import { db } from '../../public/firebase'
import { getDateFromTimestamp, getFormattedDate } from '../../public/functions'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../public/firebase'
import styles from '../../styles/posts/post.module.css'

export default function PostComponent({ postData }) {

    const date = getFormattedDate(getDateFromTimestamp(postData.createdAt))

    const router = useRouter();

    const [user, loading] = useAuthState(auth)

    const deletePost = async () => {
        try {
            // Delete posts
            var q = query(collection(db, "posts"), where("createdAt", "==", postData.createdAt))
            var docs = await getDocs(q);

            var id;
            docs.forEach(snapshot => {
                id = snapshot.id;
            })

            var docRef = doc(db, 'posts', id)

            await deleteDoc(docRef);

            router.reload()
        } catch (err) { console.error(err) }
    }

    return <>
        <div className={styles.post__card}>
            <div className={styles.title__bar}>
                <h3>{postData.title}</h3>
                {user != null && <>
                    {(!loading && user.uid == process.env.ADMIN) &&
                        <a className={styles.delete__button} onClick={() => deletePost()}>x</a>
                    }
                </>
                }
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