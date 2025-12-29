import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import styles from "../../../styles/admin/admin.module.css"
import { query, getDocs, collection, updateDoc, doc, orderBy } from "firebase/firestore"
import { auth, db } from "../../../public/firebase"

async function fetchAdminData(setDataLoading, setData) {
    setDataLoading(true)

    const q = query(collection(db, "summaries"), orderBy('title', 'asc'))
    const docs = await getDocs(q)

    const summaries = docs.docs.map(d => ({
        id: d.id,
        ...d.data()
    }))

    setData(summaries)
    setDataLoading(false)
}

function isValidImageUrl(url) {
    return new Promise((resolve) => {
        if (!url) return resolve(false);

        try {
            new URL(url);
        } catch {
            return resolve(false);
        }

        const img = new Image();
        img.src = url;

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}

async function validateExistingImages(data, setData) {
    const updated = await Promise.all(
        data.map(async item => {
            if (!item.img) return item;

            const valid = await isValidImageUrl(item.img);
            return valid ? item : { ...item, img: null };
        })
    );

    setData(updated);
}

export default function Admin() {
    const [user, loading] = useAuthState(auth)
    const [dataLoading, setDataLoading] = useState(false)
    const [data, setData] = useState([])
    const [showOnlyMissingImages, setShowOnlyMissingImages] = useState(true)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if (!user) return
        fetchAdminData(setDataLoading, setData)
    }, [user])

    useEffect(() => {
        if (data.length) {
            validateExistingImages(data, setData);
        }
    }, [data.length]);

    const handleImageUpdate = async (itemId) => {
        const url = prompt("Paste image URL:");

        if (!url) return;

        const isValid = await isValidImageUrl(url);

        if (!isValid) {
            alert("The provided URL is not a valid or accessible image.");
            return;
        }

        try {
            const ref = doc(db, "summaries", itemId);
            await updateDoc(ref, { img: url });

            setData(prev =>
                prev.map(item =>
                    item.id === itemId ? { ...item, img: url } : item
                )
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update image.");
        }
    };


    if (loading || dataLoading) return null

    const filteredData = showOnlyMissingImages
        ? data.filter(item => !item.img)
        : data

    return (
        <div className={styles.main__container}>
            <div className={styles.summaries__wrapper}>
                <div className={styles.summaries__header}>
                    <h2>Game summaries</h2>
                    <label className={styles.toggle}>
                        <input
                            type="checkbox"
                            checked={showOnlyMissingImages}
                            onChange={() => setShowOnlyMissingImages(prev => !prev)}
                        />
                        Hide complete
                    </label>
                </div>
                <div className={styles.summaries}>
                    <div className={styles.list}>
                        {filteredData.length === 0 && (
                            <p className={styles.empty}>No items require attention 🎉</p>
                        )}

                        {filteredData.map(item => (
                            <div key={item.id} className={styles.item} onClick={() => setSelected(item)}>
                                <div className={styles.info}>
                                    <span className={styles.title}>{item.title}</span>
                                    {!item.img && (
                                        <span className={styles.badge}>Missing image</span>
                                    )}
                                </div>

                                <button
                                    className={styles.button}
                                    onClick={() => handleImageUpdate(item.id)}
                                >
                                    {item.img ? "Change image" : "Add image"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.display__wrapper}>
                <div className={styles.display} style={{ backgroundImage: `url(${selected?.img})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
            </div>
        </div>
    )
}
