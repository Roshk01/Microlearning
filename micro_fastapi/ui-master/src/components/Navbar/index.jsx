"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const auth = getAuth(app);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        // router.push("/signIn");
      }
    });
  }, [auth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.3 }}
      className="  text-white h-[4rem] w-full flex justify-between items-center px-4"
    >
      <div className="logo  ">
        <p className=" font-semibold text-2xl">MicroLearning</p>
      </div>
      <div className="nav_items ">
        <ul className="flex justify-between items-center gap-8">
          <li>About us</li>
          <li>Contact</li>
          <li>
            <button className=" bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 duration-200 ease-in-out">
              <Link href={`${loggedIn ? "/profile" : " /signIn"}`}>
                {loggedIn ? " Profile" : "Login"}
              </Link>
            </button>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Navbar;
