"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/app/_components/ui/sidebar";
import { getIconComponent } from "@/config/icons";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  label?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeItem, setActiveItem] = useState<string>(pathname);

  const currentUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  useEffect(() => {
    setActiveItem(currentUrl);
  }, [currentUrl]);

  const isClassActive = (itemUrl: string) => {
    const base = itemUrl.split("?")[0];
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-bold text-sidebar-primary-foreground">
          {label || "Overview"}
        </SidebarGroupLabel>
        <SidebarMenu className="text-sidebar-primary-foreground">
          {items.map((item) => {
            const IconComponent = getIconComponent(
              item.icon || "UserAccountIcon",
            );
            return item.items?.length ? (
              <Collapsible
                key={item.title}
                defaultOpen={isClassActive(item.url)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isClassActive(item.url)}
                    >
                      {item.icon && (
                        <IconComponent className="size-5 shrink-0" />
                      )}
                      <span className="ml-1 text-sm font-medium">
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild
                            tooltip={subItem.title}
                            isActive={currentUrl === subItem.url}
                            onClick={() => setActiveItem(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              <span className="text-sm font-medium">
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  onClick={() => setActiveItem(item.url)}
                >
                  <Link href={item.url}>
                    {item.icon && <IconComponent className="size-5 shrink-0" />}
                    <span className="ml-1 text-sm font-medium">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
