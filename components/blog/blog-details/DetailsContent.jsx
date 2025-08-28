import Social2 from "../../common/social/Social2";
import blogsData from "../../../data/blogs";
import Link from "next/link";

const DetailsContent = ({ blogData }) => {
  // Dynamic content from blog data
  return (
    <>
      <h3 className="text-20 fw-500">{blogData.title}</h3>
      
      {/* Excerpt */}
      {blogData.excerpt && (
        <div className="text-15 mt-20">
          {blogData.excerpt}
        </div>
      )}

      {/* Main HTML Content */}
      {blogData.content && (
        <div 
          className="text-15 mt-20"
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        />
      )}

      {/* Author Info */}
      {blogData.author && (
        <div className="text-14 text-light-1 mt-20">
          <strong>Author:</strong> {blogData.author}
        </div>
      )}

      {/* Social Share and Tags */}
      <div className="row y-gap-20 justify-between pt-30">
        <div className="col-auto">
          <div className="d-flex items-center">
            <div className="fw-500 mr-10">Share</div>
            <div className="d-flex items-center">
              <Social2 />
            </div>
          </div>
        </div>
        {/* End social share */}

        {/* Blog Tags */}
        {/* {blogData.tags && blogData.tags.length > 0 && (
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-10">
              {blogData.tags.map((tag, index) => (
                <div key={index} className="col-auto">
                  <span className="button -blue-1 py-5 px-20 bg-blue-1-05 rounded-100 text-15 fw-500 text-blue-1 text-capitalize">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )} */}
        {/* End tags */}
      </div>
    </>
  );
};

export default DetailsContent;
