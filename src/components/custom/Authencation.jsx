"use client";
import React, { useEffect, useState } from 'react';
import {
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/configs/Firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clover, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/provider/AuthProvider';
import Loader from './Loader';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { faker } from '@faker-js/faker';


export default function Authentication() {
  const [activeTab, setActiveTab] = useState('google');
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, authUser ,setIsLoading } = useAuth();

  // Form state for email login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {

    const configurePersistence = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (err) {
        console.error("Error setting persistence", err);
      }
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });

    if (initializing) {
      setInitializing(false);
    }

    configurePersistence(); // Ensure persistence is set


    return () => {
      unsubscribe();
    };
  }, [initializing]);

  const signInWithGoogle = async () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists, create a profile if not
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // User doesn't exist, create a profile in the database
        await userRef.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
      setIsLoading(false)
      // User is signed in, navigate to the main app or dashboard
    } catch (err) {
      setError('Failed to sign in with Google.');
    }finally{
    setIsLoading(false)
    }
  };

  const signInWithEmail = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Failed to sign in with email and password.');
    }
  };

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Failed to sign up with email and password.');
    }
  };

  const VerifyToken = async(invite)=>{
    try {
      const userDocRef = doc(db, "users", invite); 
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("Invalid invite UID: No matching user found!");
        return true;
      }
      console.log("Valid invite UID! User can join.");
    } catch (error) {
      return false ;
    }
  }
  
  // useEffect(() => {
  //   const room = searchParams.get('room'); // Get "room" from URL
  //   const invite = searchParams.get('invite'); // Get "invite" from URL
    
  //   if (!room || !invite) return; // Exit early if room or invite is missing
    
  //   const randomName = faker.name.fullName(); // Generate a random full name
  //   const checkInvite = async () => {
  //     const isValidInvite = await VerifyToken(invite); // Wait for verification to complete
  //     if (!isValidInvite) {
  //       console.error("Invalid invite UID. User cannot join.");
  //       return; // If the invite is not valid, stop further execution
  //     }

  //     if (!authUser) {
  //       setIsLoading(true);
  //       signInAnonymously(auth)
  //         .then((userCredential) => {
  //           console.log('Signed in anonymously');
  //           const user = userCredential.user;

  //           // Update the user's profile with the fake name
  //           return updateProfile(user, { displayName: randomName });
  //         })
  //         .then(() => {
  //           console.log('User profile updated with random name');
  //         })
  //         .catch((error) => {
  //           console.error('Error signing in anonymously or updating profile:', error);
  //         })
  //         .finally(() => {
  //           setIsLoading(false);
  //         });
  //     }

  //     // Firestore logic to add user to the room
  //     if (authUser) {
  //       const roomDocRef = doc(db, 'rooms', room);
  //       const userDocRef = doc(db, 'rooms', room, 'users', authUser?.uid || invite);

  //       getDoc(roomDocRef).then((roomDoc) => {
  //         if (roomDoc.exists()) {
  //           setDoc(userDocRef, {
  //             email: authUser?.email || `${randomName.replace(/\s+/g, '.').toLowerCase()}@anonymous.com`,
  //             joinedAt: serverTimestamp(),
  //           });
  //         } else {
  //           console.error('Room does not exist!');
  //         }
  //       });
  //     }
  //   };

  //   checkInvite(); // Call the function to verify invite and proceed

  // }, [authUser, searchParams]); // Only re-run if authUser or searchParams change

  useEffect(() => {
    const room = searchParams.get("room"); // Get "room" from URL
    const invite = searchParams.get("invite"); // Get "invite" from URL
  
    if (!room || !invite) {
      console.error("Missing room or invite parameters. Access denied.");
      return; // Exit early if room or invite is missing
    }
  
    const randomName = faker.name.fullName(); // Generate a random full name
  
    const checkInvite = async () => {
      try {
        const isValidInvite = await VerifyToken(invite); // Validate invite token
  
        if (!isValidInvite) {
          console.error("Invalid invite UID. User cannot join.");
          return; // If invite is invalid, stop further execution
        }
  
        console.log("Valid invite UID. Proceeding with access.");
  
        if (!authUser) {
          console.log("No authenticated user. Signing in anonymously...");
          setIsLoading(true);
  
          // Anonymous sign-in
          const userCredential = await signInAnonymously(auth);
          console.log("Signed in anonymously");
  
          // Update the user's profile with a fake name
          const user = userCredential.user;
          await updateProfile(user, { displayName: randomName });
          console.log("User profile updated with random name");
  
          setIsLoading(false);
        }
  
        if (authUser) {
          console.log("Authenticated user detected. Adding to Firestore...");
          
          const roomDocRef = doc(db, "rooms", room);
          const userDocRef = doc(db, "rooms", room, "users", authUser.uid);
  
          const roomDoc = await getDoc(roomDocRef);
  
          if (roomDoc.exists()) {
            console.log("Room exists. Adding user to the room...");
            await setDoc(userDocRef, {
              email: authUser.email || `${randomName.replace(/\s+/g, '.').toLowerCase()}@anonymous.com`,
              joinedAt: serverTimestamp(),
            });
            console.log("User added to the room successfully.");
          } else {
            console.error("Room does not exist!");
          }
        }
      } catch (error) {
        console.error("Error during invite validation or user processing:", error);
      }
    };
  
    checkInvite(); // Call the function to verify invite and proceed
  }, [authUser, searchParams]);
  

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);


  return isLoading || (!isLoading && authUser) ? (
    <Loader />
) : (
    <div className="c-container flex flex-col">
      <div className="flex items-center justify-center h-svh sm:min-h-screen ">
        <Card className="sm:w-[430px] w-[330px] shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              Welcome to Bond <Clover className="ml-2" />
            </CardTitle>
            <CardDescription className="text-center">
              Connect, Chat, and Bond with your friends and community. Log in to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="google">
                <Button className="w-full mt-4" onClick={signInWithGoogle}>
                  <img src="./gogle.svg" alt="Google" className="w-4 h-4 object-cover" />
                  Login with Google
                </Button>
              </TabsContent>

              {/* Log In with Email */}
              <TabsContent value="login">
                <form onSubmit={signInWithEmail}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                  <Button className="w-full mt-4" type="submit">
                    <Mail className="mr-2 h-4 w-4" />
                    Log In with Email
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Form */}
              <TabsContent value="signup">
                <form onSubmit={signUpWithEmail}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    <Mail className="mr-2 h-4 w-4" />
                    Sign Up with Email
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              By signing up, you agree to our Terms and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
