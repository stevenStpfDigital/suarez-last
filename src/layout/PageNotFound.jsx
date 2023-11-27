import React from "react";
import { useRouteError } from "react-router-dom";
import backgroundError from "../assets/images/plataforma_fondo1.png";
import PagesDBroker from "./PagesDBroker";

const PageNotFound = () => {
  const error = useRouteError();

  return (
    <PagesDBroker title={error ? error.statusText : "Page not found"}>
      <section className="container mt-5 d-flex justify-content-center align-items-center">
        <div className="row text-center">
          <div className="col-12">
            <h1 className="  p-3 rounded">
              <b>404 Page not found!</b>
            </h1>
          </div>
          <div className="col-12 mt-3">
            <img
              src={backgroundError}
              width={550}
              alt="image_backGround"
              className="img-fluid rounded"
              style={{ position: "relative", zIndex: 1 }}
            />
            <div className=" my-5  d-flex flex-column justify-content-center align-items-center">
              <h3 className="">WE SORRY THIS PAGE DOES NOT EXIST</h3>
              <p className="">
                {error && <i>{error.statusText || error.message}</i>}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PagesDBroker>
  );
};

export default PageNotFound;
