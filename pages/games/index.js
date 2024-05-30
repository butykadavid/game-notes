import GamesComponent from "../../components/GamesComponent";

export default function GamesPage({searchWord}) {

    return (

        <GamesComponent searchWord={searchWord}/>

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