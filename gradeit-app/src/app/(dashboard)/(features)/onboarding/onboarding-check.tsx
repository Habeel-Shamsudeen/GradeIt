"use client";

import { useClientSession } from "@/hooks/use-auth-session";
import { isUserOnboarded } from "@/server/utils";
import { useEffect, useState } from "react";
import OnboardingPopup from "./onboarding-popup";
// import { onBoardingState } from "@/lib/store/onboarding-store";
// import { useRecoilState } from "recoil";

export default function OnboardingCheck() {
  const session = useClientSession();
  const [isOnboardingComplete, setIsOnboardingComplete] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkOnboarding = async () => {
      // Reset loading state when effect runs
      setIsLoading(true);

      // Only skip if we explicitly know onboarding is complete
      if (isOnboardingComplete === true) {
        console.log("Onboarding is complete");
        setIsLoading(false);
        return;
      }

      if (!session?.user?.id) {
        console.log("No user id");
        setIsLoading(false);
        return;
      }

      try {
        

        console.log("Checking onboarding status");
        const onboarded = await isUserOnboarded(
          session.user.id
        );
        setIsOnboardingComplete(onboarded);
        console.log("Onboarding complete:", onboarded);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsOnboardingComplete(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, [
    session?.user?.id,
    setIsOnboardingComplete,
    isOnboardingComplete,
  ]);

  // Don't show anything while loading or if we don't have complete information
  if (isLoading || !session?.user?.id || isOnboardingComplete === null)
    return null;

  // Don't show anything if onboarding is complete
  if (isOnboardingComplete === true) return null;

  // Show popup if we're sure onboarding is not complete
  return <OnboardingPopup />;
}
