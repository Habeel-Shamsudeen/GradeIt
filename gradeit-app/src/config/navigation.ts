'use client'
import { UserClassroom } from "@/lib/types/class-types";
import { getUserClasses } from "@/server/actions/class-actions";
import {
  BrushIcon,
  Home02Icon,
  HugeiconsIcon,
  Settings02Icon,
  TestTube01Icon,
  UserAccountIcon,
} from "hugeicons-react";
import { useEffect, useState } from "react";

export const  getNavigationConfig = () => {
  const [userClasses, setUserClasses] = useState<UserClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getUserClasses();
        if (response.status === "success") {
          setUserClasses(response.classes || []);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);
  return ({
    loading,
    navGroup2: userClasses.map((classroom) => ({
      title: classroom.name,
      url: `/classes/${classroom.code}`,
      icon: UserAccountIcon as HugeiconsIcon, // Change icon if needed
      isActive: false,
      items: [
        {
          title: 'assignments',
          url: `/classes/${classroom.code}/story`,
        },
        // {
        //   title: 'Moodboard',
        //   url: `/classes/${classroom.code}/moodboard`,
        // },
      ],
    })),
  navGroup3: [
    {
      title: "Setting & Billing",
      url: "/settings",
      icon: Settings02Icon as HugeiconsIcon,
      items: [],
    },
  ],
})};
