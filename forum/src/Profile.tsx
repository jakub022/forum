import { useParams } from "react-router";

export default function Profile(){

    let {profileId} = useParams()

    return (
        <div>
            <h1>Name: John Doe</h1>
            <p>Profile id: {profileId}</p>
            <p>Accout age: 5 days</p>
        </div>
    );
}