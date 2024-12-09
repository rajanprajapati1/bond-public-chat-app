   {/* {user && <Channel user={user} db={db}/>} */}
     {/* <Chan user={user}/> */}
     <main className="flex-grow container max-w-6xl mx-auto px-2 py-14 flex items-center justify-center">
     <Card className="w-full mx-auto shadow-lg">
       <CardContent className="p-8 grid md:grid-cols-2 gap-8">
         <div className="space-y-6">
           <div className="space-y-2">
             <h1 className="text-3xl font-light text-[#41525d] dark:text-white">Log into WhatsApp Web</h1>
             <p className="text-[#41525d] dark:text-gray-300">
               Message privately with friends and family using WhatsApp on your browser.
             </p>
           </div>

           <ol className="list-decimal list-inside space-y-6 text-[#41525d] dark:text-gray-300">
             <li>Open WhatsApp on your phone</li>
             <li>
               Tap Menu <span className="inline-block px-2 py-0.5 bg-gray-100 rounded dark:bg-gray-800">⋮</span> on
               Android, or Settings <span className="inline-block px-2 py-0.5 bg-gray-100 rounded dark:bg-gray-800">⚙️</span> on iPhone
             </li>
             <li>Tap Linked devices and then Link a device</li>
             <li>Point your phone at this screen to scan the QR code</li>
           </ol>

           <div className="space-y-4">
             <div className="flex items-center space-x-2">
               <Checkbox id="stay-logged-in" className="border-[#008069] data-[state=checked]:bg-[#008069] data-[state=checked]:text-white" />
               <label
                 htmlFor="stay-logged-in"
                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#41525d] dark:text-gray-300"
               >
                 Stay logged in on this browser
               </label>
             </div>

             <div className="space-y-2">
               <Link
href={'/'}
                 className="text-[#008069] dark:text-[#0aa183] hover:underline inline-flex items-center gap-1 text-sm"
               >
                 Need help getting started?
                 <ExternalLink className="h-3 w-3" />
               </Link>
               <Link
               href={'/'}
                 className="text-[#008069] dark:text-[#0aa183] hover:underline block text-sm"
               >
                 Log in with phone number
               </Link>
             </div>
           </div>
         </div>

         <div className="flex items-center justify-center">
           <QrWa />
         </div>
       </CardContent>
     </Card>
   </main>

   {/* Footer */}
   <footer className="p-4 text-center text-sm text-[#41525d] dark:text-gray-400">
     <p className="flex items-center justify-center gap-1">
       <Lock className="h-4 w-4" />
       Your personal messages are end-to-end encrypted
     </p>
   </footer>