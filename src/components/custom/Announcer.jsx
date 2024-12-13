import React from 'react'

const Announcer = ({user='Rajan'}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r animate-fade-in">
    <div className=" animate-scale-in">
      <img 
        src="./1.gif" 
        alt="announcer" 
        className="w-44 h-44 object-cover rounded-full "
      />
    </div>
    <span className="text-xl decoration-wavy underline decoration-teal-500 font-bold text-blue-500 rounded-md animate-slide-up">
      Welcome, {user}!
    </span>
  </div>
  )
}

export default Announcer