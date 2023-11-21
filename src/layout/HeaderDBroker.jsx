import React, { useState } from "react";
import { Container, Navbar } from "react-bootstrap";
import logo from "../assets/images/logo1.svg";
import logoSmall from "../assets/images/logo3.svg";
import { Helmet } from "react-helmet/es/Helmet";
import { Link } from "react-router-dom";

export const HeaderDBroker = ({ transparent, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  const bgColor = transparent ? "" : "bg-primary bg-gradient";

  return (
    <>
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      <Navbar
        variant="dark"
        className={`border-bottom border-2 border-success py-1 ${bgColor}`}
      >
        <Container fluid className="ps-2 ps-xl-4 ms-md-2 pe-0">
          <Navbar.Brand href={`/`} className="p-0">
            <img src={logo} className="d-none d-md-block" alt="logo" />
            <img src={logoSmall} className="d-block d-md-none" alt="logo" />
          </Navbar.Brand>
          <Navbar.Collapse className="border-end border-1 border-white py-1 py-xxl-2">
            <div className="d-none d-xl-flex align-items-center ms-5 py-1 py-md-2">
              <Link
                to={`/`}
                className="text-white text-decoration-none"
              >
                <h2 className="my-0 fw-bold">SS Online</h2>
              </Link>
              {title && (
                <>
                  <h3 className="my-0 mx-2 text-white">/</h3>
                  <span className="text-white text-decoration-none">
                    <h4 className="my-0">{title}</h4>
                  </span>
                </>
              )}
            </div>
            <div className="pe-2 pe-xl-4 ms-auto d-flex justify-content-center align-items-center">
              {/* <NavbarUser
                firstName={isGen ? user.nmCliente : user.nmAsegurado}
                lastName={isGen ? user.apCliente : user.apAsegurado}
                role="Rol Usuario"
                avatar={`${routes.api}/user/img/${user.id}?v=${user.fcModifica}`}
              /> */}
            </div>
          </Navbar.Collapse>
          {/* <div onClick={toggle} className="text-white fs-4 px-3 px-xl-4 mx-md-2" role="button"
                           aria-label="menu"
                           style={{zIndex: 1046}}>
                          <i className={`icon-uqai icon-uqai-sm ${isOpen ? "uqai-cerrar" : "uqai-menu"}`}></i>
                      </div> */}
        </Container>
      </Navbar>

      {/* <Sidebar toggle={toggle} isOpen={isOpen}/> */}
    </>
  );
};

export default HeaderDBroker;
