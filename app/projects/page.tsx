import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "./project-data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Nextfolio Projects",
};

export default function Projects() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-medium">Projects</h1>
      <div>
        {projects.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">
            No projects yet — check back later!
          </p>
        ) : (
          projects.map((project, index) => (
            <Link
              key={index}
              href={project.url}
              className="block mb-6 transition-opacity duration-200 hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-black dark:text-white font-medium">{project.title}</h2>
                <span className="text-neutral-500 dark:text-neutral-500 text-sm whitespace-nowrap">
                  {project.year}
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
