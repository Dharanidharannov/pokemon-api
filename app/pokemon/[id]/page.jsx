"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const PokemonDetail = ({ params }) => { 
    const [pokemon, setPokemon] = useState(null); 
    const [loading, setLoading] = useState(true);
    const { id } = params; 

    useEffect(() => {
        const fetchPokemon = async () => {
            if (id) {
                console.log(`Fetching details for Pokémon ID: ${id}`);
    
                try {
                    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    console.log("API Response:", res.data);
    
                    if (res.data) {
                        setPokemon(res.data);
                    } else {
                        console.log("No data returned from API");
                    }
                } catch (error) {
                    console.log("Error fetching Pokémon details", error);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("No ID provided");
                setLoading(false);
            }
        };
    
        fetchPokemon();
    }, [id]); 
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!pokemon) {
        return <div>No Pokémon found</div>;
    }

    return (
        <div className="p-10">
            <div className="flex flex-col items-center bg-blue-900 rounded-2xl p-6 w-60">
                {pokemon.sprites?.front_default ? (
                    <Image
                        src={pokemon.sprites.front_default}
                        alt={pokemon.name}
                        height={200}
                        width={200}
                    />
                ) : (
                    <div>No image available</div>
                )}
                <h1 className="text-white text-2xl capitalize">{pokemon.name}</h1>
                <p className="text-white">Height: {pokemon.height}</p>
                <p className="text-white">Weight: {pokemon.weight}</p>
                <p className="text-white">Base Experience: {pokemon.base_experience}</p>
                <p className="text-white">Types:</p>
                <ul className="text-white">
                    {(pokemon.types || []).map((typeInfo, index) => (
                        <li key={index}>{typeInfo.type.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PokemonDetail;

