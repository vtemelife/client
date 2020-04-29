import React from "react";
import { Navbar, Nav } from "react-bootstrap";

import { _ } from "trans";
import { history } from "setupHistory";

interface IProps {
  name?: string;
  children?: any;
  fixed?: boolean;
}

const Header: React.SFC<IProps> = ({ name, children, fixed }) => (
  <div className="container-header">
    <Navbar className={fixed ? "fixed-top" : ""}>
      <Nav.Item className="header-back" onClick={history.goBack}>
        <i className="fa fa-angle-left fa-2x" />
      </Nav.Item>
      <Nav.Item className="header-title">{name || _("VTeme")}</Nav.Item>
      <Nav.Item className="header-menu">{children || null}</Nav.Item>
    </Navbar>
  </div>
);

export default Header;
