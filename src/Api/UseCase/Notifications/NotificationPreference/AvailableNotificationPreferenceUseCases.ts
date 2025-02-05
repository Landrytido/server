import CreateNotificationPreferenceUseCase from "./CreateNotificationPreference/CreateNotificationPreferenceUseCase";
import DeleteNotificationPreferenceUseCase from "./DeleteNotificationPreference/DeleteNotificationPreferenceUseCase";
import GetNotificationPreferenceUseCase from "./GetNotificationPreference/GetNotificationPreferenceUseCase";

export type AvailableNotificationPreferenceUseCases =
  | CreateNotificationPreferenceUseCase
  | GetNotificationPreferenceUseCase
  | DeleteNotificationPreferenceUseCase;
