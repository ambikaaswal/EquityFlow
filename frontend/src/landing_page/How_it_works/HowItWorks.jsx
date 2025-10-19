import Hero from "./Hero";
import LeftImage from "./LeftImage";
import RightImage from "./RightImage";

function HowItWorks() {
  return (
    <div>
      <Hero />
      <LeftImage
        imageURL="/images/kite.png"
        productName="DashBoard"
        productDesc="This is the front Interface of the product and is designed keeping an average layman user in mind. It is not cluttered, neither confusing just start start with the initial amount and number of investments and let the app decide for you based on your chosen preferences."
      />
      <RightImage
        imageURL="/images/coin.png"
        productName="Right Menu"
        productDesc="This is the front Interface of the product and is designed keeping an average layman user in mind. It is not cluttered, neither confusing just start start with the initial amount and number of investments and let the app decide for you based on your chosen preferences."
      />
      <LeftImage
        imageURL="/images/kite.png"
        productName="Trading Board"
        productDesc="This is the front Interface of the product and is designed keeping an average layman user in mind. It is not cluttered, neither confusing just start start with the initial amount and number of investments and let the app decide for you based on your chosen preferences."
      />
      <RightImage
        imageURL="/images/coin.png"
        productName="Left Menu"
        productDesc="This is the front Interface of the product and is designed keeping an average layman user in mind. It is not cluttered, neither confusing just start start with the initial amount and number of investments and let the app decide for you based on your chosen preferences."
      />
    </div>
  );
}
export default HowItWorks;
