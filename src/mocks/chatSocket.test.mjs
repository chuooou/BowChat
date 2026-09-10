import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { setupServer } from "msw/node";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("./") && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { handlers } = await import("./handlers.ts");
const server = setupServer(...handlers);
const pause = () => new Promise((resolve) => setTimeout(resolve, 40));
const receive = (socket) =>
  new Promise((resolve) => {
    socket.addEventListener("message", (event) => resolve(JSON.parse(event.data)), { once: true });
  });

test(
  "chat bids validate, broadcast only within the room, and persist through REST",
  { timeout: 8000 },
  async () => {
    server.listen({ onUnhandledRequest: "bypass" });
    const sockets = [];
    try {
      for (const roomId of ["100", "100", "200"]) {
        const socket = new WebSocket(`ws://localhost/ws/chat/${roomId}`);
        sockets.push(socket);
        await new Promise((resolve, reject) => {
          socket.addEventListener("open", resolve, { once: true });
          socket.addEventListener("error", reject, { once: true });
        });
      }
      const [sender, peer, other] = sockets;
      const otherEvents = [];
      const peerEvents = [];
      other.addEventListener("message", (event) => otherEvents.push(event.data));
      peer.addEventListener("message", (event) => peerEvents.push(event.data));
      const bid = { type: "PLACE_BID", requestId: "bid-1", roomId: "100", amount: 760000 };
      const success = receive(sender);
      const broadcast = receive(peer);
      sender.send(JSON.stringify({ ...bid, bidderNickname: "spoof", userId: 999 }));
      const placed = await success;
      assert.equal(placed.type, "BID_PLACED");
      assert.equal(placed.highestBidder, "츄츄");
      assert.equal(placed.message.content, "760000");
      assert.equal(placed.message.senderId, 1);
      assert.deepEqual(await broadcast, placed);

      for (const payload of [
        "{",
        "null",
        JSON.stringify({ ...bid, type: "UNKNOWN" }),
        JSON.stringify({ ...bid, roomId: "200" }),
        ...[0, -1, "800000", null, 750000, 760000].map((amount) =>
          JSON.stringify({ ...bid, amount }),
        ),
      ]) {
        const response = receive(sender);
        sender.send(payload);
        const rejected = await response;
        assert.equal(rejected.type, "BID_REJECTED");
        assert.equal(rejected.roomId, "100");
        assert.equal(rejected.currentHighestBid, 760000);
        const parsed = JSON.parse(payload === "{" ? "null" : payload);
        if (
          parsed?.type === "PLACE_BID" &&
          parsed.roomId === "100" &&
          [750000, 760000].includes(parsed.amount)
        ) {
          assert.equal(rejected.reason, "현재 최고 입찰가보다 높은 금액을 입력해주세요.");
        }
      }
      const headers = { Authorization: "Bearer mock" };
      const room = await fetch("http://localhost/api/chat/rooms/100", { headers }).then((r) =>
        r.json(),
      );
      const history = await fetch("http://localhost/api/chat/messages/100", { headers }).then((r) =>
        r.json(),
      );
      assert.equal(room.auction.highestBid, 760000);
      assert.equal(room.auction.highestBidder, placed.highestBidder);
      assert.deepEqual(history.messages.at(-1), placed.message);
      assert.equal(room.messages.at(-1).amount, 760000);
      const otherRoom = await fetch("http://localhost/api/chat/rooms/200", { headers }).then((r) =>
        r.json(),
      );
      assert.equal(otherRoom.auction.highestBid, 750000);
      peer.close();
      await pause();
      const next = receive(sender);
      sender.send(JSON.stringify({ ...bid, requestId: "bid-2", amount: 770000 }));
      assert.equal((await next).highestBid, 770000);
      await pause();
      assert.equal(peerEvents.length, 1);
      assert.equal(otherEvents.length, 0);
    } finally {
      sockets.forEach((socket) => socket.close());
      await pause();
      server.close();
    }
  },
);
