// pages/_app.js
import React from "react";
// import "../styles/globals.css"; // Optional: if you have any global CSS

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
