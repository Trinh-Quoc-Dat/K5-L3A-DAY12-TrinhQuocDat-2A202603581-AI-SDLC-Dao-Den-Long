from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import webbrowser

ROOT = Path(__file__).resolve().parents[1]
URL = "http://127.0.0.1:8000/"
handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
server = ThreadingHTTPServer(("127.0.0.1", 8000), handler)
threading.Timer(0.6, lambda: webbrowser.open(URL)).start()
print(f"Đảo Đèn Lồng đang chạy: {URL} (Ctrl+C để dừng)", flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
