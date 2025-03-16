"use client"

import { useState } from "react"
import { Search, UserPlus, Mail, MoreVertical } from 'lucide-react'
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
import { Members } from "@/lib/types/class-types"

interface PeopleTabProps {
  classCode: string
  teachers: Members[]
  students: Members[]
}

export function PeopleTab({ classCode, teachers, students }: PeopleTabProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredTeachers = teachers.filter(
    teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredStudents = students.filter(
    student => student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#605F5B]" />
          <Input
            placeholder="Search people..."
            className="pl-9 border-[#E6E4DD]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setInviteDialogOpen(true)} className="gap-1 whitespace-nowrap">
          <UserPlus className="h-4 w-4" />
          Invite People
        </Button>
      </div>
      
      <div className="rounded-2xl border border-[#E6E4DD] bg-white overflow-hidden">
        <div className="p-6 border-b border-[#E6E4DD]">
          <h3 className="text-lg font-medium text-[#141413]">Teachers</h3>
        </div>
        <div className="divide-y divide-[#E6E4DD]">
          {filteredTeachers.length === 0 ? (
            <div className="p-6 text-center text-[#605F5B]">No teachers found</div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-4 hover:bg-[#FAFAF8]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-[#E6E4DD]">
                    <AvatarImage src={teacher.image || ""} alt={teacher.name} />
                    <AvatarFallback>{teacher.name.charAt(0)}{teacher.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#141413]">{teacher.name}</p>
                    <p className="text-sm text-[#605F5B]">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[#605F5B]">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[#605F5B]">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Remove from class</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="rounded-2xl border border-[#E6E4DD] bg-white overflow-hidden">
        <div className="p-6 border-b border-[#E6E4DD]">
          <h3 className="text-lg font-medium text-[#141413]">Students</h3>
          <p className="text-sm text-[#605F5B]">{students.length} students</p>
        </div>
        <div className="divide-y divide-[#E6E4DD]">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-[#605F5B]">No students found</div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 hover:bg-[#FAFAF8]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-[#E6E4DD]">
                    <AvatarImage src={student.image || ""} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}{student.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#141413]">{student.name}</p>
                    <p className="text-sm text-[#605F5B]">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[#605F5B]">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-[#605F5B]">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>View submissions</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Remove from class</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <InvitePeopleDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} classCode={classCode} />
    </div>
  )
}

interface InvitePeopleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classCode: string
}

function InvitePeopleDialog({ open, onOpenChange, classCode }: InvitePeopleDialogProps) {
  const [activeTab, setActiveTab] = useState("email")
  const [emails, setEmails] = useState("")
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onOpenChange(false)
    }, 1000)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite People</DialogTitle>
          <DialogDescription>
            Add students or teachers to your class.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-[#F0EFEA]">
            <TabsTrigger value="email">Email Addresses</TabsTrigger>
            <TabsTrigger value="link">Invite Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="emails" className="text-sm font-medium">
                    Email Addresses
                  </label>
                  <textarea
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="Enter email addresses separated by commas"
                    className="min-h-[100px] w-full rounded-md border border-[#E6E4DD] p-3 text-sm"
                    required
                  />
                  <p className="text-xs text-[#605F5B]">
                    Recipients will receive an email with a link to join your class.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Role</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="role" value="student" defaultChecked className="h-4 w-4" />
                      <span>Student</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="role" value="teacher" className="h-4 w-4" />
                      <span>Teacher</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-[#E6E4DD]">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Invitations"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="link" className="mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Class Invite Link</label>
                <div className="flex">
                  <Input
                    readOnly
                    value={`https://gradeit.app/join?code=${classCode}`}
                    className="rounded-r-none border-[#E6E4DD]"
                  />
                  <Button className="rounded-l-none">Copy</Button>
                </div>
                <p className="text-xs text-[#605F5B]">
                  Anyone with this link can join your class. The link expires in 7 days.
                </p>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Class Code</label>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-medium tracking-wider">{classCode}</span>
                  <Button variant="outline" size="sm" className="h-7 border-[#E6E4DD]">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-[#605F5B]">
                  Students can use this code to join your class.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-[#E6E4DD]">
                Close
              </Button>
              <Button type="button">
                Generate New Link
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
