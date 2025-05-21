import { FeatureHighlight } from "../feature-highlight"

const EducatorsSection = ({ features, AnimatedSection, ParallaxImage, motion }:any) => {
  return (
    <section className="py-24 flex justify-center bg-accent">
      <div className="container px-6">
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <AnimatedSection>
            <div>
              <span className="inline-block text-sm font-medium text-muted-foreground mb-3">FOR EDUCATORS</span>
              <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl mb-6">
                Streamline your teaching workflow
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Create assignments, monitor student progress, and provide feedback—all in one place.
              </p>

              <div className="space-y-6">
                {features.map((feature:any, index:number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    <FeatureHighlight
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm bg-card/90 border border-border">
                <ParallaxImage
                  src="/placeholder.svg?height=500&width=600"
                  width={600}
                  height={500}
                  alt="Educator Dashboard"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

export default EducatorsSection
