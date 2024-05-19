"use client";
import React from "react";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase";
import { useRouter } from "next/navigation";

const Page = () => {
  const auth = getAuth(app);
  const router = useRouter();

  function logout() {
    auth.signOut();
    router.push("/");
  }

  return (
    <div className=" flex justify-center items-center w-[100vw] h-[100vh]">
      <button
        className=" bg-red-200 text-black px-8 py-4 hover:opacity-90 duration-200 inline"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default Page;
