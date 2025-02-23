// pages/index.jsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import TopAppBar from "../components/TopAppBar";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import axios from "axios";

const IndexPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      const response = await axios.get("/api/v1/lsov/typing-game");
      setGames(response.data);
    }
    fetchGames();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("/api/v1/lsov/typing-game/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Refresh games list
    const response = await axios.get("/api/v1/lsov/typing-game");
    setGames(response.data);
  };

  return (
    <Layout>
      <TopAppBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <input type="file" onChange={handleUpload} accept=".md" />
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Completion Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <Link href={`/exercise/${game.id}`} passHref>
                      <Button>{game.name}</Button>
                    </Link>
                  </TableCell>
                  <TableCell>{game.completionCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
};

export default IndexPage;
