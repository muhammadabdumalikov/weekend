import dynamic from "next/dynamic";

const Overview = ({ data, language, t }) => {
  return (
    <>
      <div className="row x-gap-40 y-gap-40">
        <div className="col-12">
          <h3 className="text-22 fw-500">{t("tours.overview")}</h3>

          <p className="text-dark-1 text-15 mt-20">{data?.description?.[language]}</p>

          {/* <a
            href="#"
            className="d-block text-14 text-blue-1 fw-500 underline mt-10"
          >
            Show More
          </a> */}
        </div>

        {/* <div className="col-md-6">
          <h5 className="text-16 fw-500">Available languages</h5>
          <div className="text-15 mt-10">
            German, Chinese, Portuguese, Japanese, English, Italian, Chinese,
            French, Spanish
          </div>
        </div>

        <div className="col-md-6">
          <h5 className="text-16 fw-500">{t("tours.cancellationPolicy")}</h5>
          <div className="text-15 mt-10">
            {t("tours.cancellationPolicyDescription")}
            date of the experience.
          </div>
        </div>

        <div className="col-12">
          <h5 className="text-16 fw-500">{t("tours.highlights")}</h5>
          <ul className="list-disc text-15 mt-10">
            <li>
              {t("tours.highlightsDescription")}
            </li>
            <li>{t("tours.highlightsDescription2")}</li>
            <li>{t("tours.highlightsDescription3")}</li>
          </ul>
        </div> */}
      </div>

      <div className="mt-40 border-top-light">
        <div className="row x-gap-40 y-gap-40 pt-40">
          <div className="col-12">
            <h3 className="text-22 fw-500">{t("tours.whatsIncluded")}</h3>

            <div className="row x-gap-40 y-gap-40 pt-20">
              <div className="col-md-6">
                {data?.includes?.map((item, index) => (
                  item?.included && (
                    <div key={index} className="text-dark-1 text-15">
                      <i className="icon-check text-green-2 text-10 mr-10"></i>
                      {item?.title}
                    </div>
                  )
                ))}
              </div>

              <div className="col-md-6">
                {data?.includes?.map((item, index) => (
                  !item?.included && (
                    <div key={index} className="text-dark-1 text-15">
                      <i className="icon-close text-red-2 text-10 mr-10"></i>
                      {item?.title}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default dynamic(() => Promise.resolve(Overview), {
  ssr: false,
});
