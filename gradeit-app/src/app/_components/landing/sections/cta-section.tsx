import { ArrowRight } from "lucide-react";
import AnimatedSection from "../../animations/AnimatedSection";
import { Button } from "../../ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground flex justify-center">
      <div className="container px-6">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              Ready to transform your coding classroom?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join hundreds of universities already using gradeIT to streamline
              their computer lab assignments.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 px-8 bg-white text-primary hover:bg-secondary transition-all"
              >
                <Link href={"/classes"}> Get Started </Link>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
