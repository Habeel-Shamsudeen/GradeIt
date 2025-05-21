import { ProcessStep } from "../process-step"

const WorkflowSection = ({ educatorSteps, studentSteps, AnimatedSection, StaggeredItem, motion }:any) => {
  return (
    <section className="py-24 flex justify-center  bg-accent">
      <div className="container px-6">
        <AnimatedSection>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-block text-sm font-medium text-muted-foreground mb-3">WORKFLOW</span>
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Simple, intuitive process
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">A streamlined experience for both educators and students</p>
          </div>
        </AnimatedSection>

        <div className="mt-16">
          <AnimatedSection>
            <h3 className="mb-8 text-center text-xl font-medium text-foreground">For Educators</h3>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-3 mx-auto max-w-5xl">
            {educatorSteps.map((step:any, index:number) => (
              <StaggeredItem key={index} index={index}>
                <ProcessStep
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </StaggeredItem>
            ))}
          </div>

          <div className="my-16 flex justify-center">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, amount: 0.8 }}
              className="h-px bg-border"
            ></motion.div>
          </div>

          <AnimatedSection>
            <h3 className="mb-8 text-center text-xl font-medium text-foreground">For Students</h3>
          </AnimatedSection>
          
          <div className="grid gap-6 md:grid-cols-3 mx-auto max-w-5xl">
            {studentSteps.map((step:any, index:number) => (
              <StaggeredItem key={index} index={index}>
                <ProcessStep
                  number={step.number}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
              </StaggeredItem>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkflowSection
