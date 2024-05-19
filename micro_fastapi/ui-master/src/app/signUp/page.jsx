'use client'
import React, { useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup, updateProfile } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { app } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion'

const SignIn = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth(app);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(auth.currentUser, {
                displayName: name,
            });

            alert('Sign-up successful!');
            router.push('/signIn');
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
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
            navigate('/chatRoom');
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

            <form className='min-h-[60vh] mt-2 flex flex-col gap-4 shadow-md shadow-gray-500 hover:shadow-lg hover:shadow-gray-500 duration-200 ease-in-out px-4 py-2 w-[60%] items-center lg:w-[40%] rounded-md' onSubmit={handleSubmit}>
                <input className='p-2 w-full rounded-sm text-black outline-none' type="text" placeholder="User name" id="name" value={name} onChange={handleChange} />
                <input className='p-2 w-full rounded-sm text-black outline-none' type="email" placeholder="Email" id="email" value={email} onChange={handleChange} />
                <input className='p-2 w-full rounded-sm text-black outline-none' type="password" placeholder="Password" id="password" value={password} onChange={handleChange} />

                <div className='w-full h-full text-center flex flex-col gap-4 mt-2'>
                    <button className="bg-blue-500 w-[100%] py-2 rounded-sm hover:bg-blue-600 duration-150 ease-in-out" type='submit'>Sign-up</button>
                    <button className="text-black bg-white w-[100%] py-2 rounded-sm hover:bg-slate-200 duration-150 ease-in-out flex justify-center items-center gap-2" type='button' onClick={handleGoogleAuth}>Continue with Google <FcGoogle /></button>
                </div>
            </form>
        </motion.div>
    );
};

export default SignIn;
