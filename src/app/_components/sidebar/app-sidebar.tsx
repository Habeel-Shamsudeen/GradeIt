"use client";

import { NavMain } from "@/app/_components/sidebar/nav-main";
import { NavUser } from "@/app/_components/sidebar/nav-user";
import { ModeToggle } from "@/app/_components/sidebar/theme-toggle-btn";
import BlurFade from "@/app/_components/ui/blur-fade";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/app/_components/ui/sidebar";
import { isValidUrl, titleCase } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useClientSession } from "@/hooks/use-auth-session";
import { NavGroupInterface } from "@/lib/types/config-types";
import { Code } from "lucide-react";
import Link from "next/link";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navGroups: NavGroupInterface[];
}
export function AppSidebar({ navGroups, ...props }: AppSidebarProps) {
  const { resolvedTheme } = useTheme();
  const { open, isMobile } = useSidebar();
  const { user: sessionUser } = useClientSession();

  const userProfile = sessionUser
    ? {
        name: titleCase(sessionUser?.name || "John Doe"),
        email: sessionUser.email || "john.doe@example.com",
        avatar: sessionUser.image
          ? isValidUrl(sessionUser.image)
            ? sessionUser.image
            : `https://ui-avatars.com/api/?name=${
                titleCase(sessionUser?.name || "John Doe") ?? "John Doe"
              }`
          : `https://ui-avatars.com/api/?name=${
              titleCase(sessionUser?.name || "John Doe") ?? "John Doe"
            }`,
      }
    : null;

  return (
    <>
      <Sidebar collapsible="icon" variant="floating" {...props}>
        <SidebarHeader className="mt-3 p-2">
          <div className="flex items-center justify-between">
            {isMobile || open ? (
              <>
                <Link
                  href="/classes"
                  className="flex justify-start items-center gap-2"
                >
                  <Code
                    size={40}
                    className="ml-1.5 text-white bg-primary-button hover:bg-primary-button-hover p-1 rounded-xl"
                  />
                  <p className="font-inter font-bold text-neutral-950 dark:text-neutral-50">
                    gradeIT
                  </p>
                </Link>
                <ModeToggle />
              </>
            ) : resolvedTheme === "light" || resolvedTheme === "dark" ? (
              <Link href="/classes">
                <Code
                  size={40}
                  className="ml-1 text-white  bg-primary-button  hover:bg-primary-button-hover p-1 rounded-xl"
                />
              </Link>
            ) : null}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navGroups} label="Classes" />
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2">
          {userProfile && (
            <BlurFade>
              <NavUser user={userProfile} />
            </BlurFade>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
