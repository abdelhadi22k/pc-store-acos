import React from 'react';
import Placeholder from 'react-bootstrap/Placeholder';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SectionLoding = () => {


  return (
    <Container   className='Placeholder'>

    <Row>
    {[...Array(6)].map((_, idx) => (
      <Col sm={6} lg={4} className="mb-3" key={idx}>
        <Placeholder  animation="glow">
          <Placeholder style={{ height: '200px', width: '340px', marginBottom: '20px' }} />
          <Placeholder xs={9} className="mb-2" />
          <Placeholder xs={8} className="mb-2" />
          <Placeholder xs={8} className="mb-2" />
        </Placeholder>
      </Col>
    ))}
  </Row>
    </Container>
  );
};

export default SectionLoding;
