import React from "react";
import { useRouter } from "next/router";

function Error({ statusCode }) {
  const router = useRouter();

  return (
    <div style={{ margin: "0 auto", textAlign: "center", padding: "20px" }}>
      <h1>An error occurred</h1>
      {statusCode && <p>Status Code: {statusCode}</p>}
      <p>Couldnt find the requested path: {router.asPath}</p>
      <button onClick={() => router.push("/")}>Go to Home</button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
