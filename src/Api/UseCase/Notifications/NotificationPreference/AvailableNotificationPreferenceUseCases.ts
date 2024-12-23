import CreateNotificationPreferenceUseCase from "./CreateNotificationPreference/CreateNotificationPreferenceUseCase";
import DeleteNotificationUseCase from "./DeleteNotificationPreference/DeleteNotificationPreferenceUseCase";

export type AvailableNotificationPreference =
  | CreateNotificationPreferenceUseCase
  | DeleteNotificationUseCase;
