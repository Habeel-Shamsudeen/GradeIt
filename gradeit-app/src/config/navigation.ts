import {
  BrushIcon,
  Home02Icon,
  HugeiconsIcon,
  Settings02Icon,
  TestTube01Icon,
  UserAccountIcon,
} from "hugeicons-react";

export const  getNavigationConfig = () => ({
  navGroup2: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home02Icon as HugeiconsIcon,
      isActive: true,
      items: [],
    },
    {
      title: "Leads",
      url: "/leads",
      icon: UserAccountIcon as HugeiconsIcon,
      isActive: true,
      items: [],
    },
    {
      title: "Campaign",
      url: "/campaign",
      icon: TestTube01Icon as HugeiconsIcon,
      items: [
        // ...campaigns.map((campaign: SidebarCampaign) => ({
        //   title: campaign.campaignName,
        //   url: `/campaign/${campaign.id}`,
        //   isCampaignActive:campaign.isCampaignActive || false
        // })),
        // {
        //   title: "Create Campaign",
        //   url: "/",
        // },
      ],
    },
    {
      title: "Linkedin Accounts",
      url: "/linkedin",
      icon: BrushIcon as HugeiconsIcon,
      items: [],
    },
  ],
  navGroup3: [
    {
      title: "Setting & Billing",
      url: "/settings",
      icon: Settings02Icon as HugeiconsIcon,
      items: [],
    },
  ],
});
