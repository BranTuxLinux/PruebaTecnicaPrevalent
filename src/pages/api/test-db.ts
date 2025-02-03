//@ts-ignore
import { prisma } from "@/lib/prisma";


export default async function handler(req: any, res:any) {
  try {
    await prisma.$connect();
    const data = await prisma.user.findMany()
    res.status(200).json({ success: true, data,url :process.env.POSTGRES_PRISMA_URL });
  } catch (error :any) {
    res.status(500).json({ error: error.message });
  }
}