// 'use client';

// import { Button } from '@/app/_components/ui/button';
// import { Loading03Icon } from 'hugeicons-react';
// import { ComputerIcon, SmartphoneIcon, TabletIcon } from 'lucide-react';
// import { useState } from 'react';

// type Session = {
//   id: string;
//   deviceType: 'mobile' | 'tablet' | 'desktop';
//   browser: string;
//   operatingSystem: string;
//   location: string;
//   ipAddress: string;
//   lastActive: string;
//   isCurrent: boolean;
// };

// export default function ActiveDevices() {
//   const [isLoading, setIsLoading] = useState(false);

//   // Mock data - replace with actual API call
//   const sessions: Session[] = [
//     {
//       id: '1',
//       deviceType: 'desktop',
//       browser: 'Arc Browser',
//       operatingSystem: 'MacOS',
//       location: 'Bengaluru, India',
//       ipAddress: '192.168.1.1',
//       lastActive: 'Active now',
//       isCurrent: true,
//     },
//     {
//       id: '2',
//       deviceType: 'mobile',
//       browser: 'Safari',
//       operatingSystem: 'iOS 17',
//       location: 'London, UK',
//       ipAddress: '192.168.1.2',
//       lastActive: '2 hours ago',
//       isCurrent: false,
//     },
//   ];

//   const getDeviceIcon = (type: Session['deviceType']) => {
//     switch (type) {
//       case 'mobile':
//         return <SmartphoneIcon className="h-5 w-5" />;
//       case 'tablet':
//         return <TabletIcon className="h-5 w-5" />;
//       default:
//         return <ComputerIcon className="h-5 w-5" />;
//     }
//   };

//   const handleTerminateSession = async (sessionId: string) => {
//     setIsLoading(true);
//     try {
//       // Add API call to terminate session
//       console.log('Terminating session:', sessionId);
//     } catch (error) {
//       console.error('Error terminating session:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleTerminateAllSessions = async () => {
//     setIsLoading(true);
//     try {
//       // Add API call to terminate all sessions
//       console.log('Terminating all sessions');
//     } catch (error) {
//       console.error('Error terminating all sessions:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="mb-1 text-2xl font-bold">Active Sessions</h2>
//           <p className="text-sm font-medium text-muted-foreground">
//             Manage your active sessions across different devices
//           </p>
//         </div>
//         <Button
//           variant="secondary"
//           onClick={() => handleTerminateAllSessions()}
//           disabled={isLoading}
//           className="w-full sm:w-auto"
//         >
//           {isLoading ? (
//             <>
//               <Loading03Icon className="mr-2 h-4 w-4 animate-spin" />
//               Terminating...
//             </>
//           ) : (
//             'Terminate All'
//           )}
//         </Button>
//       </div>

//       <div className="rounded-lg border p-6">
//         <div className="space-y-6">
//           {sessions.map((session) => (
//             <div
//               key={session.id}
//               className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
//             >
//               <div className="flex items-center gap-4">
//                 {getDeviceIcon(session.deviceType)}
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <h3 className="font-medium">
//                       {session.browser} on {session.operatingSystem}
//                     </h3>
//                     {session.isCurrent && (
//                       <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
//                         Current Session
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     {session.location} • {session.ipAddress}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     {session.lastActive}
//                   </p>
//                 </div>
//               </div>
//               {!session.isCurrent && (
//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() => handleTerminateSession(session.id)}
//                   disabled={isLoading}
//                   className="w-full sm:w-auto"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loading03Icon className="mr-2 h-4 w-4 animate-spin" />
//                       Terminating...
//                     </>
//                   ) : (
//                     'Terminate Session'
//                   )}
//                 </Button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
