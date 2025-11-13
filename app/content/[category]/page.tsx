import Link from "next/link";
import { formatDate, getCategoryPosts, getAllCategorizedPosts } from "app/lib/posts";
import { notFound } from "next/navigation";

const categories = ["books", "papers", "blog", "notes", "experiments", "all"];

const categoryInfo = {
  books: {
    title: "Books",
    description: "Book reviews, summaries, and key takeaways",
  },
  papers: {
    title: "Research Papers",
    description: "Notes and insights from academic papers",
  },
  blog: {
    title: "Blog",
    description: "Articles, thoughts, and insights",
  },
  notes: {
    title: "Notes",
    description: "Personal notes and reflections",
  },
  experiments: {
    title: "Experiments",
    description: "Hands-on projects and coding experiments",
  },
  all: {
    title: "All Content",
    description: "Everything from books, papers, blog posts, notes, and experiments",
  },
};

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const info = categoryInfo[category as keyof typeof categoryInfo];
  
  if (!info) {
    return {
      title: "Content Not Found",
    };
  }

  return {
    title: info.title,
    description: info.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  if (!categories.includes(category)) {
    notFound();
  }

  const info = categoryInfo[category as keyof typeof categoryInfo];
  const posts = category === "all" 
    ? getAllCategorizedPosts()
    : getCategoryPosts(category);

  return (
    <section>
      <h1 className="mb-2 text-2xl font-medium">{info.title}</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">{info.description}</p>
      
      <div>
        {posts.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">
            No content yet in this category — check back later!
          </p>
        ) : (
          posts
            .sort((a, b) => {
              if (
                new Date(a.metadata.publishedAt) >
                new Date(b.metadata.publishedAt)
              ) {
                return -1;
              }
              return 1;
            })
            .map((post) => (
              <Link
                key={post.slug}
                className="flex flex-col space-y-1 mb-5 transition-opacity duration-200 hover:opacity-80"
                href={`/content/${post.category}/${post.slug}`}
              >
                <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <div className="flex flex-col">
                    <h2 className="text-black dark:text-white">
                      {post.metadata.title}
                    </h2>
                    {post.metadata.tags && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        {post.metadata.tags}
                      </p>
                    )}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 tabular-nums text-sm">
                    {formatDate(post.metadata.publishedAt, false)}
                  </p>
                </div>
              </Link>
            ))
        )}
      </div>
    </section>
  );
}
