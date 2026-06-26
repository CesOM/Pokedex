import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class SeedService {

  constructor(private readonly http: HttpService) {}

  async executeSeed() {
    const { data } = await firstValueFrom(this.http.get('https://pokeapi.co/api/v2/pokemon?limit=1'));
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      console.log(segments);
      const no = +segments[segments.length - 2];
      console.log(name, no);
    });
    return data;
  }
}
