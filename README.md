# Google Cloud GPU Recommender & Sizing Agent (`gpu-sizing-agent`)

An interactive **AI Infrastructure Sizing, Silicon Recommender & Unit Economics Calculator** for Google Cloud GPU platforms (**NVIDIA B200 `a4-highgpu-8g`**, **NVIDIA H200 `a3-ultragpu-8g`**, **NVIDIA H100 `a3-megagpu-8g`**, **NVIDIA RTX PRO 6000 Blackwell `g4-standard`**, **NVIDIA L4 `g2-standard`**) with device-for-device parity against **Cloud TPU7x (Ironwood)** and **Cloud TPU v6e (Trillium)** across both **LLM** (`$/1M tokens`) and **Computer Vision / Geo-Perception** (`$/1M images`) workloads.

- **Live Demo (Cloud Run)**: [https://gpu-sizing-agent-1098179634941.us-central1.run.app/](https://gpu-sizing-agent-1098179634941.us-central1.run.app/)
- **Companion Tool — TPU Sizing Agent**: [https://tpu-sizing-agent-q2fm2rxu6a-uc.a.run.app/](https://tpu-sizing-agent-q2fm2rxu6a-uc.a.run.app/)
- **License**: Apache 2.0

---

## Key Features

### 1. Executive Overview (`1. Overview`)
- **5 Enterprise Use-Case Presets**:
  - **Conversational AI & Assistants** (`Llama-3.1-8B` / `Gemma-3-27B`)
  - **Agentic AI & High-Rate 70B Serving** (`Llama-3.3-70B` / `Qwen-2.5-72B`)
  - **Long-Context & Frontier MoE RAG** (`Qwen3.5-397B-A17B` / `DeepSeek-V3 671B`)
  - **Frontier Model Training & RL** (`70B–671B Pre-Training, SFT & GRPO`)
  - **Vision, Geo-Perception & Batch CV** (`SigLIP2-Giant`, `ConvNeXt`, `EfficientNet`, `MMDetection` / Point-Cloud hybrid fleets)
- **Workload Lens & Pricing Basis Switchers**: Instantly toggle between **Real-Time Serving**, **Fine-Tuning (SFT/RL)**, and **Pre-Training** across **On-Demand**, **1-Year CUD**, and **3-Year CUD** reference rates.
- **Visual Multi-Platform TCO & Fleet Comparison Bars**: Side-by-side fleet size, monthly spend, and unit economics (`$/1M tokens` or `$/1M images`) with live GCE zone verification across 43 Google Cloud regions.

### 2. Guided Silicon Picker (`2. GPU Recommender`)
- **Multi-Factor Scoring Engine**: Dynamically evaluates and ranks Google Cloud GPU families (`B200`, `H200`, `H100`, `G4 96GB`, `L4 24GB`) alongside **Cloud TPU7x** and **Cloud TPU v6e** parity options across:
  1. **Optimization Priority**: `Lowest Cost`, `Strict Low Latency (TTFT/TPOT)`, `Maximum Compute Throughput & HBM`, or `Immediate Regional Capacity`.
  2. **Model Parameter Scale**: `< 14B`, `14B to 32B`, `32B to 120B`, `200B+ Frontier & MoE`, plus a **Long-Context (`>= 128K tokens`) Tiebreaker**.
  3. **Workload Nature**: `Real-Time Serving`, `Overnight Batch & Extraction`, `Fine-Tuning (SFT/RLHF)`, `Foundation Pre-Training`, or **`Computer Vision, Geo-Perception & Batch Media`**.
  4. **Technical Deep-Dive**: Serving runtime (`vLLM / llm-d`, `TensorRT-LLM / Dynamo`, `SGLang`) and target regional scope.

### 3. Engineering Cockpit (`3. Engineering Cockpit`)
- **Domain A — LLM Inference Serving Sizing (Empirical + Roofline Physics)**:
  - **Empirical Benchmark Mode** (`tok/s/GPU` + utilization headroom) & **Roofline Physics (`llm-d`) Mode** (disaggregated Prefill & Decode pools + KV Cache HBM bar).
- **Domain B — Model Training Sizing (`6 * N * D` Physics & ZeRO-3 Sharding)**:
  - Computes total training FLOPs, cluster duration, GPU-days, ZeRO-3 / FSDP HBM footprint, and **GKE NodePool Terraform**.
- **Domain C — Vision / CV & Legacy Cloud Fleet Migration Sizing (`Img/s` + Legacy GPU Mapper)**:
  - **Batch CV & Data Gravity Physics**: Sizes queue-driven visual pipelines from `Daily New Images + Monthly Re-runs`, `Raw Payload (MB/img -> TB/day read)`, K8s microservice deployment count (1-GPU / 1-Chip granular slices vs. multi-model MPS packing), and monthly retraining GPU-hours, outputting **`$/1M Images`** unit economics.
  - **Empirical `TPU v6e` & GPU Benchmark Anchors + Production Triage**:
    - `SigLIP2-Giant 384px` (`~195 img/s/chip` on `TPU v6e` with `FP32 + torch.compile(dynamic=False)`; flags `BF16` real-image retrieval recall degradation).
    - `ConvNeXt-Tiny / EfficientNet-B0 224px` (`~2,020–2,285 img/s/chip` in `BF16`; flags `~67%` Host↔Device PCIe & CPU decode bottleneck).
    - `Custom-CUDA Detectors (MMDetection / MMCV / LiDAR)` isolated onto single-GPU `g4-standard-48` (`96 GB`) or `g2-standard` (`L4 24 GB`) VMs, while standard PyTorch CV pods target `ct6e-standard-1t` single-chip slices for clean PJRT process isolation.
  - **Cloud-to-Cloud Legacy GPU Migration Mapper**: Maps source AWS / Azure fleets (`A10/A10G`, `L40S`, `T4`, `A100`, `H100`) to die-aligned GCP GPU & TPU replacements, exporting ready-to-paste **CCA Capacity Briefs** and **GKE Hybrid NodePool Terraform**.

---

## Hardware Catalog & TPU Device-Parity Reference

> **TPU Device-Parity Rules**:
> - **Cloud TPU7x (Ironwood)**: 1 chip = **2 dies (2 software devices)**, each with 1 TensorCore + **96 GB HBM3e** (`7.37 TB/s`, `2,307 TFLOPs FP8` / `1,153.5 TFLOPs BF16` per device; `4,614 FP8` / `2,307 BF16` per chip). A 4-chip TPU7x VM exposes **8 devices (768 GB HBM3e/VM)**, aligning **1:1 by device count** with an 8-GPU VM ([TPU7x Documentation](https://docs.cloud.google.com/tpu/docs/tpu7x)).
> - **Cloud TPU v6e (Trillium)**: 1 chip = **1 TensorCore + 2 SparseCores = 1 software device** with **32 GB HBM** (`1.60 TB/s`, `918 TFLOPs BF16` / `1,836 TOPs INT8` per chip). Supports single-chip `ct6e-standard-1t` (`1 chip = 1 device`), `4t`, and `8t` slices ([TPU v6e Documentation](https://docs.cloud.google.com/tpu/docs/v6e)).

| Platform | GCP Machine Series | Devices / VM | Memory / Device | Memory / VM | Bandwidth / Device | Peak Compute / Device |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **NVIDIA B200** | `a4-highgpu-8g` | 8 GPUs | 180 GB HBM3e | 1,440 GB | 8.00 TB/s | 4,500 TF FP8 / 2,250 BF16 |
| **NVIDIA H200** | `a3-ultragpu-8g` | 8 GPUs | 141 GB HBM3e | 1,128 GB | 4.80 TB/s | 1,979 TF FP8 / 989 BF16 |
| **NVIDIA H100** | `a3-megagpu-8g` | 8 GPUs | 80 GB HBM3 | 640 GB | 3.35 TB/s | 1,979 TF FP8 / 989 BF16 |
| **NVIDIA RTX PRO 6000** | `g4-standard` | 1–8 GPUs | 96 GB GDDR7 | 768 GB (8g) | 1.50 TB/s | 1,000 TF FP8 / 500 BF16 |
| **NVIDIA L4** | `g2-standard` | 1–8 GPUs | 24 GB GDDR6 | 192 GB (8g) | 0.30 TB/s | 242 TF FP8 / 121 BF16 |
| **Cloud TPU7x** | `tpu7x-standard-8t` | 8 Devices (4 Chips) | 96 GB HBM3e | 768 GB | 7.37 TB/s | 2,307 TF FP8 / 1,153.5 BF16 |
| **Cloud TPU v6e** | `ct6e-standard-1t/4t/8t` | 1 / 4 / 8 Devices | 32 GB HBM | 32–256 GB | 1.60 TB/s | 918 TF BF16 / 1,836 TOPs INT8 |

---

## Quick Start

### Run Locally
```bash
git clone https://github.com/nonelse1101/gpu-sizing-agent.git
cd gpu-sizing-agent
python3 server.py
# Open http://127.0.0.1:8765
```

### Deploy to Google Cloud Run
```bash
gcloud run deploy gpu-sizing-agent \
  --source=. \
  --region=us-central1 \
  --allow-unauthenticated
```

---

## Author & Contributions

- **Author**: **Felix Li** ([@nonelse1101](https://github.com/nonelse1101))

Contributions, issue reports, benchmark calibrations, and pull requests are welcome!
