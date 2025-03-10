import {
  Field,
  GraphQLISODateTime,
  Int,
  Float,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";
import User from "./User";
import { ChronometerMode } from "@prisma/client"; // Import direct de l'enum de Prisma

// Enregistrement de l'enum pour GraphQL
registerEnumType(ChronometerMode, {
  name: "ChronometerMode",
  description: "Les modes disponibles pour le chronomètre",
});

@ObjectType()
export default class Chronometer {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => ChronometerMode)
  mode: ChronometerMode;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startTime?: Date;

  @Field(() => Int)
  elapsedTime: number; // Temps écoulé en secondes depuis le démarrage du chronomètre

  @Field(() => Float, { nullable: true })
  duration?: number; // Pour le mode COUNTDOWN: durée totale configurée en secondes

  @Field()
  isRunning: boolean;

  @Field(() => Int)
  userId: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt?: Date;
}
