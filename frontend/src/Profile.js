

import { Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';

const EducationItem = ({ institute, degree, grade, startYear, endYear }) => (
  <ListItem>
    <ListItemText
      primary={`${degree} in ${institute}`}
      secondary={`Grade: ${grade}, ${startYear} - ${endYear}`}
    />
  </ListItem>
);

const WorkExperienceItem = ({ company, position, startYear, endYear }) => (
  <ListItem>
    <ListItemText
      primary={`${position} at ${company}`}
      secondary={`${startYear} - ${endYear}`}
    />
  </ListItem>
);

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, Cityville',
    education: [
      {
        institute: 'University of Example',
        degree: 'Bachelor of Science',
        grade: 'A',
        startYear: '2015',
        endYear: '2019',
      },
      {
        institute: 'College of Engineering',
        degree: 'Master of Science',
        grade: 'A+',
        startYear: '2019',
        endYear: '2021',
      },
    ],
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Software Engineer',
        startYear: '2021',
        endYear: '2022',
      },
      {
        company: 'Innovate Labs',
        position: 'Senior Software Engineer',
        startYear: '2022',
        endYear: 'Present',
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {user.name}'s Profile
      </Typography>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              <strong>Address:</strong> {user.address}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Education
        </Typography>
        <List>
          {user.education.map((edu, index) => (
            <EducationItem key={index} {...edu} />
          ))}
        </List>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Work Experience
        </Typography>
        <List>
          {user.workExperience.map((exp, index) => (
            <WorkExperienceItem key={index} {...exp} />
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default Profile;
