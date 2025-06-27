import { Share2, Music } from 'lucide-react';
import { useState, useRef } from 'react';
import { YoutubeUploadRequest, YoutubeUploadResponse, OAuth2ProvidersResponse, ConnectResponse } from '../types.js';
import Supabase from '../supabase/client.js';

interface ExportShareProps {
}

async function getToken() {
  const session = await Supabase.auth.getSession();

  const access_token = session.data.session?.access_token
  const refresh_token = session.data.session?.refresh_token;

  return {
    'authorization': 'Bearer ' + access_token,
    'refresh-Token': refresh_token as string,
  };
}

export default function ExportShare(props: ExportShareProps) {
  const ShareMenu = useRef<HTMLDivElement>(null);
  const filename = useRef<string>('');
  const [video_src, setVideo] = useState<string>();

  async function handleGenerateVideo() {
    const image_element = document.getElementById('thumbnail') as HTMLInputElement;
    const audio_element = document.getElementById('audio') as HTMLAudioElement;
    // const video_element = document.getElementById('video') as HTMLVideoElement;

    const form = new FormData();
    form.append('image', image_element.files![0]);
    form.append('audio', audio_element.src);

    const res = await fetch('/api/video', {
      method: 'POST',
      headers: {
        ...await getToken(),
      },
      body: form,
    });

    setVideo(
      URL.createObjectURL(await res.blob())
    );

    const disposition = res.headers.get('Content-Disposition')!;
    filename.current = disposition.match(/filename="([^"]+)"/)![1];
  }

  async function handleShare() {
    const title_element = document.getElementById('podcast-title') as HTMLInputElement;
    const title = title_element.value || 'podcast';

    const res = await fetch('/api/upload/youtube', {
      method: 'POST', headers: {
        'Content-type': 'application/json',
        ...await getToken(),
      },
      body: JSON.stringify({
        filename: filename.current,
        title: title,
        description: '',
        privacy: 'unlisted',
      } as YoutubeUploadRequest),
    })

    const info: YoutubeUploadResponse = await res.json();

    return `https://youtu.be/${info.id}`;
  };

  async function on_message(event: MessageEvent) {
    console.log('on_message:', event.data);

    const url = await handleShare();
    const youtube_tab = window.open(url, 'youtube_tab');
    console.log('Share URL:', url);

    window.removeEventListener('message', on_message);
  }

  async function handleConnect() {
    const res = await fetch('/api/oauth2/connections', {
      headers: {
        ...await getToken(),
      },
    });
    const providers: OAuth2ProvidersResponse = await res.json();
    const connection = providers.find(item => item.name === 'youtube');

    if (connection === undefined) {
      const res = await fetch('/api/oauth2/connections/youtube', {
        headers: {
          ...await getToken(),
        },
      });
      const connect: ConnectResponse = await res.json();

      const auth_tab = window.open(connect.url, 'auth_tab');
      window.addEventListener('message', on_message);
    }
    else {
      const url = await handleShare();
      const youtube_tab = window.open(url, 'youtube_tab');
    }

    ShareMenu.current!.hidden = true;
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-center">
        <Share2 className="w-5 h-5 mr-2" />
        Export & Share
      </h3>
      <div className="space-y-3">

        {/* upload thumbnail */}
        <div className="space-y-3 p-4 bg-gray-700 rounded-lg border border-gray-600 shadow-inner">
          <input type="file" id='thumbnail'/>
        </div>

        {/* Generate Video Button */}
        <div className="flex items-center gap-2 justify-center">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1 disabled:opacity-50"
            onClick={handleGenerateVideo}
          >
            Export Video
          </button>
        </div>

        {/* video player */}
        {video_src && (
          <video id='video' src={video_src} controls/>
        )}

        {/* Share Dropdown */}
        {video_src && (
          <div className="relative">
            <button
              onClick={() => {
                ShareMenu.current!.hidden = !ShareMenu.current!.hidden;
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </button>
            <div ref={ShareMenu} hidden className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-10">
              {['Youtube'].map(platform => (
                <button
                  key={platform}
                  onClick={handleConnect}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 flex items-center"
                >
                  <Music className="w-4 h-4 mr-3" />
                  {platform}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}