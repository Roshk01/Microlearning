'use client'
import React, { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { app } from '@/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'

const SignIn = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('lo')

    try {
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        alert('login successfull')
        router.push('/chatRoom')
      }
    } catch (error) {
      alert("Bad user credentials");
    }
  };
  const handleGoogleAuth = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDetails = {
        name: user.displayName,
        email: user.email
      };

      alert('Sign-up successful!');
      router.push('/chatRoom')
    } catch (error) {
      console.error(error);
      alert('Something went wrong with Google sign-in. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}

      className='SignInDiv flex flex-col justify-between items-center h-full w-full pt-10'>
      <Link href={'/'}> <p className='font-bold text-4xl mt-6 mb-4'>MicroLearning</p></Link>

      <form className='min-h-[60vh] mt-4 flex flex-col gap-4 shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 duration-200 ease-in-out p-4 w-[60%] items-center lg:w-[40%]' onSubmit={onSubmit}>
        <input className='p-2 w-full rounded-sm text-black outline-none' type="email" placeholder='Email' id="email" value={email} onChange={onChange} required />
        <input className='p-2 rounded-sm w-full text-black outline-none' type="password" placeholder='Password' id='password' value={password} onChange={onChange} required />

        <div className='w-full h-full text-center flex flex-col gap-4 mt-4'>
          <button className="bg-blue-500 w-[100%] py-2 rounded-sm hover:bg-blue-600 duration-150 ease-in-out" type='submit'>Sign-in</button>

          <Link href='/signUp'>
            <button className="text-black bg-white w-[100%] py-2 rounded-sm hover:bg-slate-200 duration-150 ease-in-out" type='button'>Sign-Up</button>
          </Link>

          <p>OR</p>
          <button
            onClick={handleGoogleAuth}
            className="text-black bg-white w-[100%] py-2 rounded-sm hover:bg-slate-200 duration-150 ease-in-out flex justify-center items-center gap-2" type='button'>Continue with Google <FcGoogle /></button>
        </div>
      </form>
    </motion.div>
  );
};

export default SignIn;
