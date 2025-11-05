function RightImage({imageURL,productName, productDesc}) {
  return (
    <div>
      <div className="container my-5">
        <div className="row mx-5">
          <div className="col">
            <h2 className="pb-3" style={{ color: "#4d4e51ff" }}>{productName}</h2>
            <p className="text-muted">{productDesc}</p>
          </div>
          {/* to create extra space between the divs */}
          <div className="col-1 p-5"></div>
          <div className="col p-5">
            <img src={imageURL} alt="Unable to load" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightImage;
