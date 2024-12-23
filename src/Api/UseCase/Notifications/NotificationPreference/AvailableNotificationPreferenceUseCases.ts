import CreateNotificationPreferenceUseCase from "./CreateNotificationPreference/CreateNotificationPreferenceUseCase";
import DeleteNotificationUseCase from "./DeleteNotificationPreference/DeleteNotificationPreferenceUseCase";
import GetNotificationPreferenceUseCase from "./GetNotificationPreference/GetNotificationPreferenceUseCase";

export type AvailableNotificationPreferenceUseCases =
  | CreateNotificationPreferenceUseCase
  | GetNotificationPreferenceUseCase
  | DeleteNotificationUseCase;
