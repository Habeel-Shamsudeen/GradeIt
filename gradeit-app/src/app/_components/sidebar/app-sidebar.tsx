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
import { LOGO_LIGHT } from "@/config/constants";
import { LOGO_DARK } from "@/config/constants";
import { LOGO_LIGHT_SQUARE } from "@/config/constants";
import { LOGO_DARK_SQUARE } from "@/config/constants";
import { isValidUrl, titleCase } from "@/lib/utils";
import { useTheme } from "next-themes";
import { getNavigationConfig } from "@/config/navigation";
import { useClientSession } from "@/hooks/use-auth-session";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme } = useTheme();
  const { open, isMobile } = useSidebar();
  const { user: sessionUser } = useClientSession();
  const navigationConfig = getNavigationConfig();

  const userProfile = sessionUser
    ? {
        name: titleCase(sessionUser?.name || "John Doe") ,
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
                {resolvedTheme === "light" ? (
                  <img src={LOGO_LIGHT} alt="Logo" className="h-10 ml-2" />
                ) : (
                  <img src={LOGO_DARK} alt="Logo" className="h-10 ml-2" />
                )}
                <ModeToggle />
              </>
            ) : resolvedTheme === "light" ? (
              <img src={LOGO_LIGHT_SQUARE} alt="Logo" className="mb-4 w-12" />
            ) : (
              <img src={LOGO_DARK_SQUARE} alt="Logo" className="mb-4 w-12" />
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navigationConfig.navGroup2} label="Overview" />
          <NavMain items={navigationConfig.navGroup3} label="Settings" />
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
