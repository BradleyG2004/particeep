import React, { useEffect, useState } from 'react';
import { ChakraProvider, Card, CardBody, CardFooter, Image, Stack, Heading, Text, Divider, Button, ButtonGroup, GridItem, Grid, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber, IconButton, Box } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux';
import { movies$ } from './movies'
import { RootState } from './store'
import { setMovies, setCategory, deleteMovie, setMoviesPerPage, setCurrentPage, toggleLikeDislike } from './moviesSlice'

interface Movie {
  id: string;
  title: string;
  category: string;
  likes: number;
  dislikes: number;
}

function App() {
  const dispatch = useDispatch();
  const { filteredMovies, categories, category, moviesPerPage, currentPage } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    movies$.then(movies => {
      dispatch(setMovies(movies));
    });
  }, [dispatch]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCategory(e.target.value));
  };

  const handleMoviesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setMoviesPerPage(parseInt(e.target.value)));
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredMovies.length / moviesPerPage)) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const deleteMovieHandler = (id: string) => {
    dispatch(deleteMovie(id));
  };

  const handleToggle = (id: string, isLike: boolean) => {
    dispatch(toggleLikeDislike({ id, isLike }));
  };

  return (
    <ChakraProvider>
      <div style={{ width: "94vw", margin: "40px", borderWidth: "2px", borderColor: "orange", borderRadius: "5px", fontFamily: "Chakra Petch" }}>
        <table>
          <tr>
            <td>
              <div style={{ borderWidth: "2px", width: "150px", borderColor: "black", borderRadius: "5px", margin: "5px" }}>
                <label>🎥 par pages </label>
                <select style={{ color: "orange" }} onChange={handleMoviesPerPageChange} value={moviesPerPage}>
                  <option>8</option>
                  <option>4</option>
                  <option>12</option>
                </select>
              </div>
            </td>
            <td>
              <div style={{ borderWidth: "2px", width: "200px", borderColor: "black", borderRadius: "5px", margin: "5px" }}>
                <label>Categories </label>
                <select style={{ color: "orange" }} onChange={handleCategoryChange} value={category}>
                  <option>All</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </td>
          </tr>
        </table>
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} style={{ marginLeft: "5px" }}>
          {currentMovies.map((movie) => (
            <GridItem key={movie.id} borderWidth={2} borderColor="black" borderRadius="5px" p={4} boxShadow="md">
              <Box height="150px" bgImage="url('https://cdn-icons-png.flaticon.com/128/4221/4221419.png')" bgSize="contain" bgPosition="center" bgRepeat="no-repeat" />
              <StatGroup mt={4}>
                <Stat>
                  <StatLabel style={{ fontSize: "30px", color: "orange" }}>Likes</StatLabel>
                  <StatNumber style={{ fontSize: "20px" }}>{movie.likes}</StatNumber>
                  <StatHelpText>
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel style={{ fontSize: "30px", color: "orange" }}>Dislikes</StatLabel>
                  <StatNumber style={{ fontSize: "20px" }}>{movie.dislikes}</StatNumber>
                  <StatHelpText>
                  </StatHelpText>
                </Stat>
              </StatGroup>
              <h2 style={{ fontWeight: "bold", color: "orange", fontSize: "25px" }}><u><span style={{ color: "black" }}>{movie.title}</span></u></h2>
              <Button
                onClick={() => handleToggle(movie.id, true)}
                colorScheme="green"
              >
                👍
              </Button>
              <Button
                onClick={() => handleToggle(movie.id, false)}
                colorScheme="red"
              >
                👎
              </Button>
              <IconButton
                aria-label="Delete movie"
                icon={<DeleteIcon />}
                onClick={() => deleteMovieHandler(movie.id)}
                style={{ marginLeft: "238px" }}
              />
            </GridItem>
          ))}
        </Grid>
        <Box display="flex" marginLeft="1400px" marginTop="20px">
          <Button onClick={prevPage} isDisabled={currentPage === 1} marginRight="10px">
            Previous
          </Button>
          <Button onClick={nextPage} isDisabled={currentPage >= Math.ceil(filteredMovies.length / moviesPerPage)}>
            Next
          </Button>
        </Box>
      </div >
    </ChakraProvider >
  );
}

export default App;
