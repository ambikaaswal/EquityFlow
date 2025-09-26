import "./Footer.css";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#f0f2f0" }}>
      <div className="container border-top">
        <div className="row mt-3">
          <div className="col">
            <img
              src="images/Eflow-Logo.svg"
              style={{ width: "100%" }}
              alt="unable to load"
            />
            <p style={{ color: "rgb(125, 123, 123)", fontSize: "14px" }}>
              &copy;EquityFlow.ltd <br /> ALL rights reserved
            </p>
          </div>
          <div className="col">
            <p>Project</p>
            <a href="">About This Project</a>
            <br />
            <a href="">How It's Built</a>
            <br />
            <a href="">Learning Goals</a>
            <br />
            <a href="">Future Plans</a>
            <br />
          </div>
          <div className="col">
            <p>Support</p>
            <a href="">Help</a>
            <br />
            <a href="">Contact</a>
            <br />
            <a href="">FAQ</a>
            <br />
          </div>
          <div className="col">
            <p>Legal</p>
            <a href="">Privacy</a>
            <br />
            <a href="">Terms</a>
            <br />
            <a href="">Disclaimer</a>
            <br />
          </div>
          <div className="col">
            <p>Connect</p>
            <a href="">Email</a>
            <br />
            <a href="">Linkedin</a>
            <br />
            <a href="">GitHub</a>
            <br />
          </div>
        </div>
        <div className="row text-muted mt-5 mb-5">
          <small>
            <p>
              EquityFlow is an innovative educational
              project that combines machine learning with stock market
              investing. Built using the MERN stack (MongoDB, Express, React,
              Node.js) and powered by AI forecasting models, this platform
              demonstrates how artificial intelligence can automate investment
              decisions while keeping users in complete control.</p><p> Every trade
              suggested by our ML algorithms can be overridden with a simple
              click, creating a perfect balance between automation and human
              judgment. This project showcases the future of fintech - where
              technology enhances rather than replaces human decision-making.
            </p>
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
