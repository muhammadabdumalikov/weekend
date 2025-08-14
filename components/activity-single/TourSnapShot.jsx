const TourSnapShot = ({ data }) => {
  return (
    <div className="row y-gap-30 justify-between pt-20">
      <div className="col-md-auto col-6">
        <div className="d-flex">
          <i className="icon-clock text-22 text-blue-1 mr-10"></i>
          <div className="text-15 lh-15">
            Duration:
            <br /> {data?.duration || 'N/A'}
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="col-md-auto col-6">
        <div className="d-flex">
          <i className="icon-customer text-22 text-blue-1 mr-10"></i>
          <div className="text-15 lh-15">
            Group size:
            <br /> {data?.seats || 'N/A'}
          </div>
        </div>
      </div>
      {/* End .col */}

      <div className="col-md-auto col-6">
        <div className="d-flex">
          <i className="icon-route text-22 text-blue-1 mr-10"></i>
          <div className="text-15 lh-15">
            Near public
            <br /> transportation
          </div>
        </div>
      </div>
      {/* End .col */}

      {data?.details?.difficulty && (
        <div className="col-md-auto col-6">
          <div className="d-flex">
            <i className="icon-hiking-2 text-22 text-blue-1 mr-10"></i>
            <div className="text-15 lh-15">
              Difficulty level:
              <br /> {data?.details?.difficulty}
            </div>
          </div>
        </div>
      )}
      {/* End .col */}
    </div>
  );
};

export default TourSnapShot;
