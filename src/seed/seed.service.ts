import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios'; //Dependencia oculta
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios; // Se visibiliza la dependencia en la clase meiante una instancia

  constructor(
    @InjectModel(Pokemon.name) // Inyección de dependencias e inyección de modelo por Nest
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // DELETE * FROM pokemons;

    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = Number(segments[segments.length - 2]); // Penultima posición con el ID del pokémon en la URL
      // console.log([name, no]);
      pokemonToInsert.push({ name, no }); // Construcción de cada documento a insertar
    });

    await this.pokemonModel.insertMany(pokemonToInsert); // Una sola inserción múltiple sin resolver múltiples promesas

    return `Seed Executed`;
  }
}
