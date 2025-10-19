import './RaiseIssue.css';
function RaiseIssue() {
  return (
    <div className="container mt-5">
      <div className="row p-5 my-5">
        <h1 className="fs-2 mb-2 RaiseIssue">
          To raise an issue, select a the concerned topic
        </h1>
        <div className="col-4 my-5">
          <h4 className="fs-5 RaiseIssue">
            <i class="fa-solid fa-square-plus"></i>Account
          </h4>
          <a href="" style={{lineHeight:"2"}}>Account Login</a> <br />
          <a href="" style={{lineHeight:"2"}}>Account Opening</a> <br />
          <a href="" style={{lineHeight:"2"}}>Contact us for more</a> <br />
        </div>
        <div className="col-4 my-5">
          <h4 className="fs-5 RaiseIssue">
            <i class="fa-solid fa-square-plus"></i>Dashboard
          </h4>
          <a href="" style={{lineHeight:"2"}}>Wrong metrics</a> <br />
          <a href="" style={{lineHeight:"2"}}>Unable to see</a> <br />
          <a href="" style={{lineHeight:"2"}}>Contact for more</a> <br />
        </div>
        <div className="col-4 my-5">
          <h4 className="fs-5 RaiseIssue">
            <i class="fa-solid fa-square-plus"></i>User Veto
          </h4>
          <a href="" style={{lineHeight:"2"}}>Veto not working</a> <br />
          <a href="" style={{lineHeight:"2"}}>Veto not visible</a> <br />
          <a href="" style={{lineHeight:"2"}}>Contact for more</a> <br />
        </div>
      </div>
    </div>
  );
}

export default RaiseIssue;
