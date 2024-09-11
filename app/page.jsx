"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"

function Home() {
    const [pokemonCollection, setPokemonCollection] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); 

    useEffect(() => {
        axios.get('https://pokeapi.co/api/v2/pokemon?limit=900')
            .then((res) => {
                const details = res.data.results.map((pokemon, index) => ({
                    name: pokemon.name,
                    id: index + 1,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
                }));
                setPokemonCollection(details);
            })
            .catch((error) => {
                console.log("error in fetching", error);
            });
    }, []);

   
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPokemon = pokemonCollection.slice(indexOfFirstItem, indexOfLastItem);

   
    const totalPages = Math.ceil(pokemonCollection.length / itemsPerPage);

    
    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

  
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="bg-teal-600 w-full">
                <p className="text-white text-lg">Pokemon Collections</p>
            </div>

            <div className="grid grid-cols md:grid-cols-4 gap-10 p-20">
                {currentPokemon.map((pokemon) => (
                    <div key={pokemon.id} className="flex flex-col items-center bg-blue-900 rounded-2xl p-3">
                        <Image 
                            src={pokemon.image} 
                            alt={pokemon.name} 
                            height={100} 
                            width={100} 
                        />
                        <p className="text-white">{pokemon.name}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center space-x-4 mt-4">
                <button 
                    className="bg-teal-500 text-white px-4 py-2 rounded-md" 
                    onClick={handlePrev} 
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="text-black mt-2">Page {currentPage} of {totalPages} </span>
                <button 
                    className="bg-teal-500 text-white px-4 py-2 rounded-md" 
                    onClick={handleNext} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Home;
