import { Injectable, Logger } from '@nestjs/common';
import { CohereClient, CohereError, CohereTimeoutError } from 'cohere-ai';

@Injectable()
export class CohereService {
  private readonly client: CohereClient;
  private readonly logger = new Logger(CohereService.name);

  constructor() {
    const key = process.env.COHERE_API_KEY;
    if (!key) throw new Error('COHERE_API_KEY is not defined in env');

    this.client = new CohereClient({ token: key });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.client.generate({
        model: 'command-r-plus-04-2024',
        prompt,
        maxTokens: 500,
        temperature: 0.7,
        stopSequences: ['--'],
      });
      return response.generations?.[0]?.text.trim() ?? '';
    } catch (err: unknown) {
      if (err instanceof CohereTimeoutError) {
        this.logger.error('Timeout when calling Cohere', err);
        throw new Error(
          'The request to Cohere timed out. Please try again later.',
        );
      }
      if (err instanceof CohereError) {
        this.logger.error(`Error Cohere ${err.statusCode}`, err);
        throw new Error(err.message);
      }
      this.logger.error('Unknown error in Cohere', err as Error);
      throw new Error('Unknown error in Cohere');
    }
  }
}
