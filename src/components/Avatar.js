import React from "react";

function Avatar({ size, url }) {
  return (
    <img
      className=" rounded-full"
      alt={"avatar"}
      style={{ width: size, height: size }}
      src={url}
    />
  );
}

export default Avatar;
