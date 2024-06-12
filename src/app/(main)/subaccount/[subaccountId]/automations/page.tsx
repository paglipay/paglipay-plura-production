"use client";

import BlurPage from "@/components/global/blur-page";
import { Button } from "@/components/ui/button";
import MediaComponent from "@/components/media";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ExternalLink, LucideEdit } from "lucide-react";
import { getMedia } from "@/lib/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect, useRef } from "react";
import CreateButton from "./_components/create-contact-btn";
import {
  DragDropContext,
  DragStart,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
// import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FunnelStepCard from "./_components/funnel-step-card";
import FunnelPagePlaceholder from "@/components/icons/funnel-page-placeholder";

type Props = {
  params: { subaccountId: string };
};

const AutomationsPage = async ({ params }: Props) => {
  const inputRef = useRef(null);
  const [port, setPort] = useState<any | null>(null);
  const [reader, setReader] = useState<any | null>(null);
  const data = await getMedia(params.subaccountId);

  async function disconnectSerial() {
    if (!port) {
      console.error("Serial port not connected.");
      return;
    }
    if (!reader) {
      console.error("Reader not available.");
      return;
    }
    // setDtree((dtree) => {
    //   return {
    //     ...dtree,
    //     output: [...dtree["output"], "Disconneciting...\n"],
    //   };
    // });

    try {
      await reader.cancel();
      await port.close();
      console.log("Disconnected from serial port.");
      setPort(null);
      // setConnected(false);
    } catch (error) {
      console.error("Error disconnecting from serial port:", error);
      // setConnected(true);
    }
  }

  async function connectSerial() {
    let selectedPort;

    try {
      selectedPort = await (navigator as any).serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      console.log("Connected to serial port:", selectedPort);
      // startReading(selectedPort);
      setPort(selectedPort);
      // setConnected(true);
      // setIsHost(props.id);
    } catch (err) {
      console.error("Error connecting to serial port:", err);
      // setConnected(false);
    }
  }

  return (
    <BlurPage>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <div className="flex border-[1px] lg:!flex-row flex-col ">
            <aside className="flex-[0.3] bg-background p-6  flex flex-col justify-between ">
              <ScrollArea className="h-full ">
                <div className="flex gap-4 items-center">
                  <Check />
                  Funnel Steps
                </div>
                {false ? (
                  <></>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No Pages
                  </div>
                )}
              </ScrollArea>
            </aside>
            <aside className="flex-[0.7] bg-muted p-4 ">
              <Card className="h-full flex justify-between flex-col">
                <CardHeader>
                  <p className="text-sm text-muted-foreground">Page name</p>
                  <CardTitle>TITLE</CardTitle>
                  <CardDescription className="flex flex-col gap-4">
                    <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                      <div className="cursor-pointer group-hover:opacity-30 w-full">
                        <FunnelPagePlaceholder />
                      </div>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardDescription>
                          <div className="border-2 rounded-lg sm:w-80 w-full  overflow-clip">
                            qwe
                          </div>
                          <div className="flex flex-col gap-4 h-full w-full">
                            <div className="flex justify-between items-center">
                              <h1 className="text-4xl">Media Bucket</h1>
                              <CreateButton
                                subaccountId={params.subaccountId}
                              />
                              <Button
                                style={{ marginTop: "auto" }}
                                id="connectButton"
                                onClick={async () => {
                                  await connectSerial();
                                }}
                              >
                                Connect to Local Serial Console
                              </Button>
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </CardDescription>
                </CardHeader>
              </Card>
            </aside>
          </div>
        </TabsContent>
        <TabsContent value="settings"></TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default AutomationsPage;
