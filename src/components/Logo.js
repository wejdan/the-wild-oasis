import React from "react";
import LogoImg from "../assets/logo-light.png";
function Logo({ width }) {
  return (
    <div className="">
      <img src={LogoImg} alt={"logo"} style={{ width, height: "auto" }} />
    </div>
  );
}

export default Logo;
