import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import path from 'node:path';
import * as fs from 'node:fs';
import dayjs from 'dayjs';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4300',
      'http://192.168.0.39:4200',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  if (process.env.USE_SWAGGER) {
    // ── Swagger ──────────────────────────────────────────────────────────────
    const swaggerConfig = new DocumentBuilder()
      .setTitle('LMStudio Wrapper API')
      .setDescription('REST API for LM Studio Wrapper')
      .setVersion('2.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    // ─────────────────────────────────────────────────────────────────────────

    const outputPath = path.resolve(process.cwd(), 'openapi.json');
    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');
    console.log(`📄 OpenAPI JSON written to ${outputPath}`);
  }
  if (process.env.USE_SWAGGER)
    console.log(
      `📖 Swagger UI at   http://localhost:${process.env.PORT ?? 8888}/api`,
    );
  await app.listen(process.env.PORT ?? 8888);
}
bootstrap();
