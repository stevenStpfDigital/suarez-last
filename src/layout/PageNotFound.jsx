import React from "react";
import { useRouteError } from "react-router-dom";
import PagesDBroker from "./PagesDBroker";

const PageNotFound = () => {
  const error = useRouteError();

  return (
    <PagesDBroker title={error ? error.statusText : "Page not found"}>
    <section className="container mt-5 d-flex justify-content-center">
      <h3>WE SORRY THIS PAGE DOES NOT EXISIT</h3>
      <p>{error && <i>{error.statusText || error.message}</i>}</p>
    </section>
    </PagesDBroker>
  );
};

export default PageNotFound;
