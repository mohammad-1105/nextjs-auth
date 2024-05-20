"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function Dashboard({ user }: { user: any }) {
  const [logginOut, setLogginOut] = useState<boolean>(false);
  const [deletingAcc, setDeletingAcc] = useState<boolean>(false);
  const router = useRouter();

  // handle logout
  const logout = async () => {
    try {
      setLogginOut(true);
      const response = await axios.get<ApiResponse>("/api/users/logout");

      toast.success("Success", {
        description: response.data.message,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });

      // redirect to login
      router.push("/login");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed", {
        description: axiosError.response?.data.message,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });
    } finally {
      setLogginOut(false);
    }
  };

  // handle delete account
  const deleteAccount = async () => {
    try {
      setDeletingAcc(true);
      const response = await axios.delete<ApiResponse>(
        "/api/users/delete-account"
      );

      toast.success("Success", {
        description: response.data.message,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });

      // redirect to login
      router.push("/register");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed", {
        description: axiosError.response?.data.message,
        action: {
          label: "close",
          onClick: () => console.log("close"),
        },
      });
    } finally {
      setDeletingAcc(false);
    }
  };
  return (
    <div className="">
    <div className="w-full max-w-fit fixed top-4 left-4 right-4">
    <Alert className="bg-orange-500">
      <AlertTitle>Ek Guzarish hai !</AlertTitle>
      <AlertDescription>
        Please delete your account whenever you leave this site.
      </AlertDescription>
    </Alert>
    </div>
    <div className="border rounded-md p-4 bg-slate-200 w-full max-w-fit">
      <h1 className="mb-4 font-bold text-xl text-center">User</h1>
      <div>
        <h1>Welcome {user.name}</h1>
        <p>
          <span className="font-bold">Id:</span> {user._id}
        </p>
        <p>
          <span className="font-bold">Email:</span> {user.email}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center gap-12">
        <Button
          onClick={logout}
          aria-disabled={logginOut}
          variant={"destructive"}
        >
          {logginOut ? "Logging out..." : "Logout"}
        </Button>
        <Button
          onClick={deleteAccount}
          aria-disabled={deletingAcc}
          variant={"destructive"}
        >
          {deletingAcc ? "Deleting account..." : "Delete Account"}
        </Button>
      </div>
    </div>
    </div>
  );
}
