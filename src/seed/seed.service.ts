import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class SeedService {

  constructor(private readonly http: HttpService) {}

  async executeSeed() {
    const { data } = await firstValueFrom(this.http.get('https://pokeapi.co/api/v2/pokemon?limit=650'));
    return data;
  }
}
