import Link from "next/link"
import { Code, Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[#E6E4DD] bg-white flex justify-center">
      <div className="container py-12 md:py-16 px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141413]">
                <Code className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-medium">gradeIT</span>
            </Link>
            <p className="mt-4 text-sm text-[#828179]">
              Empowering educators and students with intuitive coding education tools designed with precision and care.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-[#141413]">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-[#141413]">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium text-[#141413]">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-[#605F5B] hover:text-[#141413] transition-colors">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#E6E4DD] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-[#828179] md:text-left">
              &copy; {new Date().getFullYear()} gradeIT. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-[#605F5B] hover:text-[#141413] transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-[#605F5B] hover:text-[#141413] transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-[#605F5B] hover:text-[#141413] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

