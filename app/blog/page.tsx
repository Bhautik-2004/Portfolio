import { redirect } from "next/navigation";

export const metadata = {
  title: "Content",
  description: "All content - Books, Papers, Articles, Notes, and Experiments",
};

export default function BlogPosts() {
  // Redirect to the all content page
  redirect("/content/all");
}
