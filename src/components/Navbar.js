
import React, { useState, useEffect, useCallback } from "react";
import { faTemperatureLow, faEyeDropper, faBatteryThreeQuarters, faSignal } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from '@themesberg/react-bootstrap';
import { CounterWidget } from "./Widgets";
import { socket } from "../services/socket";

export default () => {

  const [navbarData, setNavbarData] = useState({ temperature: 'waiting...', humidity: 'waiting...', battery: 'waiting...', connection: 'waiting...' });

  const handleNavbarData = useCallback((data) => {
    setNavbarData((prevData) => {
      if (prevData.temperature !== data.temperature || prevData.humidity !== data.humidity || prevData.battery !== data.battery || prevData.connection !== data.connection) {
        return data;
      }
      return prevData;
    });
  }, []);

  useEffect(() => {
    socket.on('Navbar', handleNavbarData);
  }, [handleNavbarData]);

  return (
    <>

      <Row className="justify-content-md-center mt-4">

        <Col xs={6} lg={3} className="mb-4">
          <CounterWidget category="Temp." title={navbarData.temperature + "°"} icon={faTemperatureLow} iconColor="shape-secondary" />
        </Col>

        <Col xs={6} lg={3} className="mb-4">
          <CounterWidget category="Humidity" title={navbarData.humidity + "%"} icon={faEyeDropper} iconColor="shape-secondary" />
        </Col>

        <Col xs={6} lg={3} className="mb-4">
          <CounterWidget category="Battery" title={navbarData.battery + "%"} icon={faBatteryThreeQuarters} iconColor="shape-secondary" />
        </Col>

        <Col xs={6} lg={3} className="mb-4">
          <CounterWidget category="ROS" title={navbarData.connection} icon={faSignal} iconColor="shape-secondary" />
        </Col>

      </Row>
    </>
  );
};
