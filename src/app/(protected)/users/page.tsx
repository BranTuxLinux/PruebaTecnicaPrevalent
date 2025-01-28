import { auth } from "@/auth"
import { User } from "@/components/users-components"

export default async function Users() {
    const session = await auth()
    return <User user={session?.user}/>
}