export interface PushNotificationPayload {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
}