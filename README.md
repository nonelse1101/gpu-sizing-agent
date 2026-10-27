# Google Cloud GPU Recommender & Sizing Agent (`gpu-sizing-agent`)

An interactive **AI Infrastructure Sizing, Silicon Recommender & Unit Economics Calculator** for Google Cloud GPU platforms (**NVIDIA B200 `a4-highgpu-8g`**, **NVIDIA H200 `a3-ultragpu-8g`**, **NVIDIA H100 `a3-megagpu-8g`**, **NVIDIA RTX PRO 6000 Blackwell `g4-standard`**, **NVIDIA L4 `g2-standard`**) with 1:1 device-for-device parity comparison against **Cloud TPU7x (Ironwood)**.

- **Live Demo (Cloud Run)**: [https://gpu-sizing-agent-1098179634941.us-central1.run.app/](https://gpu-sizing-agent-1098179634941.us-central1.run.app/)
- **Companion Tool — TPU Sizing Agent**: [https://tpu-sizing-agent-q2fm2rxu6a-uc.a.run.app/](https://tpu-sizing-agent-q2fm2rxu6a-uc.a.run.app/)
- **License**: Apache 2.0

---

## Key Features

### 1. Executive Overview (`1. Overview`)
- **4 Enterprise Use-Case Presets**:
  - **Conversational AI & Assistants** (`Llama-3.1-8B` / `Gemma-3-27B`)
  - **Agentic AI & High-Rate 70B Serving** (`Llama-3.3-70B` / `Qwen-2.5-72B`)
  - **Long-Context & Frontier MoE RAG** (`Qwen3.5-397B-A17B` / `DeepSeek-V3 671B`)
  - **Frontier Model Training & RL** (`70B–671B Pre-Training, SFT & GRPO`)
- **Workload Lens & Pricing Basis Switchers**: Instantly toggle between **Real-Time Serving**, **Fine-Tuning (SFT/RL)**, and **Pre-Training** across **On-Demand**, **1-Year CUD**, and **3-Year CUD** reference rates.
- **Visual Multi-Platform TCO & Fleet Comparison Bars**: Side-by-side fleet size, monthly spend, and `$/1M token` comparison aligned by 8-device nodes.

### 2. Guided Silicon Picker (`2. GPU Recommender`)
- **Multi-Factor Scoring Engine**: Dynamically evaluates and ranks all 5 Google Cloud GPU families (`B200`, `H200`, `H100`, `G4 96GB`, `L4 24GB`) across:
  1. **Optimization Priority**: `Lowest Cost ($/1M tok)`, `Strict Low Latency (TTFT/TPOT)`, `Maximum Compute Throughput & HBM`, or `Immediate Regional Capacity`.
  2. **Model Parameter Scale**: `< 14B`, `14B to 32B`, `32B to 120B`, `200B+ Frontier & MoE`, plus a **Long-Context (`>= 128K tokens`) Tiebreaker**.
  3. **Workload Nature**: `Real-Time Serving`, `Overnight Batch & Extraction`, `Fine-Tuning (SFT/RLHF)`, or `Foundation Pre-Training`.
  4. **Technical Deep-Dive**: Serving runtime (`vLLM / llm-d`, `TensorRT-LLM / Dynamo`, `SGLang`) and target regional scope.
- **Live Candidate Ranking Scoreboard**: Visualizes real-time match scores (`0–100 pts`) and dynamic workload sizing for the top GPU candidates, with one-click export into the Engineering Cockpit.

### 3. Engineering Cockpit (`3. Engineering Cockpit`)
- **Inference Serving Sizing (Empirical + Roofline Physics)**:
  - **Empirical Benchmark Mode**: Sizes GPU pools directly from measured single-GPU throughput (`1,000` / `3,000` / `5,000 tok/s/GPU`) and utilization headroom (`80%`).
  - **Roofline Physics (`llm-d`) Mode**: Computes disaggregated **Prefill Pool** (compute-bound `2 * P_active` FLOPs/tok at configurable MFU) and **Decode Pool** (HBM-bandwidth-bound weight + KV streaming at configurable MBU and batch concurrency).
  - **Visual Replica HBM Allocation Bar**: Displays Model Weights vs. Available KV Cache Pool vs. Runtime Activation Reserve per Tensor-Parallel replica.
- **Model Training Sizing (`6 * N * D` Physics & ZeRO-3 Sharding)**:
  - Computes total training FLOPs (`6 * Params * Tokens`), cluster duration (days/hours), GPU-days, and ZeRO-3 / FSDP sharded HBM footprint (`16 bytes/param` across weights, gradients, and FP32 AdamW states).
  - Auto-generates ready-to-copy **GKE NodePool & DWS Terraform** configuration snippets.

---

## Hardware Catalog & TPU7x Device-Parity Reference

> **Device-Parity Rule**: Each Cloud TPU7x chip contains **2 dies (devices)**, where each device is 1 TensorCore + **96 GB HBM3e** (`7.37 TB/s` bandwidth/device). A 4-chip TPU7x VM exposes **8 devices (768 GB HBM3e/VM)**, aligning **1:1 by device count** with an 8-GPU VM ([TPU7x Documentation](https://docs.cloud.google.com/tpu/docs/tpu7x)).

| Platform | GCP Machine Series | Devices / VM | Memory / Device | Memory / VM | Bandwidth / Device | FP8 Compute / Device |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **NVIDIA B200** | `a4-highgpu-8g` | 8 GPUs | 180 GB HBM3e | 1,440 GB | 8.00 TB/s | 4,500 TFLOPs |
| **NVIDIA H200** | `a3-ultragpu-8g` | 8 GPUs | 141 GB HBM3e | 1,128 GB | 4.80 TB/s | 1,979 TFLOPs |
| **NVIDIA H100** | `a3-megagpu-8g` | 8 GPUs | 80 GB HBM3 | 640 GB | 3.35 TB/s | 1,979 TFLOPs |
| **NVIDIA RTX PRO 6000** | `g4-standard` | 1–8 GPUs | 96 GB GDDR7 | 768 GB (8g) | 1.80 TB/s | 1,250 TFLOPs |
| **NVIDIA L4** | `g2-standard` | 1–8 GPUs | 24 GB GDDR6 | 192 GB (8g) | 0.30 TB/s | 242 TFLOPs |
| **Cloud TPU7x** | `tpu7x-standard-8t` | 8 Devices (4 Chips) | 96 GB HBM3e | 768 GB | 7.37 TB/s | 2,307 TFLOPs |

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
