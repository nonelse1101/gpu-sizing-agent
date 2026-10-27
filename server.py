#!/usr/bin/env python3
"""Local HTTP server for Google Cloud GPU Sizing Agent (bound strictly to 127.0.0.1)."""

import http.server
import json
import os
import socketserver

# Bind strictly to 127.0.0.1 for local dev; bind to 0.0.0.0 only inside Cloud Run (K_SERVICE set)
HOST = "0.0.0.0" if os.environ.get("K_SERVICE") else "127.0.0.1"
PORT = int(os.environ.get("PORT", "8080" if os.environ.get("K_SERVICE") else "8765"))
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

CATALOG_SUMMARY = {
    "status": "ok",
    "service": "gpu-sizing-agent",
    "version": "1.2.0",
    "verified_gcp_regions_count": 43,
    "pitch_decks": {
        "portfolio": [
            {"label": "go/ai-infra-pitch", "url": "https://goto.google.com/ai-infra-pitch"},
            {"label": "go/which-gpu", "url": "https://goto.google.com/which-gpu"},
            {"label": "go/gpus-pricing", "url": "https://goto.google.com/gpus-pricing"},
            {"label": "go/dws-pitch", "url": "https://goto.google.com/dws-pitch"},
            {"label": "go/gke-ai-pitch", "url": "https://goto.google.com/gke-ai-pitch"},
            {"label": "go/horizon", "url": "https://goto.google.com/horizon"},
        ],
        "b200": [
            {"label": "go/a4-pitchdeck", "url": "https://goto.google.com/a4-pitchdeck"},
            {"label": "go/a4x-pitchdeck", "url": "https://goto.google.com/a4x-pitchdeck"},
            {"label": "go/a4-price", "url": "https://goto.google.com/a4-price"},
            {"label": "go/b200-skus", "url": "https://goto.google.com/b200-skus"},
        ],
        "h200": [
            {"label": "go/a3ultra-preview-guide", "url": "https://goto.google.com/a3ultra-preview-guide"},
            {"label": "go/a3-ultra-pricing-template", "url": "https://goto.google.com/a3-ultra-pricing-template"},
        ],
        "h100": [
            {"label": "go/a3mega-preview-guide", "url": "https://goto.google.com/a3mega-preview-guide"},
        ],
        "g4": [
            {"label": "go/g4-pitch-deck", "url": "https://goto.google.com/g4-pitch-deck"},
            {"label": "go/g4-overview", "url": "https://goto.google.com/g4-overview"},
            {"label": "go/g4-price", "url": "https://goto.google.com/g4-price"},
        ],
        "tpu7x": [
            {"label": "go/cloudtpu-launchpad/ironwood/ironwood-overview", "url": "https://goto.google.com/cloudtpu-launchpad/ironwood/ironwood-overview"},
            {"label": "go/ironwood-customer-faqs", "url": "https://goto.google.com/ironwood-customer-faqs"},
            {"label": "go/tpu-gpu-session25", "url": "https://goto.google.com/tpu-gpu-session25"},
        ],
    },
    "platforms": [
        {
            "id": "b200",
            "machine_type": "a4-highgpu-8g",
            "accelerator": "NVIDIA B200",
            "devices_per_node": 8,
            "mem_per_device_gb": 180,
            "mem_per_node_gb": 1440,
            "bw_tbps_per_device": 8.0,
            "fp8_tflops_per_device": 4500,
            "cud3y_usd_per_gpu_hr": 8.506,
            "pitch_deck": "https://goto.google.com/a4-pitchdeck",
        },
        {
            "id": "h200",
            "machine_type": "a3-ultragpu-8g",
            "accelerator": "NVIDIA H200",
            "devices_per_node": 8,
            "mem_per_device_gb": 141,
            "mem_per_node_gb": 1128,
            "bw_tbps_per_device": 4.8,
            "fp8_tflops_per_device": 1979,
            "cud3y_usd_per_gpu_hr": 5.77,
            "pitch_deck": "https://goto.google.com/a3ultra-preview-guide",
        },
        {
            "id": "h100",
            "machine_type": "a3-megagpu-8g",
            "accelerator": "NVIDIA H100 80GB",
            "devices_per_node": 8,
            "mem_per_device_gb": 80,
            "mem_per_node_gb": 640,
            "bw_tbps_per_device": 3.35,
            "fp8_tflops_per_device": 1979,
            "cud3y_usd_per_gpu_hr": 4.90,
            "pitch_deck": "https://goto.google.com/a3mega-preview-guide",
        },
        {
            "id": "g4",
            "machine_type": "g4-standard-384",
            "accelerator": "NVIDIA RTX PRO 6000 Blackwell Server Edition (96GB)",
            "devices_per_node": 8,
            "mem_per_device_gb": 96,
            "mem_per_node_gb": 768,
            "bw_tbps_per_device": 1.8,
            "fp8_tflops_per_device": 1250,
            "cud3y_usd_per_gpu_hr": 1.33,
            "pitch_deck": "https://goto.google.com/g4-pitch-deck",
        },
        {
            "id": "l4",
            "machine_type": "g2-standard-96",
            "accelerator": "NVIDIA L4 (24GB)",
            "devices_per_node": 8,
            "mem_per_device_gb": 24,
            "mem_per_node_gb": 192,
            "bw_tbps_per_device": 0.30,
            "fp8_tflops_per_device": 242,
            "cud3y_usd_per_gpu_hr": 0.56,
            "pitch_deck": "https://goto.google.com/which-gpu",
        },
        {
            "id": "tpu7x",
            "machine_type": "tpu7x-8 (4 chips = 8 devices)",
            "accelerator": "Cloud TPU7x (2 dies/devices per chip, 96GB HBM3e/device)",
            "devices_per_node": 8,
            "mem_per_device_gb": 96,
            "mem_per_node_gb": 768,
            "bw_tbps_per_device": 7.37,
            "fp8_tflops_per_device": 4614,
            "cud3y_usd_per_device_hr": 4.28,
            "pitch_deck": "https://goto.google.com/cloudtpu-launchpad/ironwood/ironwood-overview",
        },
    ],
}


class SecureStaticHandler(http.server.SimpleHTTPRequestHandler):
    """Serves static files from STATIC_DIR with strict security headers."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; frame-ancestors 'none';",
        )
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        super().end_headers()

    def do_GET(self):
        if self.path == "/api/v1/health":
            payload = json.dumps({"status": "ok", "service": "gpu-sizing-agent"}).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        if self.path == "/api/v1/catalog":
            payload = json.dumps(CATALOG_SUMMARY, indent=2).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        return super().do_GET()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), SecureStaticHandler) as httpd:
        print(f"Serving Google Cloud GPU Sizing Agent at http://{HOST}:{PORT}")
        httpd.serve_forever()
