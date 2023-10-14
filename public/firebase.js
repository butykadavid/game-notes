import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from './firebaseConfig'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)
const storage = getStorage(app);

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                createdAt: new Date().getTime()
            });
        }
    } catch (err) {
        console.error(err);
    }
}

const signOutFunc = () => {
    signOut(auth).then(() => {
        console.log("Sign out successful")
    }).catch((error) => {
        console.error(err);
    });
}

export {
    auth,
    db,
    storage,
    signInWithGoogle,
    signOutFunc,
};