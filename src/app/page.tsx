import { auth } from "@/auth";
import { GetUsers } from "@/components/getUsers";
import SignOut from "@/components/sign-out";
import SignIn from "@/components/sing-in";

export default async function Home() {
  const session = await auth()
  if (session) {
    return (
      <main>
        <h1>HomePage</h1>
        <p>Welcome {session?.user?.name}</p>
        <SignOut />
        <GetUsers />
        
      </main>
    );
  }
  return (
    <main>
      <h1>HomePage</h1>
      <SignIn />
    </main>
  );
}
