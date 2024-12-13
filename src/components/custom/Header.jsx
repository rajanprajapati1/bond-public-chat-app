import React from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {LogOut,  Users, MoreVertical, Bell, Settings, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { faker } from '@faker-js/faker'

const Header = ({live ,activeList}) => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
    <div className="flex items-center space-x-2">
<div className="box flex flex-col items-start">
<h1 className="text-2xl font-extrabold text-indigo-600">Welcome to Bond</h1>
<p className="text-sm text-gray-600 ">Where Conversations Build Connections</p>
</div>
   
    </div>
    <div className="flex items-center space-x-5">
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 relative">
              {activeList?.length > 1 && <div className="green_dots absolute z-20 top-1 left-2 w-2 h-2 rounded-full bg-green-500"/>}
              <Users className="h-4 w-4" />
              <span className="text-sm">{live}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-full">
          {activeList && activeList?.map((user) => {
  const defaultName = faker.name.firstName(); // Generate a random name using Faker
  const fallbackLetter = user?.email?.charAt(0) || user?.name?.charAt(0) || defaultName.charAt(0);

  return (
    <DropdownMenuItem key={user.id} className="flex items-center w-full space-x-2">
      <Avatar className="h-6 w-6 flex items-center justify-center uppercase font-bold">
        <AvatarImage src={user?.avatar} alt={user?.name || defaultName} />
        <AvatarFallback>{fallbackLetter}</AvatarFallback>
      </Avatar>
      <span>{user?.email || `${defaultName}@default.com`}</span>
    </DropdownMenuItem>
  );
})}

          </DropdownMenuContent>
        </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Leave Chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>

  )
}

export default Header