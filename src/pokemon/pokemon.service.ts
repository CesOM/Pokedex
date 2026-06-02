import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { MongoServerError } from 'mongodb';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Server } from 'http';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemon: CreatePokemonDto) {
    try {
      createPokemon.name = createPokemon.name?.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemon);
      return pokemon;
    } catch (error) {
      
      this.handleExceptions(error);

    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    } else {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase(),
      });
    }

    // MongoID
    if( isValidObjectId( term ) ){
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with term ${term} not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne(term);
  
      if( updatePokemonDto.name )
          updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
  
      const updatePokemon = await pokemon.updateOne( updatePokemonDto, {new: true})
      return {...pokemon.toJSON(), ...updatePokemonDto};
    }catch(error){
      
      this.handleExceptions(error);

    }
    

  }

  async remove(id: string) {
    try{
      const pokemon = await this.findOne(id)
      await pokemon.deleteOne()

      return 'Pokemon eliminado correctamente';
    }catch(error){

      this.handleExceptions(error);

    }
  }

  private handleExceptions (error: any){
    if(error instanceof MongoServerError && error.code === 11000){
      throw new BadRequestException(
        `Pokemon exists in DB ${JSON.stringify(error.keyValue)}`,
      )
    }
    console.log(error)
    throw new InternalServerErrorException(`Can't create pokeomn - check server logs`);
  }
}
