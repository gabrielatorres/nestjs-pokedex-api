import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginatioDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private readonly defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name) // Inyección de dependencias e inyección de modelo por Nest
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService, // Inyección de la configuración desde el servicio para no usar proccess.env
  ) {
    this.defaultLimit = configService.getOrThrow<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(paginatioDto: PaginatioDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginatioDto;
    return this.pokemonModel.find().limit(limit).skip(offset);
  }

  async findOne(id: string) {
    let pokemon: Pokemon | null = null;
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: +id });
    }

    //Mongo ID
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    //name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: id.toLowerCase().trim(),
      });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon not found`);
    return pokemon;
  }

  async update(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<Pokemon> {
    const pokemon = await this.findOne(id);
    try {
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(
        pokemon._id,
        updatePokemonDto,
        { new: true },
      );

      if (!updatedPokemon) throw new NotFoundException(`Pokemon not found`);
      return updatedPokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon no encontrado`);
    return;
  }

  private handleException(error: unknown): never {
    console.log(error);
    const mongoError = error as { code?: number; keyValue?: unknown };
    if (mongoError.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in DB ${JSON.stringify(mongoError.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Cant Create Pokémon, check the logs`,
    );
  }
}
