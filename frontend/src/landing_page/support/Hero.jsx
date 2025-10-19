import "./Hero.css";
function Hero() {
  return (
    <div className=" mb-5 mx-0 Hero">
      <div className="row mx-5 pt-3 px-5">
        <div className="col-5 ">
          <p className="pb-3">Support Portal</p> <br />
          <p className="fs-5">
            Search for an answer or browse topics related to issue
          </p>
          <form action="">
            <input
              className="form-control mb-1"
              type="text"
              name=""
              placeholder="Eg: How can i cancel my issue"
              id=""
            />
            <button className="btn btn-primary pt-1">search</button>
          </form>
        </div>
        {/* extra div for space */}
        <div className="col-2"></div>

        <div className="col-5 ">
          <p className="pb-3">
            <a href="" className="links">
              Track Issue
            </a>
          </p>
          <br />
          <p className="fs-5">Featured</p>
          <ol >
            <li ><a className="links" href="">Read latest reports</a></li>
            <li><a className="links" href="">learn more about smart investing</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Hero;
