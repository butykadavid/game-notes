import PostComponent from "./PostComponent"

export default function NewsFeedComponent({ posts }) {
    return <div style={{padding: '25px 5vw'}}>
        {posts.map((p, index) => {
            return (
                <div key={index}>
                    <PostComponent postData={p} />
                </div>
            )
        })}
    </div>
}