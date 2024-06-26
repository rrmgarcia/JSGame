'use client';

import LoadingScreen from '@/components/Loading';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  if (session) {
    router.push('/chat');
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/chat', redirect: true });
  };

  const handleEmailSignIn = async () => {
    if (!email) {
      setEmailError(true);
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/',
      });
      console.log('Email sign-in result:', result);
      router.push('/chat');
      if (result?.error) {
        console.log('Error signing in with email:', result.error);
      } else {
        console.log('Check your email for the sign-in link.');
        router.push('/auth/email-check');
      }
    } catch (error) {
      console.error('Error during email sign-in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='h-full flex flex-col items-center justify-center px-4 bg-white'>
        <div className='text-center space-y-4 max-w-md mx-auto'>
          <h1 className='font-bold text-3xl text-[#2E2A47]'>Welcome Back!</h1>
          <p className='text-base text-[#7E8CA0] max-w-xs mx-auto'>Log in or create an account to continue learning with your AI Math Tutor!</p>
        </div>
        <div className='w-full max-w-md mt-8 bg-white border border-gray-300 shadow-lg rounded-lg px-8 py-10'>
          <div className='text-center mb-8'>
            <h2 className='font-semibold text-xl text-[#2E2A47]'>Sign in to Tutorial Center</h2>
            <p className='text-sm text-[#7E8CA0]'>Welcome back! Please sign in to continue</p>
          </div>
          <div className='mb-4'>
            <button
              onClick={handleGoogleSignIn}
              className='bg-white text-black font-semibold py-2 px-4 border border-gray-200 rounded-lg shadow w-full mb-4 flex items-center justify-center'
            >
              <FcGoogle className='text-xl' />
              <span className='ml-2'>Continue with Google</span>
            </button>
            <div className='flex items-center justify-center my-4'>
              <hr className='border-t border-gray-200 flex-grow mr-3' />
              <span className='text-gray-400'>or</span>
              <hr className='border-t border-gray-200 flex-grow ml-3' />
            </div>
            <div className='mb-4 text-muted-foreground'>
              <label htmlFor='email' className='block text-gray-700 text-sm mb-2'>
                Email address
              </label>
              <input
                id='email'
                className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-gray-400 ${
                  emailError ? 'border-rose-500' : ''
                }`}
                type='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
              />
            </div>
            <button
              onClick={handleEmailSignIn}
              className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline mt-6'
              type='button'
            >
              Continue
            </button>
          </div>
          {/* <div className='text-center mt-6'>
            <p className='text-gray-500 text-xs'>
              Don't have an account?{' '}
              <a href='/sign-up' className='text-blue-500 hover:underline'>
                Sign up
              </a>
            </p>
          </div> */}
        </div>
      </div>
      <div className='h-full bg-blue-600 hidden lg:flex items-center justify-center'>
        <div className='relative h-24 w-24'>
          <Image src='/logo.svg' layout='fill' objectFit='contain' alt='Logo' />
        </div>
      </div>
    </div>
  );
}
