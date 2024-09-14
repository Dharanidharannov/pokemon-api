"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

function Home() {
    const [pokemonCollection, setPokemonCollection] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); 
    const [debounceTimeout, setDebounceTimeout] = useState(null); 
    const [types, setTypes] = useState([]); 
    const [selectedType, setSelectedType] = useState("all"); 

    // Fetch Pokemon data
    useEffect(() => {
        axios.get('https://pokeapi.co/api/v2/pokemon?limit=900')
            .then((res) => {
                const details = res.data.results.map((pokemon, index) => ({
                    name: pokemon.name,
                    id: index + 1,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
                }));
                setPokemonCollection(details);
                setFilteredPokemon(details);
            })
            .catch((error) => {
                console.log("error in fetching", error);
            });

// filter pokemon details by categories
            axios.get('https://pokeapi.co/api/v2/type')
            .then((res) => {
                setTypes(res.data.results); 
            })
            .catch((error) => {
                console.log("error in fetching types", error);
            });
    
    }, []);

    

    // Debounced search effect
    useEffect(() => {
        if (debounceTimeout) clearTimeout(debounceTimeout); 

        const timeout = setTimeout(() => {
            const filtered = pokemonCollection.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPokemon(filtered);
            setCurrentPage(1);
        }, 300);

        setDebounceTimeout(timeout); 
        return () => clearTimeout(timeout); 
    }, [searchTerm, pokemonCollection]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPokemon = filteredPokemon.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

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
            {/* Search bar */}
            <div className="bg-emerald-600 flex flex-col justify-evenly md:flex-row   items-center p-4">
                <p className=" text-lg font-bold">Pokemon Collections</p>
                <input
                    type="text"
                    className="p-3 w-full md:w-80 border border-emerald-600 rounded-xl mt-4 md:mt-0 ml-96"
                    placeholder="Search Pokemon"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                 <select
                        className="p-1 w-60 md:w-24 border border-emerald-600 rounded-xl"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        {types.map((type) => (
                            <option key={type.name} value={type.name}>
                                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                            </option>
                        ))}
                    </select>
            </div>

            {/* Pokemon grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 md:p-8 lg:p-20">
                {currentPokemon.map((pokemon) => (
                    <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id}>
                        <div className="flex flex-col items-center bg-blue-900 rounded-2xl p-3 cursor-pointer">
                            <p className="text-white">#{pokemon.id}</p>
                            <Image
                                src={pokemon.image}
                                alt={pokemon.name}
                                height={100}
                                width={100}
                            />
                            <p className="text-white capitalize">{pokemon.name}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center space-x-4 mt-4 mb-8">
                <button
                    className="bg-teal-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                <span className="text-black mt-2">Page {currentPage} of {totalPages}</span>
                <button
                    className="bg-teal-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
