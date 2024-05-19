"use client";
import { app } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import ScrollableFeed from "react-scrollable-feed";
import axios from "axios";
import { motion } from "framer-motion";

const ChatRoom = () => {
  const auth = getAuth(app);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        router.push("/");
      }
    });
  }, [auth]);

  const getData = async () => {
    try {
      setLoading(true);
      setQuery2(query);
      setData();
      const response = await axios.post(
        `http://127.0.0.1:8000/process_query?query=${encodeURIComponent(query)}`
      );
      setData(response.data);
      console.log(response.data);
      setLoading(false);
      setQuery("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-[100vh] w-full flex flex-col items-center px-4">
      <div className=" pt-12 mt-4 pb-4   md:w-[70vw] h-[80vh] overflow-auto">
        <div className="">
          {!data ? (
            <p className="  flex justify-center item-center pt-[9rem] font-bold text-5xl md:text-8xl lg:text-7xl">
              {loading ? (
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              ) : (
                " MicroLearning"
              )}
            </p>
          ) : (
            <motion.div>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className=" text-xl pb-4"
              >
                Query : <span className=" text-xl text-red-300">{query2}</span>
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className=" pt-4 bg-slate-200 text-black shadow-md rounded-md px-2"
              >
                {" Micro AI:"}
                <br />
                {data.creative_text}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="font-bold pt-4 pb-4"
              >
                Related Links:
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6 }}
              >
                {data.related_links.map((linkGroup, linkGroupIndex) => (
                  <div key={linkGroupIndex}>
                    {linkGroup.links.map((link, linkIndex) => {
                      const parts = link.split(": ");
                      const linkType = parts[0];
                      const linkUrl = parts[1];
                      return (
                        <li
                          className="border-b-2 mb-2 text-blue-300"
                          key={`${linkGroupIndex}-${linkIndex}`}
                        >
                          <Link
                            className="hover:text-red-300 duration-150"
                            href={linkUrl}
                          >
                            <span style={{ color: "white" }}>{linkType}: </span>
                          </Link>
                          {/* <br /> */}
                          <Link href={linkUrl}>{linkUrl}</Link>
                        </li>
                      );
                    })}
                  </div>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </div>
      </div>
      <div className="w-[90%] h-[10%] rounded-xl absolute bottom-6 bg-white flex justify-between items-center px-4">
        <input
          className="w-full p-4 rounded-3xl outline-none text-black"
          type="text"
          placeholder="Start typing....."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <IoSend
          onClick={getData}
          className="text-black text-3xl cursor-pointer"
        />
      </div>

      <button
        onClick={() => router.push("/")}
        className="absolute top-2 left-0 bg-white text-black px-2 py-2 rounded-md hover:opacity-80 duration-200"
      >
        MicroLearning
      </button>
    </div>
  );
};

export default ChatRoom;
