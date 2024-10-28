
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faChartPie, faCog, faHandHoldingUsd} from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import CSALogo from "../assets/img/CSA Logo.svg";
import UGVLogo from "../assets/img/cisp_logo.svg";
import { socket } from "../services/socket";

export default () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={100} height={100} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.DashboardOverview.path}>
          <Image src={UGVLogo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem title="CISP LAB" link={Routes.DashboardOverview} image={UGVLogo} />

              <Dropdown.Divider className="my-3 border-indigo" />

              <NavItem title="Control Panel" link={Routes.DashboardOverview.path} icon={faChartPie} />
              <NavItem title="Log Page" icon={faHandHoldingUsd} link={Routes.Log.path} />
              <NavItem title="Mapping" icon={faCog} link={Routes.Mapping.path} />
              <NavItem title="Settings" icon={faCog} link={Routes.Settings.path} />

              <Button onClick={() => socket.emit("Stop", 'Stop')} className="upgrade-to-pro bg-danger"><FontAwesomeIcon icon={faExclamationTriangle} className="me-1" /> Emergancy Stop</Button>
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
