import { analyze } from "@/utils/ai"
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

    const analysis = await analyze(updatedEntry.content)

    // Upsert is saying if you find it, update it. If you don't find it, create a new one
    const updated = await prisma.analysis.upsert({
        where: {
            entryId: updatedEntry.id
        },
        create: {
            userId: user.id,
            entryId: updatedEntry.id,
            ...analysis
        },
        update: analysis,
    })

    return NextResponse.json({ data: {...updatedEntry, analysis: updated} })
}