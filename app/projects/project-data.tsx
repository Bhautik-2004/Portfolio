export interface Project {
  title: string;
  year: number;
  description: string;
  url: string;
}

export const projects: Project[] = [
  {
    title: "FMS - Financial Management System",
    year: 2025,
    description: "A financial management system built with Next.js",
    url: "https://github.com/Bhautik-2004/FMS",
  },
  {
    title: "Visual Question Answering (VQA)",
    year: 2026,
    description: "A visual question answering system that combines computer vision and natural language processing",
    url: "https://github.com/Bhautik-2004/VQA",
  },
  {
    title: "Nozzle-Diff",
    year: 2026,
    description: "Deep Learning-based optimization framework for designing fluid dynamically efficient nozzle geometries",
    url: "https://github.com/Bhautik-2004/Nozzle-Diff",
  },
  {
    title: "Mini-GPT",
    year: 2026,
    description: "An implementation of a mini version of the GPT language model for natural language processing tasks",
    url: "https://github.com/Bhautik-2004/Mini-GPT",
  },
  {
    title: "Generarative Adversarial Networks (GANs)",
    year: 2026,
    description: "A project focused on implementing and experimenting with GANs for image generation tasks",
    url: "https://github.com/Bhautik-2004/GANs",
  },
  {
    title: "Conditional Variational Autoencoders (CVAEs)",
    year: 2026,
    description: "A project that explores the implementation of CVAE for generating data conditioned on specific attributes",
    url: "https://github.com/Bhautik-2004/CVAE",
  },
];
