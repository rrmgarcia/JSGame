import React, { useState, useEffect } from "react";

const PokeDex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${displayCount}`)
      .then((response) => response.json())
      .then((data) => {
        const promises = data.results.map((pokemon) => {
          return fetch(pokemon.url)
            .then((response) => response.json())
            .catch((error) => console.log("Error fetching data:", error));
        });

        Promise.all(promises)
          .then((detailedPokemonList) => {
            setPokemonList(detailedPokemonList);
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 20);
  };

  useEffect(() => {
    fetchPokemon();
  }, [displayCount]);

  return (
    <div>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name}></img>
            <p id="pokemon-name">{pokemon.name.toUpperCase()}</p>
            <p>
              Type:{" "}
              {pokemon.types.map((typeData) => typeData.type.name).join(", ")}
            </p>
          </li>
        ))}
      </ul>
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
};

export default PokeDex;
