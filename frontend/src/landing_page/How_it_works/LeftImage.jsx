function LeftImage({ imageURL, productName, productDesc }) {
  return (
    <div className="container my-5">
      <div className="row mx-5">
        <div className="col p-5">
                <img src={imageURL} alt="Unable to load" />
        </div>
        {/* to create extra space between the divs */}
        <div className="col-1 p-5"></div>
        <div className="col p-5">
                <h2 style={{color:"#4d4e51ff"}}>{productName}</h2>
                <p className="text-muted pt-3">
                    {productDesc}
                </p>
        </div>
      </div>
    </div>
  );
}

export default LeftImage;
