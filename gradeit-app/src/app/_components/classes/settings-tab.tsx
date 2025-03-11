"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCw, Trash2, Save, Link, Key } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Switch } from "@/app/_components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { UserClassroom } from "@/lib/types/class-types";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { Role } from "@prisma/client";

interface ClassSettingsTabProps {
  classData: UserClassroom;
  role?: Role;
}

export function ClassSettingsTab({ classData, role }: ClassSettingsTabProps) {
  const [name, setName] = useState(classData.name);
  const [section, setSection] = useState(classData.section);
  // const [backgroundColor, setBackgroundColor] = useState(classData.backgroundColor)
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    toast.success("Copied to clipboard");
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or redirect
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-[#E6E4DD]">
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
          <CardDescription>
            Update your class details and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-[#E6E4DD]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="section">Section</Label>
            <Input
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border-[#E6E4DD]"
            />
          </div>

          {/* <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-y border-[#E6E4DD]"
            />
          </div> */}

          {/* <div className="grid gap-2">
            <Label htmlFor="color">Theme Color</Label>
            <div className="flex gap-3">
              {["#61AAF2", "#7EBF8E", "#D2886F", "#9C89B8", "#F0A202", "#141413"].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full border-2 ${
                    backgroundColor === color ? "border-[#141413]" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBackgroundColor(color)}
                  aria-label={`Select ${color} as theme color`}
                />
              ))}
            </div>
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" className="border-[#E6E4DD]">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-2xl border-[#E6E4DD]">
        <CardHeader>
          <CardTitle>Class Access</CardTitle>
          <CardDescription>
            Manage how students can join your class
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Class Code</h4>
                <p className="text-xs text-[#605F5B]">
                  Students can use this code to join your class
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-medium tracking-wider">
                  {classData.code}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-[#E6E4DD]"
                  onClick={() => handleCopy(classData.code)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy class code</span>
                </Button>
                {/* <Button variant="outline" size="icon" className="h-8 w-8 border-[#E6E4DD]">
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Reset class code</span>
                </Button> */}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Invite Link</h4>
                <p className="text-xs text-[#605F5B]">
                  Share this link to invite people to your class
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-1 border-[#E6E4DD]"
                  onClick={() => handleCopy(classData.inviteLink)}
                >
                  <Link className="h-4 w-4" />
                  <span>Copy Link</span>
                </Button>
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Allow Join Requests</h4>
                <p className="text-xs text-[#605F5B]">Students can request to join your class</p>
              </div>
              <Switch defaultChecked />
            </div> */}
          </div>
        </CardContent>
      </Card>

      { role=="FACULTY" && <Card className="rounded-2xl border-[#E6E4DD]">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for this class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Archive Class</h4>
              <p className="text-xs text-[#605F5B]">
                Hide this class from active view
              </p>
            </div>
            <Button variant="outline" className="border-[#E6E4DD]">
              Archive
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-destructive">
                Delete Class
              </h4>
              <p className="text-xs text-[#605F5B]">
                Permanently delete this class and all its data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the class and all associated assignments, questions, and
                    student submissions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-[#E6E4DD]">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>}
    </div>
  );
}
