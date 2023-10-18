import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [firstChat, setFirstChat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { userId } = await auth();
      setIsAuth(!!userId);
      setIsPro(await checkSubscription());

      if (userId) {
        const chatsResult = await db.select().from(chats).where(eq(chats.userId, userId));
        if (chatsResult) {
          setFirstChat(chatsResult[0]);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat mit jedem PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Gehe zu Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  <SubscriptionButton isPro={isPro} />
                </div>
              </>
            )}
          </div>
          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Tritt Millionen von Studenten, Forschern und Fachleuten bei, um sofort Fragen zu beantworten und Forschung mit KI zu verstehen.
          </p>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Einloggen, um zu starten!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
