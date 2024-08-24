import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.select(SeederModule).get(SeederService);

    await seederService.seed();

    await app.close();

    console.log('Seeding complete!');
  } catch (error) {
    console.log('Seeding failed, error: ', error);
    throw error;
  }
  

  NestFactory.createApplicationContext(AppModule)
    .then((appContext) => {
      const seeder = appContext.select(SeederModule).get(SeederService);
      seeder
        .seed()
        .then(() => {
          console.log('Seeding complete!');
        })
        .catch((error) => {
          console.log('Seeding failed, error: ', error);
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch((error) => {
      console.log('Seeding failed, error: ', error);
      throw error;
    });
}

bootstrap();
