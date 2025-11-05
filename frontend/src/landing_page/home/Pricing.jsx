import React from "react";

function Pricing() {
  return (
    <div className="container mt-2 mb-5">
      <div className="row">
        <div className="col-4 mt-3">
          <h3 className="pb-3" style={{color:"#4d4e51ff"}}>Why EquityFlow is Free?</h3>
          <p className="text-muted">
            "No hidden fees. No premium tiers. Just smart investing for
            everyone."
          </p>
          {/* <a href="" style={{textDecoration:'none'}}>See pricing</a> */}
        </div>
        <div className="col-2"></div>
        <div className="col 6">
          <div className="row">
            <ul className="pt-4">
              <li>
                <strong style={{color:"#4d4e51ff"}}>Our Mission:</strong> Democratize intelligent investing
              </li>
              <li>
                <strong style={{color:"#4d4e51ff"}}>Learning Purpose:</strong> Built to showcase AI in
                finance
              </li>
              <li>
                <strong style={{color:"#4d4e51ff"}}>Your Success:</strong> We succeed when you learn to
                invest smarter
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
