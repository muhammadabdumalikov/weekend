/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import CallToActions from "../../../components/common/CallToActions";
import Seo from "../../../components/common/Seo";
import DefaultHeader from "../../../components/header/default-header";
import DefaultFooter from "../../../components/footer/default";
import LocationTopBar from "../../../components/common/LocationTopBar";
import RelatedBlog from "../../../components/blog/blog-details/RelatedBlog";
import blogsData from "../../../data/blogs";
import { useRouter } from "next/router";
import DetailsContent from "../../../components/blog/blog-details/DetailsContent";
import FormReply from "../../../components/blog/blog-details/FormReply";
import TopComment from "../../../components/blog/blog-details/TopComment";
import BlogNavigator from "../../../components/blog/blog-details/BlogNavigator";
import Comments from "../../../components/blog/blog-details/Comments";

const BlogSingleDynamic = () => {
  const router = useRouter();
  const [blog, setBlogItem] = useState({});
  const [dynamicBlog, setDynamicBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = router.query.id;

  useEffect(() => {
    if (!id) return;

    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const response = await fetch(`https://api.wetrippo.com/api/blog/get-by-id`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        
        if (response.ok) {
          const blogData = await response.json();
          setDynamicBlog(blogData);
        } else {
          // Fallback to static data
          const staticBlog = blogsData.find((item) => item.id == id);
          if (staticBlog) {
            setBlogItem(staticBlog);
          } else {
            setError("Blog not found");
          }
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        // Fallback to static data
        const staticBlog = blogsData.find((item) => item.id == id);
        if (staticBlog) {
          setBlogItem(staticBlog);
        } else {
          setError("Blog not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Seo pageTitle="Loading..." />
        <div className="header-margin"></div>
        <DefaultHeader />
        <div className="layout-pt-md layout-pb-md">
          <div className="container">
            <div className="row justify-center">
              <div className="col-auto">
                <div className="text-center">
                  <div className="icon-spinner text-40 text-blue-1 mb-20"></div>
                  <h2 className="text-20 fw-500">Loading blog...</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo pageTitle="Blog Not Found" />
        <div className="header-margin"></div>
        <DefaultHeader />
        <div className="layout-pt-md layout-pb-md">
          <div className="container">
            <div className="row justify-center">
              <div className="col-auto">
                <div className="text-center">
                  <div className="icon-alert-triangle text-40 text-red-1 mb-20"></div>
                  <h2 className="text-20 fw-500">Blog not found</h2>
                  <p className="text-15 text-light-1 mt-10">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DefaultFooter />
      </>
    );
  }

  // Use dynamic blog data if available, otherwise use static data
  const currentBlog = dynamicBlog || blog;
  const isDynamicBlog = !!dynamicBlog;

  return (
    <>
      <Seo pageTitle={currentBlog?.title || "Blog Single"} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      <LocationTopBar />
      {/* End location top bar section */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-40 justify-center text-center">
            <div className="col-auto">
              <div className="text-15 fw-500 text-blue-1 mb-8 text-capitalize">
                {isDynamicBlog && currentBlog?.tags?.length > 0 
                  ? currentBlog.tags[0] 
                  : currentBlog?.tag}
              </div>
              <h1 className="text-30 fw-600">{currentBlog?.title}</h1>
              <div className="text-15 text-light-1 mt-10">
                {isDynamicBlog ? currentBlog?.createdAt : currentBlog?.date}
              </div>
              {isDynamicBlog && currentBlog?.author && (
                <div className="text-14 text-light-1 mt-5">
                  By {currentBlog.author}
                </div>
              )}
            </div>
            <div className="col-12">
              <img
                src={isDynamicBlog && currentBlog?.files?.length > 0 
                  ? currentBlog.files[0].url 
                  : currentBlog?.img}
                alt={currentBlog?.title}
                className="col-12 rounded-8 w-100 img_large_details"
              />
            </div>
          </div>
          {/* End .row top bar image and title */}

          <div className="row y-gap-30 justify-center">
            <div className="col-xl-8 col-lg-10 layout-pt-md">
              <DetailsContent blogData={isDynamicBlog ? currentBlog : null} />
              {/* Details content */}

              <div className="border-top-light border-bottom-light py-30 mt-30">
                <TopComment />
              </div>
              {/* End  topcommnet  */}
              <div className="border-bottom-light py-30">
                <BlogNavigator />
              </div>
              {/* End BlogNavigator */}

              <h2 className="text-22 fw-500 mb-15 pt-30">Guest reviews</h2>
              <Comments />
              {/* End comments components */}

              <div className="border-top-light pt-40 mt-40" />

              <div className="row">
                <div className="col-auto">
                  <h3 className="text-22 fw-500">Leave a Reply</h3>
                  <p className="text-15 text-dark-1 mt-5">
                    Your email address will not be published.
                  </p>
                </div>
              </div>
              {/* End Leave a repy title */}

              <FormReply />
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Details Blog Details Content */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Related content</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40">
            <RelatedBlog />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Related Content */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
      {/* End Call To Actions Section */}
    </>
  );
};

export default BlogSingleDynamic;
