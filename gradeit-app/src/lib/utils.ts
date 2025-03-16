import { darkCardColors, lightCardColors } from '@/config/constants';
import { getAssigmentTitleFromId, getClassNameFromCode } from '@/server/utils';
import { type ClassValue, clsx } from 'clsx';
import { randomUUID } from 'crypto';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  let breadcrumbs = [];

  for (let i = 0; i < paths.length; i++) {
    let label = paths[i];
    let href = `/${paths.slice(0, i + 1).join('/')}`;
    let isLast = i === paths.length - 1;

    if (i === 1) {
      const className = await getClassNameFromCode(paths[i]);
      if (className) label = className;
    }

    if (i === 2) {
      const assignmentTitle = await getAssigmentTitleFromId(paths[i]);
      if (assignmentTitle) label = assignmentTitle;
    }

    breadcrumbs.push({ href, label, isLast });
  }

  return breadcrumbs;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function snakeCase(string: string) {
  return string.toLowerCase().replace(/ /g, '_');
}

export function kebabCase(string: string) {
  return string.toLowerCase().replace(/ /g, '-');
}

export const sentenceCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

export function formatNumberShort(num: number | string): string {
  // Convert string numbers with commas to number type
  const normalizedNum =
    typeof num === 'string' ? Number(num.replace(/,/g, '')) : num;

  const lookup = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ];

  const item = lookup.find((item) => Math.abs(normalizedNum) >= item.value);

  if (item) {
    const formattedNum = (normalizedNum / item.value)
      .toFixed(1)
      .replace(/\.0$/, '');
    return `${formattedNum}${item.symbol}`;
  }

  return normalizedNum.toString();
}

export const absoluteUrl = (path: string) => {
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString();
};

export const getCardBgColor = (theme:string|undefined) => {
  const palette = theme === "dark" ? darkCardColors : lightCardColors
  return palette[Math.floor(Math.random() * palette.length)]
}

export const generateClassroomCode = ()=>{
  return randomUUID().slice(0,6);
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}



// Implement this in your frontend component

// const handleSubmit = async () => {
//   if (isRunning) return;
  
//   setIsSubmitting(true);
//   setSubmissionStatus("Submitting your solution...");
  
//   try {
//     // Call your backend API endpoint
//     const response = await fetch("/api/submissions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         code,
//         questionId: currentQuestion.id,
//         language: LANGUAGE_ID_MAP[currentQuestion.language as keyof typeof LANGUAGE_ID_MAP],
//       }),
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || "Failed to submit solution");
//     }
    
//     const data = await response.json();
//     const submissionId = data.submissionId;
    
//     // Start polling for submission status
//     setSubmissionStatus("Running test cases...");
//     await pollSubmissionStatus(submissionId);
    
//   } catch (error: any) {
//     console.error("Submission error:", error);
//     setSubmissionStatus(`Submission failed: ${error.message}`);
//     toast({
//       title: "Submission Failed",
//       description: error.message || "An error occurred while submitting your solution",
//       variant: "destructive",
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

// // Poll for submission status
// const pollSubmissionStatus = async (submissionId: string) => {
//   let completed = false;
//   let attempts = 0;
//   const maxAttempts = 30; // Poll for maximum of 30 attempts (30 seconds with 1s interval)
  
//   while (!completed && attempts < maxAttempts) {
//     attempts++;
//     await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    
//     try {
//       const response = await fetch(`/api/submissions/${submissionId}`);
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch submission status");
//       }
      
//       const submissionData = await response.json();
      
//       // Update test results in UI
//       const mappedResults = submissionData.results.map(result => ({
//         id: result.id,
//         status: result.status,
//         runtime: result.runtime,
//         memory: result.memory,
//         output: result.output,
//         error: result.error,
//       }));
      
//       setTestResults(mappedResults);
      
//       // Check if submission is completed
//       if (submissionData.status === "COMPLETED" || 
//           submissionData.status === "PASSED" || 
//           submissionData.status === "FAILED") {
//         completed = true;
        
//         // Show appropriate message
//         if (submissionData.status === "PASSED") {
//           setSubmissionStatus("All tests passed successfully!");
//           toast({
//             title: "Success!",
//             description: "Your solution passed all test cases",
//             variant: "default",
//           });
//         } else {
//           setSubmissionStatus("Some tests failed. Check the results for details.");
//           toast({
//             title: "Tests Failed",
//             description: "Your solution didn't pass all test cases",
//             variant: "default",
//           });
//         }
//       } else {
//         setSubmissionStatus(`Running test cases (${attempts}/${maxAttempts})...`);
//       }
//     } catch (error) {
//       console.error("Error polling submission status:", error);
//     }
//   }
  
//   if (!completed) {
//     setSubmissionStatus("Submission is taking longer than expected. You can check results later.");
//   }
  
//   return completed;
// };