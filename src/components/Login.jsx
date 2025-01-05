import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body className="text-center">
              <h2 className="mb-4">Welcome to WorkMaster Pro</h2>
              <p>Please sign in with your Google account to continue</p>
              <div className="d-flex justify-content-center">
                <Button 
                  variant="outline-primary" 
                  onClick={login}
                  className="d-flex align-items-center gap-2"
                >
                  <img 
                    src="https://developers.google.com/identity/images/g-logo.png" 
                    alt="Google" 
                    style={{ width: '20px', height: '20px' }} 
                  />
                  Sign in with Google
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
