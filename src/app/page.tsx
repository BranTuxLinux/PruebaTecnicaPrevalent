import { auth } from "@/auth";
import { GetUsers } from "@/components/getUsers";
import SignOut from "@/components/sign-out";
import SignIn from "@/components/sing-in";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {

  const session = await auth();
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Financial Management System
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/finances">
          <Button variant="outline" className="w-full h-24 text-xl">
            Manage Finances
          </Button>
        </Link>
        <Link href="/users">
          <Button variant="outline" className="w-full h-24 text-xl">
            Manage Users
          </Button>
        </Link>
        <Link href="/reports">
          <Button variant="outline" className="w-full h-24 text-xl">
            View Reports
          </Button>
        </Link>
      </div>
    </div>
  );
}
