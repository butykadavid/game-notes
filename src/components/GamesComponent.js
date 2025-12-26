import { db } from "../../public/firebase";
import { collection, getDocs, orderBy, query, limit, where } from "firebase/firestore";
import { getColor, redirectToPage } from "../../public/functions";

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Title from "./TitleComponent";

import styles from '../../styles/homepage/gamesComponent.module.css';
import loaderStyles from "../../styles/loader.module.css"

import { useRouter } from "next/router";

export default function GamesComponent({ searchWord }) {

    const [items, setItems] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [index, setIndex] = useState(25)

    const router = useRouter()

    const fetchData = async () => {

        var q;
        if (searchWord) {
            q = query(collection(db, 'summaries'), where('searchArray', 'array-contains', `${searchWord.toLowerCase()}`), limit(index))
        } else {
            q = query(collection(db, 'summaries'), orderBy('count', 'desc'), limit(index))
        }
        const docs = await getDocs(q)

        const data = docs.docs.map(d => {
            return { ...d.data() }
        })

        data.length < index ? setHasMore(false) : setHasMore(true)

        setItems(data)

        setIndex((prev) => prev + 10)
    }

    useEffect(() => {
        fetchData()
    }, [searchWord])

    if (items.length === 0) {
        return <>
            <div className={styles.main__container}>

                {searchWord ?
                    <Title text={`Games searched: ${searchWord}`} />
                    :
                    <Title text={'GameNotes Reviews'} />
                }

                <h2 className={styles.no__results__text}>{`No results :(`}</h2>
            </div>
        </>
    }

    return (

        <div className={styles.main__container}>

            {searchWord ?
                <Title text={`Games searched: ${searchWord}`} />
                :
                <Title text={'GameNotes Reviews'} />
            }

            <InfiniteScroll
                dataLength={items.length}
                next={fetchData}
                hasMore={hasMore}
                loader={
                    <div className={loaderStyles.loading__container}>
                        <h1 className={loaderStyles.loading__title}>Loading</h1>
                        <div className={loaderStyles.loading__circle}></div>
                    </div>
                }
            >
                <div className={styles.title__container}>

                    {
                        items.map(item => {
                            return (
                                <div key={`${item.title}`} onClick={() => redirectToPage(router, `/games/${item.title}`, { title: `${item.title}` })}>
                                    <h1 className={styles.item__box}>{item.title}</h1>
                                    <p>Average rating <span style={{ color: `${getColor(item.average)}` }}>{item.average}</span></p>
                                    <p>Reviews <span>{item.count}</span></p>
                                </div>)
                        })
                    }

                </div>
            </InfiniteScroll>

        </div>

    )
}