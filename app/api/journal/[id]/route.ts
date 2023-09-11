import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, { params }) => {
    const user = await getUserByClerkID()
    const { content } = await request.json()
    const updatedEntry = await prisma.journalEntry.update({
        where: {
            userId_id: {
                userId: user.id,
                id: params.id,
            }
        },
        data: {
            content: content
        }
    })

    return NextResponse.json({ data: updatedEntry })
}