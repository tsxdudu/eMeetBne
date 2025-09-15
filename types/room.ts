export interface Room {
  id: string;
  name: string;
  isPublic: boolean;
  password?: string;
  createdAt: Date;
  participantCount: number;
  maxParticipants: number;
}

export interface CreateRoomRequest {
  name: string;
  isPublic: boolean;
  password?: string;
  maxParticipants?: number;
}

export interface JoinRoomRequest {
  roomId: string;
  userName: string;
  password?: string;
}

export interface LiveKitTokenResponse {
  token: string;
  url: string;
  roomName: string;
}