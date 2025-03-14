import React from "react";
import "./Header.css";

const Header: React.FC = (props: any) => {
  return (
    <header className="d-flex justify-content-between align-items-md-center pb-3 mb-5 border-bottom">
      <h1 className="h4">
        <span className="title">Dental Laboratory</span>
        <span className="menu2">
          <a className="link-underline" href={"/entity-registration"}>
            Register
          </a>
        </span>
        <span className="menu2">
          <a className="link-underline" href="/">
            Home
          </a>
        </span>
      </h1>
    </header>
  );
};

export default Header;
