
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
 

  return (
    <main className="min-h-screen flex items-center justify-center p-24">
      <div>
        <h1 className="text-3xl font-bold my-5 text-center">Welcome to Next.JS Authentication</h1>

       <div className="flex justify-center items-center gap-6">
        <Link href={"/register"} > <Button>Register</Button></Link>
        <Link href={"/login"} > <Button variant={'outline'}>Login</Button></Link>
    
       </div>
      </div>
    </main>
  );
}
