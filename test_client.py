# test_client.py

import asyncio
import websockets
import json
import time

async def run_test():
    """
    Kết nối đến AI Server WebSocket, gửi một câu hỏi, và in ra câu trả lời.
    """
    uri = "ws://localhost:8001/ws/query"

    test_payload = {
        "question": "What symptoms are presented by diseases that are treated by Fulvestrant?",
        "history": []
    }

    print(f"Connecting to AI Server at {uri}...")

    try:
        start_time = time.time()

        # ⚙️ Tăng timeout để không bị ngắt kết nối sớm
        async with websockets.connect(
            uri,
            ping_interval=60,   # gửi ping mỗi 60s (mặc định là 20s)
            ping_timeout=120,   # chờ pong tối đa 120s trước khi cắt
            close_timeout=10    # thời gian chờ đóng kết nối
        ) as websocket:
            print("Connection successful!")

            # 1. Gửi request
            print(f"\nSending request: \n{json.dumps(test_payload, indent=2)}")
            await websocket.send(json.dumps(test_payload))

            # 2. Nhận dữ liệu liên tục (nếu server stream kết quả)
            print("\nWaiting for response...\n")

            async for message in websocket:
                try:
                    response_json = json.loads(message)
                    print(json.dumps(response_json, indent=2, ensure_ascii=False))
                except json.JSONDecodeError:
                    print(message)

            end_time = time.time()
            print("="*57)
            print(f"\nTotal time (client-side): {end_time - start_time:.2f} seconds")

    except ConnectionRefusedError:
        print(f"\n[ERROR] Connection refused.")
        print(">>> Make sure your AI server is running on 'localhost:8001'.")
        print(">>> Run this in your other terminal: uvicorn server_ai_main:app --host 0.0.0.0 --port 8001")

    except websockets.exceptions.ConnectionClosedOK:
        print("\n✅ Connection closed cleanly by server.")
    except Exception as e:
        print(f"\n[ERROR] An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(run_test())
