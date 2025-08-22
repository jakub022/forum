import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import pfp1 from "@/assets/pfps/pfp1.svg";
import pfp2 from "@/assets/pfps/pfp2.svg";
import pfp3 from "@/assets/pfps/pfp3.svg";
import pfp4 from "@/assets/pfps/pfp4.svg";
import pfp5 from "@/assets/pfps/pfp5.svg";
import pfp6 from "@/assets/pfps/pfp6.svg";
import pfp7 from "@/assets/pfps/pfp7.svg";

interface ProfilePictureProps{
    id: string
}

const images = [pfp1, pfp2, pfp3, pfp4, pfp5, pfp6, pfp7];

function hashString(str: string): number {
    let hash = 0;
    for (const char of str) {
        hash = (hash << 5) - hash + char.charCodeAt(0);
        hash |= 0;
    }
    return Math.abs(hash);
}

export default function ProfilePicture({id} : ProfilePictureProps){
    return (
        <Avatar>
            <AvatarImage src={images[hashString(id) % images.length]} />
            <AvatarFallback>PFP</AvatarFallback>
        </Avatar>
    );
}