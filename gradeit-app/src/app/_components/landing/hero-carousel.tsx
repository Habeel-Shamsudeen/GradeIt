"use client"

import { Carousel } from "@/app/_components/ui/carousel"
import { landingImages } from "@/config/constants"


interface HeroCarouselProps {
  className?: string
}

export function HeroCarousel({ className }: HeroCarouselProps) {


  return <Carousel images={landingImages} autoPlay={true} interval={6000} className={className} parallaxEffect={true} />
}

