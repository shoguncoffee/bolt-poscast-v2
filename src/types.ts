export interface SpeakerResponse {
  message: string
  data: {
    speaker_id: string
    speaker_name: string
    eng_name: string
    thai_name: string
    image: string
    face_image: string
    horizontal_face_image: string
    square_image: string
    audio: string
    voice_style: string[]
    age_style: string
    speech_style: string[]
    speed: string
    popularity: string
    type: number
    language: string
    status: boolean
    gender: string
    private: boolean
    allow_uid?: string[]
    available_language: string[]
    premier: boolean
    eng_age_style: string
    eng_gender: string
    eng_popularity: string
    eng_speech_style: string[]
    eng_speed: string
    eng_voice_style: string[]
    can_sold: boolean
    price_thb: number
    price_usd: number
    user_id: string
    language_code: string
    price: number
    tier: string
    speaker_v2: boolean
  }[]
}

export interface YoutubeUploadRequest {
  filename: string;
  title: string;
  description: string;
  privacy: 'public' | 'unlisted' | 'private';
}

export interface YoutubeUploadResponse {
    id: string;
    snippet: {
      title: string;
      description: string;
    };
    status: {
      privacyStatus: 'public' | 'unlisted' | 'private';
    };
}

export type OAuth2ProvidersResponse = {
  name: string;
  scope: string;
}[];

export interface ConnectResponse {
  url: string;
}

export interface Credentials {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  refresh_token_expires_in: number;
  expiry_date: number;
}