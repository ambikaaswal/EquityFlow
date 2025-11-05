function HeroSection() {
  return (
    <div className="container p-5">
      <div className="row text-center justify-content-center">
        <img
          src="images/homeHero.png"
          alt="unable to load image"
          className="mb-5"
        />
        <h1 className="mt-3" style={{color:"#4d4e51ff"}}>Let us Invest for you</h1>
        <p>"Intelligent Stock Investing, That Works While You Sleep"</p>
        <p className="text-muted">
          Intelligent Investing with Equity Flow, where you don't need to
          micromanage your stocks. We will do it for you.
        </p>
        <button className="btn btn-primary p-2 mb-5" style={{ width: "20%" }}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
