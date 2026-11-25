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
  - **Empirical `TPU v6e` vs. Single-GPU (`G4` / `H100` / `A100`) Benchmark Anchors + Production Triage** (`torch.compile(dynamic=False)`, `batch=8`, host-fed, verified on 64 real COCO images; 1 `TPU v6e` chip = 1 device vs. 1 single-die GPU):
    - **Heavy Vision Transformer (`SigLIP2-Giant 384px`, 1.16B)**: `TPU v6e` leads at **`~195 img/s` (`FP32`, `63/64` recall)** vs. **`~133 img/s` (`H100`)**, **`~87 img/s` (`G4`)**, and **`~58 img/s` (`A100 80GB`)** with `FP32 + TF32` (`64/64` recall). `BF16` degrades real-image retrieval recall (`55–56/64`) on **both** GPU and TPU; PyTorch also defaults `cuda.matmul.allow_tf32=False` (`13–33 img/s` trap until `TF32` is enabled). XProf on `TPU v6e` confirms **`84.7%` pure device compute** (`86%` duty cycle, `4.61 GiB` peak HBM).
    - **Light CNN Classifiers (`ConvNeXt-Tiny` & `EfficientNet-B0 224px`, `BF16`, `62–63/64` top-1)**: Single-GPU **`G4` (`g4-standard-48`) leads at `4,854–5,520 img/s`**, ahead of **`H100` (`2,371–3,782`)**, **`TPU v6e` (`1,829–2,285`)**, and **`A100 80GB` (`1,203–1,911`)**, with ~2/3 of step time governed by Host↔Device PCIe transfer & CPU image decode.
    - **Custom-CUDA Detectors & Host Physical-Core Parity**: Isolates `MMDetection / MMCV` detectors onto single-GPU `g4-standard-48` (`96 GB`, `48 vCPU = 24 physical Turin cores`, whereas `a2-ultragpu-1g` has only `12 vCPU = 6 physical cores`), while standard PyTorch ViT pods target `ct6e-standard-1t` single-chip slices. Model code is unchanged on `G4`, but the runtime image must be rebuilt: prebuilt `CUDA 12.9` `torchvision` ops fail on `G4` (`no kernel image is available for execution on the device`); `CUDA 12.8 / 13.0` wheels or a source build work, and `MMCV` builds from source. Detectors do **not** run on `TPU v6e` today (`nms`, `roi_align`, `deform_conv2d` are not implemented in TorchTPU).
  - **Cloud-to-Cloud Legacy GPU Migration Mapper**: Maps source AWS / Azure fleets (`A10/A10G`, `L40S`, `T4`, `A100`, `H100`) to die-aligned GCP GPU & TPU replacements (including `a3-highgpu-1g/2g/4g/8g` + DWS for retraining), exporting ready-to-paste **CCA Capacity Briefs** and **GKE Hybrid NodePool Terraform**.

---

## Verified Single-Device CV Benchmark Reference (`batch=8`, `torch.compile`, Host-Fed)

All four accelerators below are single-die (`1 TPU v6e chip = 1 TensorCore = 1 device` vs. `1 GPU`), measured at `batch=8` with host-to-device input transfer and device-to-host output copy per step, and validated against a CPU `FP32` reference on 64 real COCO images:

| Model (`image_size`) | Recall-Admissible Precision | Cloud TPU v6e (`1t`) | RTX PRO 6000 G4 (`1g`) | NVIDIA H100 80GB (`1g`) | NVIDIA A100 80GB (`1g`) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`SigLIP2-Giant` (`384px`)** | TPU `FP32` / GPU `FP32+TF32` (`63–64/64` NN) | **193–197 img/s** | 87 img/s | 133 img/s | 58 img/s |
| **`ConvNeXt-Tiny` (`224px`)** | `BF16` (`63/64` top-1) | 2,004–2,285 img/s | **5,334–5,520 img/s** | 3,726–3,782 img/s | 1,872–1,911 img/s |
| **`EfficientNet-B0` (`224px`)** | `BF16` (`62–63/64` top-1) | 1,829–2,201 img/s | **4,854–4,882 img/s** | 2,371–2,463 img/s | 1,203–1,232 img/s |

### Detectors, MoGe-2, L4 and CPU-only (public models, `batch=8`, images/s)

Default mode (no `torch.compile`) on 640x640 COCO images unless noted; one or two runs each. Public weights only.

| Model | TPU v6e (`1t`) | G4 (`1g`) | H100 (`1g`) | A100 80GB (`1g`) | L4 (`1g`) | C4A / C4 (48 vCPU, CPU only) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Faster R-CNN** (`torchvision`) | Cannot run | 116 | **139** | 72 | 24 | 4.9 / 2.3 |
| **RetinaNet** (`torchvision`) | Cannot run | 119 | **136** | 70 | 24 | 7.3 / 3.3 |
| **MMDetection Faster R-CNN + DCN** (incl. CPU preprocessing) | Cannot run | 88 | Not run | 33 | 23 | Not measured |
| **MoGe-2 ViT-L depth** (`FP32`, with post-processing) | 10.8 (Nov 3 image only) | **11.4** | 9.8 | 4.8 | Not measured | n/a / 0.43 |
| **`SigLIP2-Giant`** (`FP32+TF32`, compiled) | 193–197 | 87 | 133 | 58 | 12.9 | 2.5 / 2.0 |
| **`ConvNeXt-Tiny`** (`BF16`, compiled; CPU `FP32`) | 2,004–2,285 | 5,334–5,520 | 3,726–3,782 | 1,872–1,911 | 1,821–1,863 | 215 / 138 |
| **`EfficientNet-B0`** (`BF16`, compiled; CPU `FP32`) | 1,829–2,201 | 4,854–4,882 | 2,371–2,463 | 1,203–1,232 | 1,143–1,153 | 281 / 183 |

How these feed the calculator:

- **Detector archetype**: the `G4` rate is a planning placeholder for heavy high-resolution detectors, not a measurement. Only the ratios between GPUs come from the public detectors above (`H100` about 1.2x `G4`, `L4` about 0.2x `G4`). `H200`, `B200` and `TPU7x` values are extrapolations.
- **The MMDetection row includes CPU preprocessing** on hosts with 48 (`G4`), 12 (`A100`) and 16 (`L4`) vCPUs, so its ratios reflect the host as much as the GPU. Do not use it to derive GPU counts.
- **TPU v6e**: MoGe-2 runs only on the Nov 3, 2026 TorchTPU image, which is slower than the Aug 4 image on `SigLIP2` under `torch.compile` (about 159 vs 195 img/s). Only 1 of the 8 chips on a `ct6e-standard-8t` host was usable for independent models in these tests.
- **CPU only** is workable for the light classifiers and 10–25x slower than one `A100` or `G4` on detectors and large models.

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
