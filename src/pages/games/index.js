import GamesComponent from "../../components/GamesComponent";
import Head from "next/head"

export default function GamesPage({ searchWord }) {

    return (
        <>
            {searchWord ?
                <Head>
                    <title>GameNotes | Search</title>
                    <meta name="description" content={`Search results for "${searchWord}"`} />
                    <meta name="keywords" content={`Search, Result, Game, Games, Review, Videogame, ${searchWord}`}/>
                </Head>
                :
                <Head>
                    <title>GameNotes | Games</title>
                    <meta name="description" content="All games" />
                    <meta name="keywords" content="Search, Result, Game, Games, Review, Videogame"/>
                </Head>
            }
            <GamesComponent searchWord={searchWord} />
        </>
    )
}

export const getServerSideProps = async (context) => {
    var searchWord = context.query.searchWord

    if (!searchWord) searchWord = ""

    return {
        props: {
            searchWord
        }
    }
}