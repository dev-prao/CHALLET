import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useAuthStore from '../store/useAuthStore';

class WebSocketService {
  private stompClient: Client | null = null;
  private socketUrl: string;
  private subscriptions: { [key: string]: () => void } = {};

  constructor(socketUrl: string) {
    this.socketUrl = socketUrl;
  }

  // 웹소켓 연결 설정
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stompClient && this.stompClient.connected) {
        // console.log('WebSocket 이미 연결되어 있습니다.');
        resolve(); // 이미 연결된 상태면 바로 resolve
        return;
      }
      const socket = new SockJS(this.socketUrl);
      const token = useAuthStore.getState().accessToken;
      const headers = { Authorization: `Bearer ${token}` };
      this.stompClient = new Client({
        webSocketFactory: () => socket as WebSocket,
        connectHeaders: headers,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        console.log(frame);
        resolve(); // 연결 성공 시 resolve 호출
      };

      this.stompClient.onStompError = (frame) => {
        console.error('STOMP 오류:', frame.headers['message']);
        reject(new Error('WebSocket 연결 중 오류 발생'));
      };

      this.stompClient.onDisconnect = (frame) => {
        console.log(frame);
      };

      // console.log('WebSocket 연결 시도:', this.stompClient);
      this.stompClient.activate(); // 연결 시작
    });
  }

  // 웹소켓이 연결되어 있는지 확인하는 메서드 추가
  isConnected(): boolean {
    return this.stompClient !== null && this.stompClient.connected;
  }

  // 거래내역 채널 구독
  subscribeTransaction(challengeId: string, callback: (message: any) => void) {
    const destination = `/topic/challenges/${challengeId}/shared-transactions`;
    if (this.stompClient && this.stompClient.connected) {
      const subscription = this.stompClient.subscribe(destination, callback);
      this.subscriptions[destination] = () => subscription.unsubscribe();
    } else {
      // console.warn('WebSocket 연결이 되지 않았습니다.');
    }
  }

  // 이모지 채널 구독
  subscribeEmoji(challengeId: string, callback: (message: any) => void) {
    const destination = `/topic/challenges/${challengeId}/emoji`;
    if (this.stompClient && this.stompClient.connected) {
      const subscription = this.stompClient.subscribe(destination, callback);
      this.subscriptions[destination] = () => subscription.unsubscribe();
    } else {
      // console.warn('WebSocket 연결이 되지 않았습니다.');
    }
  }

  // 서버로 메시지 전송
  sendMessage(destination: string, payload: any) {
    const token = useAuthStore.getState().accessToken;

    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination,
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      console.error('WebSocket 연결되지 않았습니다.');
    }
  }

  // 웹소켓 연결 종료
  disconnect() {
    if (this.stompClient) {
      Object.keys(this.subscriptions).forEach((key) => {
        this.subscriptions[key](); // 모든 구독 해제
      });
      this.stompClient.deactivate();
    }
  }
}

// WebSocketService 인스턴스 생성
const webSocketUrl = import.meta.env.VITE_API_URL + '/api/challet/ws'; // 서버에서 웹소켓 연결을 처리하는 URL
const webSocketService = new WebSocketService(webSocketUrl);

export default webSocketService;
