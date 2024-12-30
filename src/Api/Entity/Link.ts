// src/Api/Entity/Link.ts
import { ObjectType, Field, Int } from "@nestjs/graphql";
import LinkGroup from "./LinkGroup";
import User from "./User";
import LinkClick from "./LinkClick";
import { File } from "./File"; // <-- Import la classe File

@ObjectType()
export default class Link {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  linkGroupId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => LinkGroup)
  linkGroup: LinkGroup;

  @Field(() => User)
  user: User;

  @Field(() => [LinkClick], { nullable: true })
  clicks?: LinkClick[];

  // si vous voulez afficher l'ID associé
  @Field(() => Int, { nullable: true })
  imageId?: number | null;

  // *** ICI : on expose `image` comme un champ GraphQL ***
  @Field(() => File, { nullable: true })
  image?: File | null;
}
