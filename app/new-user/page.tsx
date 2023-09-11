import { prisma } from "@/utils/db"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const createNewUser = async () => {
    // Should never be null since you have to be authenticated to reach this page
    const user = await currentUser()

    const match = await prisma.user.findUnique({
        where: {
            clerkId: user.id as string,
        }
    })

    // If there was no match, this is a brand new user
    if (!match) {
        await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user?.emailAddresses[0].emailAddress
            }
        })
    }

    redirect('/journal')
}

// Essentially is just a route
const NewUser = async () => {
    await createNewUser()
    return <div>...loading</div>
}

export default NewUser