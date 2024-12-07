import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumberString, validateSync } from 'class-validator';

export class EnvVariables {
  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  MONGO_URI: string;

  @IsNotEmpty()
  @IsString()
  PORT: string;

  @IsNotEmpty()
  @IsNumberString()
  ACCESS_TOKEN_EXPIRATION: string;

  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsNotEmpty()
  @IsNumberString()
  REFRESH_TOKEN_EXPIRATION: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Validation failed for environment variables: ${errors
        .map((err) => Object.values(err.constraints).join(', '))
        .join('; ')}`,
    );
  }

  return validatedConfig;
}
