import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { PrismaService } from "src/Core/Datasource/Prisma";
import DeviceDto from "../Dto/DeviceDto";
@Resolver()
export class DeviceResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation(() => DeviceDto)
  async registerDevice(
    @Args('userId') userId: number,
    @Args('platform') platform: string,
    @Args('token') token: string,
  ) {
    // Supprimez d'abord tout ancien token pour cet utilisateur et cette plateforme
    await this.prisma.deviceToken.deleteMany({
      where: {
        userId,
        platform,
      },
    });

    // Créez un nouvel enregistrement de token
    return this.prisma.deviceToken.create({
      data: {
        userId,
        platform,
        token,
      },
    });
  }
}
