import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../Core/Datasource/Prisma";
import {NotificationType, Prisma, TimeUnit} from "@prisma/client";
import Bcrypt from "../../Core/Security/Service/encryption/Bcrypt";
import NotificationPreferenceRepository from "./NotificationPreferenceRepository";
import {NotificationPreferenceType} from "../Entity/NotificationPreferenceType";
import {
    SaveNotificationPreferenceDto
} from "../UseCase/Notifications/NotificationPreference/CreateNotificationPreference/SaveNotificationPreferenceDto";

@Injectable()
export default class UserRepository {
    constructor(
	    private readonly prisma: PrismaService,
	    private readonly bcrypt: Bcrypt
    ) {
    }

    async getAll() {
	  return this.prisma.user.findMany();
    }

    async findById(id: number) {
	  return this.prisma.user.findUnique({
		where: {id},
	  });
    }

    async findByEmail(email: string) {
	  return this.prisma.user.findUnique({
		where: {email},
	  });
    }

    async create(dto: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>) {
	  let hashedPassword = null;
	  if (dto.password) {
		hashedPassword = await this.bcrypt.hash(dto.password);
	  }

	  // Prepare notification preference DTO
	  const notifPrefDto = new SaveNotificationPreferenceDto();
	  notifPrefDto.types = [NotificationType.EMAIL, NotificationType.PUSH];
	  notifPrefDto.timeBefore = 15;
	  notifPrefDto.timeUnit = TimeUnit.MINUTES;

	  // Create the user along with its notification preference in one transaction.
	  const user = await this.prisma.user.create({
		data: {
		    email: dto.email,
		    password: hashedPassword,
		    firstName: dto.firstName,
		    lastName: dto.lastName,
		    lastLoginDate: new Date(),
		    googleAccessToken: dto.googleAccessToken,
		    NotificationPreference: {  // Notice the capital "N"
			  create: {
				types: {
				    create: notifPrefDto.types.map((type) => ({type})),
				},
				timeBefore: notifPrefDto.timeBefore,
				timeUnit: notifPrefDto.timeUnit,
			  },
		    },
		},
		include: {
		    NotificationPreference: true,
		},
	  });

	  return user;
    }

    async save(data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>) {
	  return this.prisma.user.update({
		where: {id: data.id as number},
		data: data as Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>
	  });
    }

    /**
     * Vérifie si l’utilisateur est connecté via Google.
     * Ici, nous considérons que si `password` est null, l’utilisateur s’est inscrit via Google.
     */
    async hasGoogleAuth(userId: number): Promise<boolean> {
	  const user = await this.findById(userId);
	  return user && user.password === null;
    }
}
