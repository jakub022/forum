import { useParams } from "react-router";

export default function Post(){

    let {postId} = useParams()

    return (
        <div>
            <h1>Post with the id: {postId}</h1>
            <p>This is the post content</p>
            <p>User#22: Comment!</p>
        </div>
    );
}