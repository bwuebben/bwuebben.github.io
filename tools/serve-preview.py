#!/usr/bin/env python3
"""Serve this checkout only on loopback, with a preview ribbon and noindex headers."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import io
import os
ROOT=Path(__file__).resolve().parents[1]
BANNER='''<aside style="position:fixed;bottom:0;left:0;right:0;z-index:9999;padding:9px 20px;background:#241e1d;color:#f8f4ed;display:flex;justify-content:center;gap:18px;flex-wrap:wrap;font:12px/1.4 -apple-system,BlinkMacSystemFont,Arial,sans-serif;box-shadow:0 -1px 0 #66534d"><span>LOCAL PREVIEW</span><a href="/review/" style="color:#f1c2b7;text-decoration:underline">Review the six proposals</a><a href="http://127.0.0.1:8765/" target="_blank" rel="noopener" style="color:#f1c2b7;text-decoration:underline">Compare current site ↗</a></aside>'''.encode('utf-8')
class Preview(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("X-Robots-Tag","noindex, nofollow, noarchive")
        self.send_header("Cache-Control","no-store")
        super().end_headers()
    def send_head(self):
        path=Path(self.translate_path(self.path))
        if path.is_dir():path=path/"index.html"
        if path.is_file() and path.suffix==".html":
            body=path.read_bytes()
            body=body.replace(b'href="https://bwuebben.github.io/',b'href="/')
            body=body.replace(b"</body>",BANNER+b'<div style="height:65px"></div></body>')
            self.send_response(200)
            self.send_header("Content-Type","text/html; charset=utf-8")
            self.send_header("Content-Length",str(len(body)))
            self.end_headers()
            return io.BytesIO(body)
        return super().send_head()
if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port",type=int,default=8766)
    args=parser.parse_args()
    os.chdir(ROOT)
    print("Local preview: http://127.0.0.1:"+str(args.port)+"/",flush=True)
    ThreadingHTTPServer(("127.0.0.1",args.port),Preview).serve_forever()
