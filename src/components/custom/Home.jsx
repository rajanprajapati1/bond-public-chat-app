'use client';
import React, { useEffect } from 'react';
import ChatInterface from './AppSideBar';
import { useAuth } from '@/provider/AuthProvider';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

const Home = () => {
  const router = useRouter();
  const { isLoading, authUser } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!authUser) {
        router.push('/auth'); // Redirect to the auth page if no user
      }
    }
  }, [authUser, isLoading, router]);

  return isLoading || (!isLoading && !authUser) ? (
    <Loader />
  ) : (
    <div className="c-container flex items-center justify-center h-screen">
      <ChatInterface />
    </div>
  );
};

export default Home;
