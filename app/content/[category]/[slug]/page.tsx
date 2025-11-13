import { notFound } from "next/navigation";
import { formatDate, getCategoryPosts } from "app/lib/posts";
import { CustomMDX } from "app/components/mdx";
import { metaData } from "app/lib/config";

const categories = ["books", "papers", "blog", "notes", "experiments"];

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];
  
  categories.forEach((category) => {
    const posts = getCategoryPosts(category);
    posts.forEach((post) => {
      params.push({
        category: category,
        slug: post.slug,
      });
    });
  });

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  
  if (!categories.includes(category)) {
    return {
      title: "Not Found",
    };
  }

  const posts = getCategoryPosts(category);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;

  const ogImage = image
    ? `${metaData.baseUrl}${image}`
    : `${metaData.baseUrl}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${metaData.baseUrl}/content/${category}/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ContentPost({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;

  if (!categories.includes(category)) {
    notFound();
  }

  const posts = getCategoryPosts(category);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${metaData.baseUrl}${post.metadata.image}`
              : `${metaData.baseUrl}/og?title=${post.metadata.title}`,
            url: `${metaData.baseUrl}/content/${category}/${slug}`,
            author: {
              "@type": "Person",
              name: metaData.title,
            },
          }),
        }}
      />
      <h1 className="title text-2xl font-medium max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      {post.metadata.tags && (
        <div className="mb-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Tags: {post.metadata.tags}
          </p>
        </div>
      )}
      <article className="prose prose-neutral dark:prose-invert prose-quoteless">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
