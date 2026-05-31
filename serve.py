#!/usr/bin/env python3
"""Servidor estàtic local per provar el flux complet del Parlamalament.
   Ús:  python3 serve.py   →  http://127.0.0.1:4321
"""
import os, functools, http.server, socketserver

DIR = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "4321"))

os.chdir(DIR)
Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIR)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print("Parlamalament servint %s a http://127.0.0.1:%d" % (DIR, PORT))
    httpd.serve_forever()
