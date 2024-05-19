"use client";
import Navbar from "@/components/Navbar";
import { app } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const auth = getAuth(app);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        // router.push("/chatRoom");
      } else {
        setLoggedIn(false);
      }
    });
  }, [auth]);

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className=" flex flex-col  items-center w-full h-[80vh] pt-[6rem]"
      >
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className=" text-5xl font-bold"
        >
          MicroLearning UI
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
          className=" mt-4 font-semibold text-2xl"
        >
          Connect with AI Model.
        </motion.p>

        <Link href={loggedIn ? "/chatRoom" : "/signIn"}>
          <button className=" bg-blue-500 mt-8 px-6 py-4 rounded-md font-semibold text-lg capitalize hover:bg-blue-600 duration-200 ease-in-out">
            Start chating
          </button>
        </Link>
      </motion.main>
    </>
  );
}
