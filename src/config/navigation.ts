"use client";
import { UserClassroom } from "@/lib/types/class-types";
import { getRandomEducationIcon } from "@/lib/utils";
import { getUserClasses } from "@/server/actions/class-actions";
import {
  HugeiconsIcon,
  Settings02Icon,
  UserAccountIcon,
} from "hugeicons-react";
import { useEffect, useState } from "react";

export const getNavigationConfig = () => {
  const [userClasses, setUserClasses] = useState<UserClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [classIcons, setClassIcons] = useState<Record<string, HugeiconsIcon>>(
    {},
  );

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getUserClasses();
        if (response.status === "success") {
          const classes = response.classes || [];
          setUserClasses(classes);

          const iconMap: Record<string, HugeiconsIcon> = {};
          classes.forEach((classroom) => {
            iconMap[classroom.code] = getRandomEducationIcon();
          });
          setClassIcons(iconMap);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return {
    loading,
    navGroup2: userClasses.map((classroom) => ({
      title: classroom.name,
      url: `/classes/${classroom.code}`,
      icon: classIcons[classroom.code] || (UserAccountIcon as HugeiconsIcon),
      isActive: false,
    })),
    navGroup3: [
      {
        title: "Setting & Billing",
        url: "/settings",
        icon: Settings02Icon as HugeiconsIcon,
        items: [],
      },
    ],
  };
};
