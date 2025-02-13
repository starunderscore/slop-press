// pages/index.js
import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import TopAppBar from "../components/TopAppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

// For demonstration purposes, we're using static data.
// In a Next.js app, you could load data via getStaticProps or getServerSideProps.
const dummyExercises = [
  {
    id: "1",
    title: "Typing Challenge 1",
    description: "Practice your typing with this exercise.",
    slug: "/exercise/1",
  },
  {
    id: "2",
    title: "Typing Challenge 2",
    description: "Another challenge for your fingers.",
    slug: "/exercise/2",
  },
];

const IndexPage = () => {
  return (
    <Layout>
      <TopAppBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Typing Exercises
        </Typography>
        <Grid container spacing={3}>
          {dummyExercises.map((exercise) => (
            <Grid item xs={12} sm={6} md={4} key={exercise.id}>
              <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2">
                    {exercise.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exercise.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} href={exercise.slug}>
                    Start Exercise
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default IndexPage;
