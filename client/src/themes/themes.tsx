"use client"
import { switchAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  defineStyleConfig,
  extendTheme
} from "@chakra-ui/react";
import { Global } from "@emotion/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle({
  track: {
    _checked: {
      bg: "brand.light",
    },
  },
});

const CopyButton = defineStyle({
  background: "brand.light",
  color: "white",
  _hover: {
    background: "brand.main",
  },
  _dark: {
    background: "brand.light",
    color: "white",
    _hover: {
      background: "brand.main",
    },
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { CopyButton },
});

export const switchTheme = defineMultiStyleConfig({ baseStyle });

export const GridItemStyle = () => (
  <Global
    styles={`
      .grid-item-thumbnail {
        border-radius: 12px;
      }
    `}
  />
);

export const theme = extendTheme({
  colors: {
    // 200-600 is for gradient
    brand: {
      main: "#3F3E5E",
      light: "#706D91",
      bg: "#F9F7FF",
      highlight: "#8186F1",
      contrast: "#00C893",
      200: "#7F527B",
      300: "#C16781",
      400: "#F38975",
      500: "#FFBC66",
      600: "#F9F871",
    },
  },
  // components: {
  //   Switch: switchTheme,
  //   Button: buttonTheme,
  // },
  fonts: {
    body: "sans-serif",
    heading: "sans-serif",
  },
});