import React from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {LogOut,  Users, MoreVertical, Bell, Settings, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const Header = ({live ,activeList}) => {
  console.log(activeList,"list")
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
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">{live}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {activeList && activeList?.map((user) => (
              <DropdownMenuItem key={user.id} className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.avatar} alt={user.name} />
                  <AvatarFallback>{user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user?.email}</span>
              </DropdownMenuItem>
            ))}
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