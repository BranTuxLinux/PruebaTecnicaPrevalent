import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Financial Management System
      </h1>

      <div className="flex  gap-4">
        <Link href="/finances">
          <Button variant="outline" className="w-full h-24 text-xl">
            Manage Finances
          </Button>
        </Link>
        <Link href="/users" className={`${!isAdmin && "hidden"}`}>
          <Button variant="outline" className={`w-full h-24 text-xl `}>
            Manage Users
          </Button>
        </Link>
        <Link href="/reports" className={`${!isAdmin && "hidden"}`}>
          <Button variant="outline" className="w-full h-24 text-xl">
            View Reports
          </Button>
        </Link>
      </div>
    </div>
  );
}
