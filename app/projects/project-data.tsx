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
  // {
  //   title: "Mithril AI",
  //   year: 2024,
  //   description: "Open science AI resarch lab",
  //   url: "https://github.com/mithrilai",
  // },
  // {
  //   title: "OpenDeepLearning",
  //   year: 2023,
  //   description: "Open source AI education resources",
  //   url: "https://opendeeplearning.xyz/",
  // },
];
