import React, { useState, useEffect } from 'react';
import { Container, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import googleDriveService from '../services/googleDriveService';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [driveFiles, setDriveFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriveFiles = async () => {
      try {
        setLoading(true);
        const files = await googleDriveService.listFiles();
        setDriveFiles(files);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch Drive files:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDriveFiles();
    }
  }, [currentUser]);

  return (
    <Container>
      <h1>Dashboard</h1>
      {currentUser && (
        <div>
          <p>Welcome, {currentUser.email}</p>
          <Button variant="danger" onClick={logout}>Logout</Button>

          <h2 className="mt-4">Your Google Drive Files</h2>
          {loading ? (
            <p>Loading files...</p>
          ) : error ? (
            <p>Error loading files: {error.message}</p>
          ) : (
            <ListGroup>
              {driveFiles.map((file) => (
                <ListGroup.Item key={file.id}>
                  {file.name} - {file.mimeType}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      )}
    </Container>
  );
};

export default Dashboard;
