import Image from "next/image";
import * as React from "react";
import { Avatar } from "@mui/material";
import logo from "../public/logo.svg";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default function MusingsAvatar({ user, size, style }) {
  let render;

  if (!user) {
    render = (
      <Avatar sx={{ ...style, width: size, height: size }}>
        <Image
          src={logo}
          width={size * 0.7}
          height={size * 0.7}
          alt="User Image"
        />
      </Avatar>
    );
  } else if (!user.image) {
    render = (
      <Avatar
        sx={{
          ...style,
          width: size,
          height: size,
          bgcolor: stringToColor(user.name),
        }}
      >
        <Image
          src={logo}
          width={size * 0.7}
          height={size * 0.7}
          alt="User Image"
        />
      </Avatar>
    );
  } else {
    render = (
      <Avatar
        sx={{ ...style, width: size, height: size }}
        src={user.image}
        alt="User Image"
      />
    );
  }

 return render;
}
