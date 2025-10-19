function People() {
  return (
    <div className="container">
      <div className="row mb-5 py-5 border-bottom mx-5 text-muted">
        <p className="fs-2 text-center mb-5">About me</p>
        <div className="col text-center">
          <div className="d-flex justify-content-center w-100 pt-3">
            <img
              src="/images/me.jpeg"
              alt="unable to load"
              style={{ maxWidth: "200px", borderRadius: "100%" }}
            />
          </div>
          <br />
          <h4>Ambika Aswal</h4>
          <p>EquityFlow, Creator</p>
        </div>
        <div className="col px-5">
          <p>
            Hello, This is my Final year project for MCA third Semester. <br />{" "}
            <br />
            I incoporated the full stack development skills i learned after my
            course completion in MERN stack. I wanted to learn how to incoporate
            machine learning algorithms to make a smarter project. <br />
            And this is one of the many ideas i stumbled across. I chose this
            project since alongwith gaining skills i also wanted to learn about
            stocks and financial market a little bit. And i think i know quite a
            lot since i started. <br />I took inspiration from different UI
            designs from Zerodha for the UI design.
          </p>
        </div>
      </div>
    </div>
  );
}

export default People;
