import React from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";

const Pages = ({ brand, pages, pagesArray = Object.entries(pages) }) => (
  <>
    <PagesNav brand={brand} pagesArray={pagesArray} />
    <PagesContent pagesArray={pagesArray} />
  </>
);

const sanitize = (url) => url.split(/[^-A-Za-z0-9/]/g).join("");

const PagesNav = ({ brand, pagesArray }) => (
  <Navbar bg="light" expand="lg">
    <Container>
      <Navbar.Brand href="#home">
        {brand}
        {sanitize(useLocation().pathname)}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav variant="pills" as="ul">
          {pagesArray.map(([path, { name }]) => (
            <Nav.Item as="li" key={path}>
              <Nav.Link
                as={NavLink}
                to={path}
                className="px-2"
                data-testid={"nav" + path}
              >
                {name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

const PagesContent = ({ pagesArray }) => (
  <>
    <Container className="p-3">
      <Routes>
        {pagesArray.map(([path, { exact, element }]) => (
          <Route
            key={path}
            exact={exact}
            path={path}
            element={<div data-testid={"route" + path}>{element}</div>}
          />
        ))}
      </Routes>
    </Container>
  </>
);

Pages.propTypes = {
  brand: PropTypes.string.isRequired,
  pages: PropTypes.object,
  pagesArray: PropTypes.array,
};
PagesNav.propTypes = {
  brand: PropTypes.string.isRequired,
  pagesArray: PropTypes.array.isRequired,
};
PagesContent.propTypes = {
  pagesArray: PropTypes.array.isRequired,
};

export default Pages;
