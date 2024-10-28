import React from "react";
import { } from "@fortawesome/react-fontawesome";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from '@themesberg/react-bootstrap';
import { TemperatureWidget, SalesValueWidgetPhone, HumidityWidget, BatteryWidget, LoadWidget } from "../components/Widgets";


export default () => {

  return (
    <>

<Row className="justify-content-md-center mt-4">
<Col xs={12} sm={6} className="mb-4">
  <TemperatureWidget
    title="Temperature"
  />
</Col>

<Col xs={12} sm={6} className="mb-4">
  <HumidityWidget
    title="Humidity"
  />
</Col>
</Row>

<Col xs={12} className="mb-4 d-none d-sm-block">
<BatteryWidget
  title="Battery"
/>
</Col>

      <Col xs={12} className="mb-4 d-sm-none">
        <SalesValueWidgetPhone
          title="Sales Value"
          value="10,567"
          percentage={10.57}
        />
      </Col>



    </>
  );
};
/*
<Row className="justify-content-md-center mt-4">
<Col xs={12} sm={6} className="mb-4">
  <TemperatureWidget
    title="Temperature"
  />
</Col>

<Col xs={12} sm={6} className="mb-4">
  <HumidityWidget
    title="Humidity"
  />
</Col>
</Row>

<Col xs={12} className="mb-4 d-none d-sm-block">
<BatteryWidget
  title="Battery"
/>
</Col>*/