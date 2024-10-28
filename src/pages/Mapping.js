
import React from "react";
import { } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Container } from '@themesberg/react-bootstrap';
import VideoComponent from "../components/Camera";


export default () => {

  return (
    <>
      <Container fluid>
        <Row className="justify-content-md-center mt-1">
          <Col className="">
            <VideoComponent />
          </Col>
        </Row>
      </Container>
    </>
  );
};
