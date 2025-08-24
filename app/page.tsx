import Image from "next/image";
import { BlockMath } from "react-katex";

export default function Page() {
  return (
    <section>
      <Image
        src="/profile.png"
        alt="Profile photo"
        className="rounded-full bg-gray-100 block lg:mt-5 mt-0 lg:mb-5 mb-10 mx-auto sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0"
        unoptimized
        width={160}
        height={160}
        priority
      />
      <h1 className="mb-8 text-2xl font-medium">Hey there!</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p>
          I’m a student and developer who loves exploring AI, Machine Learning, and web development. I spend my time building projects that are both fun and practical, from interactive web apps to intelligent models.
        </p>
        <p>
          I’m particularly interested in research and experimentation. I love taking concepts from theory and turning them into practical applications, while also documenting insights and lessons through my blog.
        </p>
        <p>
          This is where I share my projects, research experiments, and personal explorations in AI and web development. You’ll find my latest work, blog posts, and experiments all in one place. Dive in, explore, and don’t hesitate to reach out if you’d like to exchange ideas or collaborate!
        </p>
      </div>

      <div className="mt-6">
        <a
          href="https://drive.google.com/file/d/1eKCjY-7Z-qR5RRzb6h3-scWqPy3Yk5GA/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          My Resume
        </a>
      </div>
      {/* Life Error Minimization Equation */}
        <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-lg p-4 mt-10 text-[0.8rem]">
          <BlockMath>
            {String.raw`
              \begin{align*}
              \underset{\theta}{\text{argmin}} \;\; \text{LifeError}(\theta) &= 
              \frac{\sum_{i=1}^{n} (\text{Delay}_i + \text{BadDecision}_i + \text{Bugs}_i)}
              {\sum_{i=1}^{n} (\text{Learning}_i + \text{Projects}_i + \text{Fun}_i)} 
              + \lambda \cdot \text{Coffee} - \gamma \cdot \text{SleepDeprivation} \\
              &\
              \text{s.t. } \text{Motivation} > 0, \quad 
              \lambda \in \mathbb{R}, \; \gamma \in \mathbb{R}_{+}
              \end{align*}
            `}
          </BlockMath>
        </div>
    </section>
  );
}