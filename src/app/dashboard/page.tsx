import Dashboard from "@/components/dashboard";
import { getUser } from "@/lib/dal";
import React from "react";

export default async function page() {
  const { success, message, data }: any = await getUser();

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-12 bg-gray-100">
      {success === false && <div className="text-red-500">{message}</div>}

      {success === true && data && <Dashboard user={data} />}
    </div>
  );
}
