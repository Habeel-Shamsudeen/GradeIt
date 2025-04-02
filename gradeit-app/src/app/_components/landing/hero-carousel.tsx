"use client"

import { Carousel } from "@/app/_components/ui/carousel"
import image1 from "@/../public/images/landing/classroom.png"
import image2 from "./../../../../public/images/landing/classroom.png"


interface HeroCarouselProps {
  className?: string
}

export function HeroCarousel({ className }: HeroCarouselProps) {
  const images = [
    {
      src: "/images/landing/assignments.png?height=600&width=1200&text=gradeIT+Editor",
      alt: "gradeIT Dashboard",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/class.png?height=600&width=1200&text=Code+Editor",
      alt: "Code Editor Interface",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/home.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/codingEnv.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/forceFullScreen.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/peoples.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/questions.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/submissionDetail.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/submissionHistory.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
    {
      src: "/images/landing/settings.png?height=600&width=1200&text=Grading+Analytics",
      alt: "Grading Analytics",
      width: 1200,
      height: 600,
    },
  ]

  return <Carousel images={images} autoPlay={true} interval={6000} className={className} parallaxEffect={true} />
}

