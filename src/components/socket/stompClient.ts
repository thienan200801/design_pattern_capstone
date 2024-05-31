import * as Stomp from "stompjs";
import SockJS from "sockjs-client/dist/sockjs.js";
import { MessageRequest } from "../../models/message";

class StompClient {
  private stompClient: Stomp.Client | null = null;
  private subscriptions: { [key: string]: Stomp.Subscription } = {};

  subcribe(topic: string, callback: (message: Stomp.Message) => void): void {
    if (this.stompClient && this.stompClient.connected) {
      const subscription = this.stompClient.subscribe(topic, callback);
      this.subscriptions[topic] = subscription;
    }
  }

  ubsubcribe(topic: string): void {
    const subscription = this.subscriptions[topic];
    if (subscription) {
      subscription.unsubscribe();
      delete this.subscriptions[topic];
    }
  }

  connect(
    endpoint: string,
    onConnect: () => void,
    onError: (error: string) => void
  ) {
    const socket = new SockJS(endpoint);
    this.stompClient = Stomp.over(socket);

    if (this.stompClient && !this.stompClient.connected) {
      this.stompClient.connect(
        {},
        (frame) => {
          console.log("Connected: " + frame);
          onConnect();
        },
        (error) => {
          console.error("STOMP error: " + error);
          onError(error.toString());
        }
      );
    }
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect(() => {
        console.log("Disconnected");
      });
    }
  }

  send(message: MessageRequest) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        "/app/private-message",
        {},
        JSON.stringify(message)
      );
    }
  }
}

export default new StompClient();
