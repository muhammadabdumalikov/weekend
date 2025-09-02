import { useEffect } from "react";
import { useRouter } from "next/router";

const EditBlogIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to blog list since edit-blog requires an ID
    router.push('/vendor-dashboard/blog-list');
  }, [router]);

  return null;
};

export default EditBlogIndex;
