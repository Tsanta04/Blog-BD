import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SiretVerificationService {
  private readonly apiUrl = 'https://api.insee.fr/api-sirene/3.11/siret';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verifySiret(siret: string): Promise<boolean> {
    const apiKey = this.configService.get<string>('INSEE_API_KEY');

    if (!apiKey) {
      throw new Error('Clé API INSEE non trouvée dans le .env');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/${siret}`, {
          headers: {
            'X-INSEE-Api-Key-Integration': apiKey,
            Accept: 'application/json',
          },
        }),
      );

      return !!response.data?.etablissement;
    } catch (error) {
      if (error.response?.status === 404) {
        // SIRET non trouvé
        return false;
      }

      console.error(
        `Erreur lors de la vérification du SIRET ${siret}:`,
        error.response?.data || error.message,
      );

      throw new HttpException(
        'Erreur lors de la vérification du SIRET',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
