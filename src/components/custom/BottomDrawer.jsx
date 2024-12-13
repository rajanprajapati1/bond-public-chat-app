"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function BottomDrawer({ inviteLink }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Invite</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center">
            <DrawerTitle>Invite to Chat</DrawerTitle>
            <DrawerDescription>Scan this QR code to join the chat</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 flex justify-center">
            <QRCodeSVG value={inviteLink} size={200} />
          </div>
          <DrawerFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mb-4 break-all">{inviteLink}</p>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
