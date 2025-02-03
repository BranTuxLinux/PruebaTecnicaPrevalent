import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarMenu } from "@/components/tools/avatar-menu";
import SignIn from "@/components/sing-in";
export const HeaderComponent = async () => {
  const session = await auth();
  return (
    <header className=" flex bg-secondary gap-5 p-5 justify-end flex-row ">
      {session?.user ? (
        <AvatarMenu user={session?.user}>
          <section className="flex gap-4">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={session?.user?.image}
                alt={session?.user.name}
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user.name}
              </span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </section>
        </AvatarMenu>
      ) : (
        <Button asChild>
          <SignIn />
        </Button>
      )}
    </header>
  );
};
