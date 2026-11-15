import http.server
import socketserver
import webbrowser
import os

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print(f"✨ छठ महापर्व एआई दर्शन (Virtual AI Chhath Ghat) चालू हो गया है!")
        print(f"🌐 ब्राउज़र में खोलें: {url}")
        print("=" * 60)
        print("बंद करने के लिए Ctrl + C दबाएं।")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        httpd.serve_forever()

if __name__ == "__main__":
    run()
