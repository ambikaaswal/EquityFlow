function Hero() {
  return (
    <div className="container">
      <div className="row mt-5">
        <h3 className="text-center mb-5" style={{ color: "#4d4e51ff" }}>
          Smart automation. Smarter control. <br />
          Your portfolio, elevated by AI, controlled by you
        </h3>
        <div className="row mb-5 border-top py-5 border-bottom mx-5 text-muted">
          <div className="col px-5">
            <p>
              I created EquityFlow with the purpose to democratize intelligent
              investing by combining the power of artificial intelligence with
              human intuition. <br /> <br /> Traditional investing requires
              constant market monitoring and expertise most people don't have.
              Robo-advisors and algo-trading offer automation but lack
              transparency and user control. <br /> <br />{" "}
              <strong>EquityFlow</strong> bridges this gap by using machine
              learning to identify investment opportunities and execute trades
              automatically, while giving users full veto power over every
              decision.
            </p>
          </div>
          <div className="col px-5">
            <p>
              Built as an educational project to explore AI in finance,
              EquityFlow demonstrates how technology can democratize smart
              investing without removing human agency from the equation. <br />{" "}
              <br /> I believe the future of investing isn't about replacing
              human judgment, but augmenting it with intelligent automation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
