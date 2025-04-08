
import React from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container } from '@themesberg/react-bootstrap';
import WebvizPage from "./Map3d";


export default () => {

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col className="map_3d_webviz">
          <WebvizPage />

          </Col>
        </Row>
      </Container>
    </>
  );
};