(function () {
  'use strict';

  var HOURS_PER_MONTH = 730.5;
  var SECONDS_PER_MONTH = 30 * 24 * 3600; // 2,592,000 seconds

  var HARDWARE_CATALOG = {
    b200: {
      id: 'b200',
      name: 'NVIDIA B200 (a4-highgpu-8g)',
      shortName: 'NVIDIA B200 (A4)',
      machineType: 'a4-highgpu-8g (8× B200)',
      devicesPerNode: 8,
      memPerDeviceGB: 180,
      memPerNodeGB: 1440,
      bwTBps: 8.0,
      fp8Tflops: 4500,
      bf16Tflops: 2250,
      fabric: '1.8 TB/s NVLink 5 + 3.2 Tbps RoCEv2',
      pricing: { ondemand: 14.20, cud1y: 11.36, cud3y: 8.506 },
      pitchDecks: [
        { label: 'go/a4-pitchdeck', url: 'https://goto.google.com/a4-pitchdeck' },
        { label: 'go/a4-price', url: 'https://goto.google.com/a4-price' },
        { label: 'go/a4x-pitchdeck', url: 'https://goto.google.com/a4x-pitchdeck' },
        { label: 'go/b200-skus', url: 'https://goto.google.com/b200-skus' }
      ],
      plainWords: 'Google Cloud flagship Blackwell GPU machine with 180 GB HBM3e per GPU (1,440 GB per 8-GPU node) and 8.0 TB/s memory bandwidth. Delivers 2.5–3x higher decode throughput than Hopper on 70B–671B models.',
      rationales: [
        'Memory Capacity & Bandwidth: 180 GB HBM3e per GPU (8.0 TB/s) holds 70B FP8 weights on a single GPU or 671B MoE across a single 8-GPU node (1,440 GB).',
        '2nd-Gen FP8 Transformer Engine: 4,500 TFLOPs FP8 per GPU accelerates prefill TTFT and high-batch continuous batching.',
        'Scale-Out Networking: 3.2 Tbps Titanium ML RoCEv2 + NVLink 5 enables low-jitter disaggregated llm-d serving.'
      ]
    },
    h200: {
      id: 'h200',
      name: 'NVIDIA H200 (a3-ultragpu-8g)',
      shortName: 'NVIDIA H200 (A3 Ultra)',
      machineType: 'a3-ultragpu-8g (8× H200)',
      devicesPerNode: 8,
      memPerDeviceGB: 141,
      memPerNodeGB: 1128,
      bwTBps: 4.8,
      fp8Tflops: 1979,
      bf16Tflops: 989,
      fabric: '900 GB/s NVLink 4 + 3.2 Tbps RoCEv2',
      pricing: { ondemand: 10.80, cud1y: 7.56, cud3y: 4.86 },
      pitchDecks: [
        { label: 'go/a3ultra-preview-guide', url: 'https://goto.google.com/a3ultra-preview-guide' },
        { label: 'go/a3-ultra-pricing-template', url: 'https://goto.google.com/a3-ultra-pricing-template' },
        { label: 'go/gpus-pricing', url: 'https://goto.google.com/gpus-pricing' }
      ],
      plainWords: 'High-memory Hopper flagship with 141 GB HBM3e per GPU (1,128 GB per 8-GPU node) and 4.8 TB/s bandwidth. Ideal for long-context 70B–405B inference and multi-node fine-tuning.',
      rationales: [
        '141 GB HBM3e per GPU: Fits 70B FP8 (~70 GB) on TP=1 with >55 GB left for KV cache, doubling replica density vs 80 GB H100.',
        '4.8 TB/s HBM3e Bandwidth: 1.43x higher memory bandwidth than H100 directly boosts autoregressive decode TPOT.',
        'Mature Hopper Ecosystem: Turnkey compatibility with vLLM, TensorRT-LLM, SGLang, and NeMo.'
      ]
    },
    h100: {
      id: 'h100',
      name: 'NVIDIA H100 80GB (a3-megagpu-8g)',
      shortName: 'NVIDIA H100 (A3 Mega)',
      machineType: 'a3-megagpu-8g (8× H100)',
      devicesPerNode: 8,
      memPerDeviceGB: 80,
      memPerNodeGB: 640,
      bwTBps: 3.35,
      fp8Tflops: 1979,
      bf16Tflops: 989,
      fabric: '900 GB/s NVLink 4 + 1.6 Tbps GPUDirect-TCPXO',
      pricing: { ondemand: 9.80, cud1y: 6.86, cud3y: 4.41 },
      pitchDecks: [
        { label: 'go/a3mega-preview-guide', url: 'https://goto.google.com/a3mega-preview-guide' },
        { label: 'go/ai-infra-pitch', url: 'https://goto.google.com/ai-infra-pitch' },
        { label: 'go/gpus-pricing', url: 'https://goto.google.com/gpus-pricing' }
      ],
      plainWords: 'Proven enterprise workhorse with broad global and APAC regional availability (including Singapore asia-southeast1). Runs 70B FP8 smoothly at TP=2 (4 replicas per 8-GPU node).',
      rationales: [
        'Broad Regional Availability: Primary large-model GPU family with immediate actionable capacity in constrained APAC regions (including asia-southeast1).',
        'Optimal TP=2 for 70B FP8: 2× H100 GPUs provide 160 GB HBM3 (70 GB weights + ~74 GB KV cache) at 6.7 TB/s combined bandwidth.',
        'Predictable 3-Year CUD Economics: $4.41/GPU-hr 3Y CUD reference rate for steady-state enterprise production.'
      ]
    },
    g4: {
      id: 'g4',
      name: 'RTX PRO 6000 Blackwell (g4-standard)',
      shortName: 'RTX PRO 6000 (G4 96GB)',
      machineType: 'g4-standard-384 (8× G4 96GB)',
      devicesPerNode: 8,
      memPerDeviceGB: 96,
      memPerNodeGB: 768,
      bwTBps: 1.5,
      fp8Tflops: 1000,
      bf16Tflops: 500,
      fabric: 'PCIe Gen5 + 200 Gbps gVNIC',
      pricing: { ondemand: 2.95, cud1y: 2.06, cud3y: 1.33 },
      pitchDecks: [
        { label: 'go/g4-pitch-deck', url: 'https://goto.google.com/g4-pitch-deck' },
        { label: 'go/g4-overview', url: 'https://goto.google.com/g4-overview' },
        { label: 'go/g4-price', url: 'https://goto.google.com/g4-price' }
      ],
      plainWords: 'Blackwell Server Edition GPU with 96 GB GDDR7 per GPU and ultra-low hourly cost ($1.33/GPU-hr 3Y CUD). Fits 70B FP8 (~70 GB) on a single GPU (TP=1) or TP=2 (192 GB) with immediate APAC pools.',
      rationales: [
        '96 GB Memory per GPU at $1.33/hr: Holds 70B FP8 weights on a single GPU without tensor-parallel communication overhead.',
        'Flexible VM Shapes: Provision 1, 2, 4, or 8 GPUs per VM for right-sized regional deployments.',
        'Immediate APAC Capacity: Live pools in Tokyo (asia-northeast1) and India (asia-south1 / asia-south2).'
      ]
    },
    l4: {
      id: 'l4',
      name: 'NVIDIA L4 (g2-standard)',
      shortName: 'NVIDIA L4 (G2 24GB)',
      machineType: 'g2-standard-96 (8× L4 24GB)',
      devicesPerNode: 8,
      memPerDeviceGB: 24,
      memPerNodeGB: 192,
      bwTBps: 0.30,
      fp8Tflops: 242,
      bf16Tflops: 121,
      fabric: 'PCIe Gen4 + 100 Gbps gVNIC',
      pricing: { ondemand: 0.81, cud1y: 0.57, cud3y: 0.36 },
      pitchDecks: [
        { label: 'go/which-gpu', url: 'https://goto.google.com/which-gpu' },
        { label: 'go/g2-bpr', url: 'https://goto.google.com/g2-bpr' },
        { label: 'go/gpus-pricing', url: 'https://goto.google.com/gpus-pricing' }
      ],
      plainWords: 'Cost-optimized 24 GB inference accelerator ($0.36/GPU-hr 3Y CUD) available across almost all Google Cloud regions for <=14B models, embeddings, and rerankers.',
      rationales: [
        'Lowest Entry Cost ($0.36/GPU-hr): Ideal for 7B–14B models, embeddings, Guardrails, and audio/vision pipelines.',
        'Ubiquitous Multi-Zone Availability: Available across all 3 zones in Singapore (asia-southeast1-a/b/c) and global regions.'
      ]
    },
    tpu7x: {
      id: 'tpu7x',
      name: 'Cloud TPU7x (Ironwood, 2 Devices/Chip)',
      shortName: 'Cloud TPU7x (Device Parity)',
      machineType: 'tpu7x-8 (4 Chips = 8 Devices)',
      devicesPerNode: 8,
      memPerDeviceGB: 96,
      memPerNodeGB: 768,
      bwTBps: 7.37,
      fp8Tflops: 4614,
      bf16Tflops: 2307,
      fabric: '1,200 GB/s 3D Torus ICI',
      pricing: { ondemand: 9.50, cud1y: 6.65, cud3y: 4.28 },
      pitchDecks: [
        { label: 'go/cloudtpu-launchpad', url: 'https://goto.google.com/cloudtpu-launchpad/ironwood/ironwood-overview' },
        { label: 'go/ironwood-customer-faqs', url: 'https://goto.google.com/ironwood-customer-faqs' },
        { label: 'go/tpu-gpu-session25', url: 'https://goto.google.com/tpu-gpu-session25' }
      ],
      plainWords: 'Each TPU7x chip has 2 dies (devices), each with 1 TensorCore + 96 GB HBM3e (7.37 TB/s BW). A 4-chip TPU7x VM exposes 8 devices, matching an 8-GPU VM 1:1 by device count.',
      rationales: [
        '1:1 Device Parity: 1 TPU7x device (die) = 96 GB HBM3e + 7.37 TB/s bandwidth; 4-chip VM = 8 devices = 768 GB HBM.',
        '4,614 TFLOPs FP8 per Device: Industry-leading compute density and 3D Torus optical interconnect.'
      ]
    }
  };

  // Overview Enterprise Use-Case Tier Definitions
  var OVERVIEW_TIERS = {
    small: {
      name: 'Conversational AI & Assistants',
      preferredGpu: 'RTX PRO 6000 (g4-standard)',
      sku: 'g4',
      contextDesc: 'Sized Reference: Gemma-3 27B (FP8, ~27 GB) • 100 QPS avg (1K in / 512 out • 50,000 output tok/s)',
      presetKey: 'gemma27b_g4',
      postTrain: { gpus: '16 GPUs (2 Nodes)', duration: '~3.5 Days / campaign', cost: '$15.9K / campaign', sub: '2× a3-ultragpu-8g (H200) • 20B tokens SFT' },
      preTrain: { gpus: '128 GPUs (16 Nodes)', duration: '~24 Days', cost: '$358K / mo', sub: '16× a4-highgpu-8g (B200) • 2T tokens' }
    },
    medium: {
      name: 'Agentic AI & High-Rate 70B Serving',
      preferredGpu: 'NVIDIA B200 (a4-highgpu-8g)',
      sku: 'b200',
      contextDesc: 'Sized Reference: Llama-3.3 70B Dense (FP8, ~70 GB weights) • 6.0M tok/min (100,000 tok/s aggregate, 259.2B tok/mo)',
      presetKey: 'llama70b_3k',
      postTrain: { gpus: '64 GPUs (8 Nodes)', duration: '~6.2 Days / campaign', cost: '$81.0K / campaign', sub: '8× a4-highgpu-8g (B200) • 100B tokens SFT + RLHF' },
      preTrain: { gpus: '256 GPUs (32 Nodes)', duration: '~38 Days', cost: '$1.59M / mo', sub: '32× a4-highgpu-8g (B200) • 5T tokens BF16/FP8' }
    },
    large: {
      name: 'Long-Context & Frontier MoE RAG',
      preferredGpu: 'NVIDIA B200 (a4-highgpu-8g)',
      sku: 'b200',
      contextDesc: 'Sized Reference: Qwen3.5-397B-A17B MoE (FP8, ~397 GB weights) • 16K in / 1K out • Disaggregated llm-d',
      presetKey: 'qwen397b_moe',
      postTrain: { gpus: '128 GPUs (16 Nodes)', duration: '~9.5 Days / campaign', cost: '$248K / campaign', sub: '16× a4-highgpu-8g (B200) • 150B tokens Long-Context SFT' },
      preTrain: { gpus: '512 GPUs (64 Nodes)', duration: '~45 Days', cost: '$3.18M / mo', sub: '64× a4-highgpu-8g (B200) • 10T tokens MoE' }
    },
    frontier: {
      name: 'Frontier Model Training & RL',
      preferredGpu: 'NVIDIA B200 (a4-highgpu-8g)',
      sku: 'b200',
      contextDesc: 'Sized Reference: DeepSeek-R1 671B-A37B MoE • 15T-token pre-training & GRPO reinforcement learning',
      presetKey: 'deepseek671b',
      postTrain: { gpus: '256 GPUs (32 Nodes)', duration: '~14 Days / campaign', cost: '$731K / campaign', sub: '32× a4-highgpu-8g (B200) • Reasoning RL & Distillation' },
      preTrain: { gpus: '512 GPUs (64 Nodes)', duration: '~42 Days (1.4 Mos)', cost: '$3.18M / mo', sub: '64× a4-highgpu-8g (B200) • 15T tokens • 3.2 Tbps RoCEv2' }
    }
  };

  // Cockpit Presets (100% Generalized, Customer-Agnostic)
  var WORKLOAD_PRESETS = {
    llama70b_3k: {
      sku: 'b200',
      arch: 'dense',
      totalParamsB: 70,
      activeParamsB: 70,
      precisionBytes: 1,
      tpmMillions: 6.0,
      ctxLen: 2048,
      outLen: 512,
      sizingMethod: 'empirical',
      empiricalTps: 3000,
      utilPct: 80,
      batchSize: 96,
      mfuPct: 50,
      mbuPct: 65
    },
    llama70b_1k: {
      sku: 'b200',
      arch: 'dense',
      totalParamsB: 70,
      activeParamsB: 70,
      precisionBytes: 1,
      tpmMillions: 6.0,
      ctxLen: 2048,
      outLen: 512,
      sizingMethod: 'empirical',
      empiricalTps: 1000,
      utilPct: 80,
      batchSize: 64,
      mfuPct: 50,
      mbuPct: 65
    },
    llama70b_roofline: {
      sku: 'h100',
      arch: 'dense',
      totalParamsB: 70,
      activeParamsB: 70,
      precisionBytes: 1,
      tpmMillions: 6.0,
      ctxLen: 4096,
      outLen: 512,
      sizingMethod: 'roofline',
      empiricalTps: 1350,
      utilPct: 80,
      batchSize: 96,
      mfuPct: 50,
      mbuPct: 65
    },
    qwen397b_moe: {
      sku: 'b200',
      arch: 'moe',
      totalParamsB: 397,
      activeParamsB: 17,
      precisionBytes: 1,
      tpmMillions: 7.2,
      ctxLen: 8192,
      outLen: 1024,
      sizingMethod: 'roofline',
      empiricalTps: 2800,
      utilPct: 80,
      batchSize: 96,
      mfuPct: 45,
      mbuPct: 65
    },
    deepseek671b: {
      sku: 'b200',
      arch: 'moe',
      totalParamsB: 671,
      activeParamsB: 37,
      precisionBytes: 1,
      tpmMillions: 6.0,
      ctxLen: 8192,
      outLen: 1024,
      sizingMethod: 'roofline',
      empiricalTps: 2200,
      utilPct: 80,
      batchSize: 96,
      mfuPct: 40,
      mbuPct: 60
    },
    gemma27b_g4: {
      sku: 'g4',
      arch: 'dense',
      totalParamsB: 27,
      activeParamsB: 27,
      precisionBytes: 1,
      tpmMillions: 3.0,
      ctxLen: 2048,
      outLen: 512,
      sizingMethod: 'empirical',
      empiricalTps: 1200,
      utilPct: 80,
      batchSize: 64,
      mfuPct: 50,
      mbuPct: 65
    }
  };

  // Verified Live GCP Regional GPU & TPU Catalog (43 GCP Regions + Global)
  var REGION_CATALOG = {
    'global': {
      id: 'global',
      label: 'Global / All Regions (Unconstrained)',
      group: 'Global / Multi-Region',
      skus: { b200: ['all'], h200: ['all'], h100: ['all'], g4: ['all'], l4: ['all'], tpu7x: ['all'] },
      otherAccels: 'GB200, A100 80GB/40GB, TPU v6e/v5p/v5e, V100, T4',
      advisory: 'All 6 primary catalog accelerators (B200, H200, H100, G4 RTX PRO 6000, L4, Cloud TPU7x) are evaluated globally without regional filtering. Select a specific GCP region to filter by live GCE zone availability.'
    },
    // --- Australia & New Zealand (AuNZ) ---
    'australia-southeast1': {
      id: 'australia-southeast1',
      label: 'australia-southeast1 (Sydney, Australia)',
      group: 'Australia & New Zealand (AuNZ)',
      skus: { h100: ['c'] },
      otherAccels: 'NVIDIA T4 (zones a, c), P4 (zones a, b)',
      advisory: 'Sydney hosts NVIDIA H100 80GB (a3-megagpu-8g / a3-highgpu-8g) in zone c (plus legacy T4 in zones a,c). B200, H200, G4, L4, and TPU7x are NOT deployed in Sydney. For G4 RTX PRO 6000 (96 GB) inside Australia, use australia-southeast2 (Melbourne zone c); for B200 or L4 in APAC, overflow to asia-southeast1 (Singapore).'
    },
    'australia-southeast2': {
      id: 'australia-southeast2',
      label: 'australia-southeast2 (Melbourne, Australia)',
      group: 'Australia & New Zealand (AuNZ)',
      skus: { h100: ['b'], g4: ['c'] },
      otherAccels: 'None',
      advisory: 'Melbourne hosts both NVIDIA H100 80GB (zone b) and NVIDIA RTX PRO 6000 Blackwell G4 96GB (zone c) — making Melbourne the primary Australian sovereign region for G4 96GB inference and H100 workloads. B200, H200, L4, and TPU7x are not deployed in Melbourne.'
    },
    // --- Asia Pacific (APAC) ---
    'asia-southeast1': {
      id: 'asia-southeast1',
      label: 'asia-southeast1 (Singapore)',
      group: 'Asia Pacific (APAC)',
      skus: { b200: ['b'], h100: ['b', 'c'], g4: ['a', 'b', 'c'], l4: ['a', 'b', 'c'] },
      otherAccels: 'A100 80GB (zone c), A100 40GB (zones a, b, c), TPU v6e (zone b), TPU v5e (zone b), T4 (zones a, b, c)',
      advisory: 'Primary SEA & AuNZ low-latency hub: hosts B200 (zone b), H100 (zones b, c), G4 RTX PRO 6000 (zones a, b, c), and L4 (zones a, b, c), plus A100 80GB and TPU v6e/v5e. H200 and TPU7x are not currently in Singapore (use asia-south1/south2 for H200 or us-central1 for TPU7x).'
    },
    'asia-northeast1': {
      id: 'asia-northeast1',
      label: 'asia-northeast1 (Tokyo, Japan)',
      group: 'Asia Pacific (APAC)',
      skus: { b200: ['b'], h100: ['b', 'c'], g4: ['b'], l4: ['a', 'b', 'c'] },
      otherAccels: 'A100 40GB (zones a, c), TPU v6e (zone b), TPU v5e (zone b), T4 (zones a, c)',
      advisory: 'Major North Asia hub: hosts B200 (zone b, 576 GPUs in APAC Q2 tracker), H100 (zones b, c), G4 RTX PRO 6000 (zone b, 180 GPUs ready), and L4 (zones a, b, c), plus TPU v6e/v5e.'
    },
    'asia-south1': {
      id: 'asia-south1',
      label: 'asia-south1 (Mumbai, India)',
      group: 'Asia Pacific (APAC)',
      skus: { h200: ['b'], h100: ['b', 'c'], g4: ['c'], l4: ['a', 'b', 'c'] },
      otherAccels: 'TPU v6e (zones b, c), T4 (zones a, b)',
      advisory: 'Mumbai hosts H200 141GB (zone b), H100 80GB (zones b, c), G4 RTX PRO 6000 96GB (zone c, 480 GPUs in India pool), and L4 (zones a, b, c), plus TPU v6e. For B200 in India, use asia-south2 (Delhi zone c).'
    },
    'asia-south2': {
      id: 'asia-south2',
      label: 'asia-south2 (Delhi, India)',
      group: 'Asia Pacific (APAC)',
      skus: { b200: ['c'], h200: ['c'], h100: ['b'], g4: ['a', 'c'] },
      otherAccels: 'None',
      advisory: 'Delhi hosts full high-memory GPU coverage: B200 180GB (zone c), H200 141GB (zone c), H100 80GB (zone b), and G4 RTX PRO 6000 96GB (zones a, c). L4 is served from asia-south1 (Mumbai).'
    },
    'asia-east1': {
      id: 'asia-east1',
      label: 'asia-east1 (Changhua County, Taiwan)',
      group: 'Asia Pacific (APAC)',
      skus: { h100: ['c'], g4: ['a', 'b'], l4: ['a', 'b', 'c'] },
      otherAccels: 'TPU v6e (zone c), TPU v5e (zones a, b, c), V100 (zone c), T4 (zones a, c)',
      advisory: 'Taiwan hosts H100 80GB (zone c), G4 RTX PRO 6000 96GB (zones a, b), and L4 (zones a, b, c), plus TPU v6e/v5e.'
    },
    'asia-northeast3': {
      id: 'asia-northeast3',
      label: 'asia-northeast3 (Seoul, South Korea)',
      group: 'Asia Pacific (APAC)',
      skus: { h100: ['a', 'c'], l4: ['a', 'b'] },
      otherAccels: 'A100 40GB (zones a, b), T4 (zones b, c), RTX PRO 6000 vWS (zone a)',
      advisory: 'Seoul hosts H100 80GB (zones a, c) and L4 (zones a, b), plus A100 40GB. For B200 or bare-metal G4 in North Asia, use asia-northeast1 (Tokyo).'
    },
    'asia-southeast2': {
      id: 'asia-southeast2',
      label: 'asia-southeast2 (Jakarta, Indonesia)',
      group: 'Asia Pacific (APAC)',
      skus: { g4: ['b', 'c'] },
      otherAccels: 'NVIDIA T4 (zones a, b)',
      advisory: 'Jakarta hosts NVIDIA RTX PRO 6000 Blackwell G4 96GB (zones b, c) and legacy T4 (zones a, b). Ideal for in-country 70B/8B inference on G4; for H100 or B200, pair with asia-southeast1 (Singapore).'
    },
    'asia-east2': {
      id: 'asia-east2',
      label: 'asia-east2 (Hong Kong)',
      group: 'Asia Pacific (APAC)',
      skus: {},
      otherAccels: 'NVIDIA T4 (zones a, c) only',
      advisory: 'Hong Kong only hosts legacy NVIDIA T4 GPUs (zones a, c) — none of the 6 modern LLM catalog SKUs (B200, H200, H100, G4, L4, TPU7x) are deployed here. Route LLM workloads to asia-east1 (Taiwan) or asia-southeast1 (Singapore).'
    },
    'asia-northeast2': {
      id: 'asia-northeast2',
      label: 'asia-northeast2 (Osaka, Japan)',
      group: 'Asia Pacific (APAC)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Osaka has no GPU or TPU accelerators deployed. Route all Japanese GPU/TPU workloads to asia-northeast1 (Tokyo).'
    },
    'asia-southeast3': {
      id: 'asia-southeast3',
      label: 'asia-southeast3 (Bangkok, Thailand)',
      group: 'Asia Pacific (APAC)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Bangkok has no GPU or TPU accelerators deployed. Route SEA GPU/TPU workloads to asia-southeast1 (Singapore) or asia-southeast2 (Jakarta).'
    },
    // --- Americas (US, Canada, LATAM) ---
    'us-central1': {
      id: 'us-central1',
      label: 'us-central1 (Iowa, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { b200: ['b'], h200: ['b'], h100: ['a', 'b', 'c'], g4: ['b', 'c', 'f'], l4: ['a', 'b', 'c'], tpu7x: ['b', 'c'] },
      otherAccels: 'GB200 (zones a, b), A100 80GB (zones a, c), A100 40GB (zones a, b, c, f), TPU v6e (zones a, b, c), TPU v5p (zone a), TPU v5e (zone a)',
      advisory: 'Flagship US region with 100% catalog coverage: hosts all 6 primary SKUs — B200 (zone b), H200 (zone b), H100 (zones a, b, c), G4 (zones b, c, f), L4 (zones a, b, c), and Cloud TPU7x (zones b, c) — plus GB200 and TPU v6e/v5p.'
    },
    'us-east1': {
      id: 'us-east1',
      label: 'us-east1 (South Carolina, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { b200: ['b', 'd'], g4: ['b', 'd'], l4: ['b', 'c', 'd'], tpu7x: ['b'] },
      otherAccels: 'GB200 (zone d), A100 40GB (zone b), TPU v6e (zones b, d), TPU v5p (zone d), TPU v5e (zones b, c)',
      advisory: 'Major US East AI hub: hosts B200 (zones b, d), G4 (zones b, d), L4 (zones b, c, d), and Cloud TPU7x (zone b), plus GB200 (zone d) and TPU v6e/v5p. For H100/H200 on US East Coast, use us-east4 (N. Virginia) or us-east5 (Columbus).'
    },
    'us-east4': {
      id: 'us-east4',
      label: 'us-east4 (Northern Virginia, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { b200: ['b'], h200: ['b'], h100: ['a', 'b', 'c'], g4: ['b', 'c'], l4: ['a', 'c'] },
      otherAccels: 'GB200 (zone b), A100 80GB (zone c), TPU v6e (zones a, b), TPU v5e (zone b), T4 (zones a, b, c)',
      advisory: 'Full GPU coverage on US East Coast: hosts B200 (zone b), H200 (zone b), H100 (zones a, b, c), G4 (zones b, c), and L4 (zones a, c), plus GB200 and TPU v6e. For TPU7x on US East, use us-east1 or us-east5.'
    },
    'us-east5': {
      id: 'us-east5',
      label: 'us-east5 (Columbus, Ohio, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { h200: ['a'], h100: ['a'], g4: ['a', 'b', 'c'], tpu7x: ['a'] },
      otherAccels: 'A100 80GB (zones a, b), TPU v6e (zones a, b, c), TPU v5p (zones a, b, c), TPU v5e (zones a, b, c)',
      advisory: 'Columbus hosts H200 (zone a), H100 (zone a), G4 (zones a, b, c), and Cloud TPU7x (zone a), plus large TPU v6e/v5p/v5e pods.'
    },
    'us-south1': {
      id: 'us-south1',
      label: 'us-south1 (Dallas, Texas, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { b200: ['b'], h200: ['b'], g4: ['a', 'b'], tpu7x: ['b'] },
      otherAccels: 'TPU v5p (zone a), TPU v5e (zone a)',
      advisory: 'Dallas hosts B200 (zone b), H200 (zone b), G4 (zones a, b), and Cloud TPU7x (zone b), plus TPU v5p/v5e.'
    },
    'us-west1': {
      id: 'us-west1',
      label: 'us-west1 (Oregon, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { h200: ['c'], h100: ['a', 'b'], g4: ['a', 'b', 'c'], l4: ['a', 'b', 'c'] },
      otherAccels: 'A100 40GB (zone b), TPU v6e (zone c), TPU v5e (zones a, c), V100/T4 (zones a, b)',
      advisory: 'US West flagship: hosts H200 (zone c), H100 (zones a, b), G4 (zones a, b, c), and L4 (zones a, b, c), plus TPU v6e/v5e. For B200 on US West Coast, use us-west2 (Los Angeles) or us-west3 (Salt Lake City).'
    },
    'us-west2': {
      id: 'us-west2',
      label: 'us-west2 (Los Angeles, California, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { b200: ['c'] },
      otherAccels: 'NVIDIA T4 (zones b, c), P4 (zones b, c)',
      advisory: 'Los Angeles hosts NVIDIA B200 180GB (zone c) plus legacy T4/P4. For H100, H200, G4, or L4 on US West, use us-west1 (Oregon) or us-west4 (Las Vegas).'
    },
    'us-west3': {
      id: 'us-west3',
      label: 'us-west3 (Salt Lake City, Utah, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { b200: ['b', 'c'], g4: ['a'] },
      otherAccels: 'A100 40GB (zone b), T4 (zone b)',
      advisory: 'Salt Lake City hosts B200 180GB across two zones (zones b, c) and G4 RTX PRO 6000 (zone a).'
    },
    'us-west4': {
      id: 'us-west4',
      label: 'us-west4 (Las Vegas, Nevada, USA)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { h100: ['a'], g4: ['a', 'b', 'c'], l4: ['a', 'c'] },
      otherAccels: 'A100 40GB (zone b), TPU v5e (zones a, b), T4 (zones a, b)',
      advisory: 'Las Vegas hosts H100 (zone a), G4 RTX PRO 6000 across three zones (zones a, b, c), and L4 (zones a, c), plus TPU v5e.'
    },
    'northamerica-northeast1': {
      id: 'northamerica-northeast1',
      label: 'northamerica-northeast1 (Montréal, Canada)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { l4: ['b', 'c'] },
      otherAccels: 'TPU v5e (zone b), T4 (zone c), P4 (zones a, b, c)',
      advisory: 'Montréal hosts NVIDIA L4 (zones b, c) and TPU v5e (zone b). For H100 in Canada, use northamerica-northeast2 (Toronto zone c).'
    },
    'northamerica-northeast2': {
      id: 'northamerica-northeast2',
      label: 'northamerica-northeast2 (Toronto, Canada)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { h100: ['c'], l4: ['a', 'b'] },
      otherAccels: 'None',
      advisory: 'Toronto hosts NVIDIA H100 80GB (zone c) and L4 (zones a, b) for Canadian data-sovereign LLM serving.'
    },
    'northamerica-south1': {
      id: 'northamerica-south1',
      label: 'northamerica-south1 (Querétaro, Mexico)',
      group: 'Americas (US, Canada, LATAM)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Querétaro has no GPU or TPU accelerators deployed. Route workloads to us-south1 (Dallas) or us-central1 (Iowa).'
    },
    'southamerica-east1': {
      id: 'southamerica-east1',
      label: 'southamerica-east1 (São Paulo, Brazil)',
      group: 'Americas (US, Canada, LATAM)',
      skus: { g4: ['a', 'b'] },
      otherAccels: 'TPU v6e (zone c), T4 (zones a, b, c)',
      advisory: 'São Paulo hosts NVIDIA RTX PRO 6000 Blackwell G4 96GB (zones a, b) and Cloud TPU v6e (zone c), plus legacy T4.'
    },
    'southamerica-west1': {
      id: 'southamerica-west1',
      label: 'southamerica-west1 (Santiago, Chile)',
      group: 'Americas (US, Canada, LATAM)',
      skus: {},
      otherAccels: 'TPU v6e (zone a), TPU v5e (zone c) only',
      advisory: 'Santiago hosts Cloud TPU v6e (zone a) and TPU v5e (zone c), but no GPU SKUs. For GPUs in South America, use southamerica-east1 (São Paulo G4).'
    },
    // --- Europe, Middle East & Africa (EMEA) ---
    'europe-west4': {
      id: 'europe-west4',
      label: 'europe-west4 (Eemshaven, Netherlands)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { b200: ['b'], h200: ['a'], h100: ['b', 'c'], g4: ['a', 'b', 'c'], l4: ['a', 'b', 'c'] },
      otherAccels: 'GB200 (zone b), A100 80GB/40GB (zones a, b), TPU v6e (zones a, b), TPU v5p (zone b), TPU v5e (zones a, b)',
      advisory: 'Flagship European AI hub: hosts B200 (zone b), H200 (zone a), H100 (zones b, c), G4 (zones a, b, c), and L4 (zones a, b, c), plus GB200 and TPU v6e/v5p. For TPU7x in Europe, use europe-west2 (London zone a).'
    },
    'europe-west1': {
      id: 'europe-west1',
      label: 'europe-west1 (St. Ghislain, Belgium)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { b200: ['b'], h200: ['b'], h100: ['b', 'c'], g4: ['b', 'c'], l4: ['b', 'c'] },
      otherAccels: 'TPU v5p (zones b, c, d), TPU v5e (zones b, c), T4 (zones b, c, d)',
      advisory: 'Belgium hosts all 5 primary GPU SKUs: B200 (zone b), H200 (zone b), H100 (zones b, c), G4 (zones b, c), and L4 (zones b, c), plus TPU v5p/v5e.'
    },
    'europe-west2': {
      id: 'europe-west2',
      label: 'europe-west2 (London, UK)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { h100: ['b', 'c'], g4: ['b', 'c'], l4: ['a', 'b'], tpu7x: ['a'] },
      otherAccels: 'NVIDIA T4 (zones a, b)',
      advisory: 'London hosts H100 (zones b, c), G4 (zones b, c), L4 (zones a, b), and is the primary European region for Cloud TPU7x (zone a).'
    },
    'europe-west3': {
      id: 'europe-west3',
      label: 'europe-west3 (Frankfurt, Germany)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { h100: ['a', 'c'], l4: ['a', 'b'] },
      otherAccels: 'TPU v5e (zone c), T4 (zone b)',
      advisory: 'Frankfurt hosts H100 80GB (zones a, c) and L4 (zones a, b), plus TPU v5e. For G4 in Germany, use europe-west10 (Berlin zone b).'
    },
    'europe-north1': {
      id: 'europe-north1',
      label: 'europe-north1 (Hamina, Finland)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { b200: ['b', 'c'], h100: ['c'], g4: ['a', 'b', 'c'] },
      otherAccels: 'TPU v5e (zones a, c)',
      advisory: 'Finland hosts B200 180GB across two zones (zones b, c), H100 (zone c), and G4 RTX PRO 6000 across three zones (zones a, b, c), plus TPU v5e.'
    },
    'europe-west6': {
      id: 'europe-west6',
      label: 'europe-west6 (Zurich, Switzerland)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { l4: ['b', 'c'] },
      otherAccels: 'None',
      advisory: 'Zurich hosts NVIDIA L4 (zones b, c). For H100, B200, or G4 in Europe, use europe-west4 (Netherlands), europe-west1 (Belgium), or europe-west8 (Milan G4).'
    },
    'europe-west8': {
      id: 'europe-west8',
      label: 'europe-west8 (Milan, Italy)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { g4: ['b', 'c'] },
      otherAccels: 'None',
      advisory: 'Milan hosts NVIDIA RTX PRO 6000 Blackwell G4 96GB across zones b and c.'
    },
    'europe-west9': {
      id: 'europe-west9',
      label: 'europe-west9 (Paris, France)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { h100: ['c'] },
      otherAccels: 'None',
      advisory: 'Paris hosts NVIDIA H100 80GB (zone c) for French sovereign AI workloads.'
    },
    'europe-west10': {
      id: 'europe-west10',
      label: 'europe-west10 (Berlin, Germany)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { g4: ['b'] },
      otherAccels: 'None',
      advisory: 'Berlin hosts NVIDIA RTX PRO 6000 Blackwell G4 96GB (zone b). Pair with europe-west3 (Frankfurt) for H100/L4 in Germany.'
    },
    'europe-central2': {
      id: 'europe-central2',
      label: 'europe-central2 (Warsaw, Poland)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'NVIDIA T4 (zones b, c) only',
      advisory: 'Warsaw only hosts legacy NVIDIA T4 GPUs (zones b, c). Route LLM workloads to europe-north1 (Finland), europe-west3 (Frankfurt), or europe-west4 (Netherlands).'
    },
    'europe-north2': {
      id: 'europe-north2',
      label: 'europe-north2 (Stockholm, Sweden)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Stockholm has no GPU or TPU accelerators deployed. Route Nordic AI workloads to europe-north1 (Finland).'
    },
    'europe-southwest1': {
      id: 'europe-southwest1',
      label: 'europe-southwest1 (Madrid, Spain)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Madrid has no GPU or TPU accelerators deployed. Route European AI workloads to europe-west9 (Paris), europe-west1 (Belgium), or europe-west4 (Netherlands).'
    },
    'europe-west12': {
      id: 'europe-west12',
      label: 'europe-west12 (Turin, Italy)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Turin has no GPU or TPU accelerators deployed. Use europe-west8 (Milan zones b, c) for G4 96GB in Italy.'
    },
    'me-central2': {
      id: 'me-central2',
      label: 'me-central2 (Dammam, Saudi Arabia)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: { g4: ['a'], l4: ['a', 'c'] },
      otherAccels: 'None',
      advisory: 'Dammam hosts NVIDIA RTX PRO 6000 Blackwell G4 96GB (zone a) and NVIDIA L4 (zones a, c).'
    },
    'me-west1': {
      id: 'me-west1',
      label: 'me-west1 (Tel Aviv, Israel)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'A100 40GB (zones a, c), T4 (zones b, c) only',
      advisory: 'Tel Aviv hosts NVIDIA A100 40GB (zones a, c) and T4 (zones b, c), but none of the 6 primary catalog SKUs.'
    },
    'me-central1': {
      id: 'me-central1',
      label: 'me-central1 (Doha, Qatar)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Doha has no GPU or TPU accelerators deployed. Use me-central2 (Dammam) for G4/L4 in the Middle East.'
    },
    'africa-south1': {
      id: 'africa-south1',
      label: 'africa-south1 (Johannesburg, South Africa)',
      group: 'Europe, Middle East & Africa (EMEA)',
      skus: {},
      otherAccels: 'No GPU/TPU accelerators',
      advisory: 'Johannesburg has no GPU or TPU accelerators deployed. Route workloads to europe-west1/west4 or me-central2.'
    }
  };

  var state = {
    activeView: 'overview',
    overviewTier: 'medium',
    overviewLens: 'serving',
    region: 'us-central1',
    pricingBasis: 'cud3y',
    cockpitDomain: 'inference',
    activePreset: 'llama70b_3k',
    // Inference Cockpit State
    sku: 'b200',
    arch: 'dense',
    totalParamsB: 70,
    activeParamsB: 70,
    precisionBytes: 1,
    peakQps: 195.31,
    qpsBasis: 'decode',
    trafficDriver: 'tpm',
    tpmMillions: 6.0,
    targetTokSec: 100000,
    ctxLen: 2048,
    outLen: 512,
    sizingMethod: 'empirical',
    empiricalTps: 3000,
    utilPct: 80,
    batchSize: 96,
    mfuPct: 50,
    mbuPct: 65,
    customRate: 8.506,
    // Recommender State
    recSubMode: 'business',
    recPriority: 'cost',
    recModelScale: '32b-120b',
    recLongCtx: false,
    recWorkload: 'inference_online',
    recRegion: 'global',
    recRuntime: 'vllm',
    // Training State
    trGpu: 'b200',
    trParamsB: 70,
    trTokensT: 2.0,
    trNodes: 32,
    trMfu: 45
  };

  function getRegionInfo(regId) {
    return REGION_CATALOG[regId] || REGION_CATALOG['global'];
  }

  function getRegionSkuZones(regId, skuKey) {
    var info = getRegionInfo(regId);
    if (!info || !info.skus) return [];
    return info.skus[skuKey] || [];
  }

  function formatRegionSkuSummary(regObj) {
    if (regObj.id === 'global') return '[All 6 SKUs]';
    var order = ['b200', 'h200', 'h100', 'g4', 'l4', 'tpu7x'];
    var names = { b200: 'B200', h200: 'H200', h100: 'H100', g4: 'G4', l4: 'L4', tpu7x: 'TPU7x' };
    var present = [];
    order.forEach(function (k) {
      if (regObj.skus && regObj.skus[k] && regObj.skus[k].length > 0) {
        present.push(names[k]);
      }
    });
    if (present.length === 6) return '[All 6 SKUs: B200, H200, H100, G4, L4, TPU7x]';
    if (present.length > 0) return '[' + present.join(', ') + ']';
    if (regObj.otherAccels && regObj.otherAccels.indexOf('No GPU') === -1 && regObj.otherAccels !== 'None') {
      return '[Legacy/Other: ' + regObj.otherAccels.split('(')[0].trim() + ']';
    }
    return '[No GPU/TPU]';
  }

  function getBestAvailableSkuInRegion(regId, preferredOrder) {
    var info = getRegionInfo(regId);
    var order = preferredOrder || ['b200', 'h200', 'h100', 'g4', 'l4', 'tpu7x'];
    for (var i = 0; i < order.length; i++) {
      var k = order[i];
      if (info.skus && info.skus[k] && info.skus[k].length > 0) {
        return k;
      }
    }
    return null;
  }

  function populateRegionSelects() {
    var selectConfigs = [
      { id: 'ovRegionSelect', includeGlobal: true, defaultVal: state.region },
      { id: 'recSelectRegion', includeGlobal: true, defaultVal: state.recRegion },
      { id: 'infRegionSelect', includeGlobal: true, defaultVal: state.region }
    ];
    var groupsOrder = [
      'Global / Multi-Region',
      'Australia & New Zealand (AuNZ)',
      'Asia Pacific (APAC)',
      'Americas (US, Canada, LATAM)',
      'Europe, Middle East & Africa (EMEA)'
    ];
    selectConfigs.forEach(function (cfg) {
      var sel = document.getElementById(cfg.id);
      if (!sel) return;
      sel.replaceChildren();
      groupsOrder.forEach(function (grpName) {
        var optgroup = document.createElement('optgroup');
        optgroup.label = grpName;
        Object.keys(REGION_CATALOG).forEach(function (regKey) {
          var regObj = REGION_CATALOG[regKey];
          if (regObj.group !== grpName) return;
          var opt = document.createElement('option');
          opt.value = regObj.id;
          opt.textContent = regObj.label + ' — ' + formatRegionSkuSummary(regObj);
          optgroup.appendChild(opt);
        });
        if (optgroup.children.length > 0) {
          sel.appendChild(optgroup);
        }
      });
      sel.value = cfg.defaultVal;
    });
  }

  function getTokensPerReq() {
    var out = Math.max(1, state.outLen || 512);
    var ctx = Math.max(1, state.ctxLen || 2048);
    return state.qpsBasis === 'total' ? (ctx + out) : out;
  }

  function syncTrafficFromQps() {
    var tokPerReq = getTokensPerReq();
    state.targetTokSec = Math.max(10, Math.round(state.peakQps * tokPerReq));
    state.tpmMillions = (state.targetTokSec * 60.0) / 1e6;
  }

  function syncQpsFromTargetTokSec() {
    var tokPerReq = getTokensPerReq();
    state.peakQps = state.targetTokSec / tokPerReq;
  }

  function fmtInt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function fmtMoneyK(n) {
    if (n >= 1e6) {
      return '$' + (n / 1e6).toFixed(2) + 'M';
    }
    if (n >= 1e3) {
      return '$' + (n / 1e3).toFixed(1) + 'K';
    }
    return '$' + n.toFixed(2);
  }

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) {
      el.className = className;
    }
    if (typeof text === 'string' || typeof text === 'number') {
      el.textContent = String(text);
    }
    return el;
  }

  // Core Physics & Empirical Sizing Engine
  function computePlatformSizing(hw, cfg, scaleEmpiricalAcrossPlatforms) {
    var weightGB = cfg.totalParamsB * cfg.precisionBytes;
    var activeWeightGB = cfg.activeParamsB * cfg.precisionBytes;

    var usableMemPerDev = hw.memPerDeviceGB * 0.85;
    var validTp = [1, 2, 4, 8];
    var minTp = 8;
    for (var i = 0; i < validTp.length; i++) {
      if (validTp[i] * usableMemPerDev >= weightGB + 10) {
        minTp = validTp[i];
        break;
      }
    }

    var replicaHbmTotal = minTp * hw.memPerDeviceGB;
    var reserveGB = replicaHbmTotal * 0.12;
    var freeKvGB = Math.max(4.0, replicaHbmTotal - weightGB - reserveGB);

    // Roofline Per-Device Throughput
    var mbu = cfg.mbuPct / 100.0;
    var kvBytesPerTokenMB = 0.16 * (cfg.activeParamsB / 70.0) * cfg.precisionBytes;
    var avgSeqLen = cfg.ctxLen + (cfg.outLen * 0.5);
    var kvReadTotalGB = (cfg.batchSize * avgSeqLen * kvBytesPerTokenMB) / 1024.0;
    var bytesReadPerStepGB = activeWeightGB + kvReadTotalGB;
    var replicaBwGBps = minTp * hw.bwTBps * 1000.0 * mbu;
    var stepTimeSec = bytesReadPerStepGB / Math.max(1, replicaBwGBps);
    var replicaDecodeTokSec = cfg.batchSize / stepTimeSec;
    var rooflinePerDevTps = replicaDecodeTokSec / minTp;

    var rawTpsPerDevice = rooflinePerDevTps;
    if (cfg.sizingMethod === 'empirical') {
      if (scaleEmpiricalAcrossPlatforms && hw.id !== cfg.sku) {
        var baseHw = HARDWARE_CATALOG[cfg.sku];
        var ratio = (hw.bwTBps * 0.72 + (hw.fp8Tflops / 1000.0) * 0.28) /
                    (baseHw.bwTBps * 0.72 + (baseHw.fp8Tflops / 1000.0) * 0.28);
        rawTpsPerDevice = Math.max(120, Math.round(cfg.empiricalTps * ratio));
      } else {
        rawTpsPerDevice = cfg.empiricalTps;
      }
    }

    var effTpsPerDevice = rawTpsPerDevice * (cfg.utilPct / 100.0);
    var rawDevices = cfg.targetTokSec / Math.max(1, effTpsPerDevice);
    var nodesNeeded = Math.max(1, Math.ceil(rawDevices / hw.devicesPerNode));
    var alignedDevices = nodesNeeded * hw.devicesPerNode;

    // Prefill / Decode Node Split
    var prefillShare = Math.min(0.45, Math.max(0.25, cfg.ctxLen / (cfg.ctxLen + cfg.outLen * 3.0)));
    var prefillNodes = Math.max(1, Math.round(nodesNeeded * prefillShare));
    if (nodesNeeded === 1) {
      prefillNodes = 0;
    }
    var decodeNodes = Math.max(1, nodesNeeded - prefillNodes);

    var hourlyRate = hw.pricing[state.pricingBasis] || hw.pricing.cud3y;
    if (hw.id === cfg.sku && cfg.customRate > 0) {
      hourlyRate = cfg.customRate;
    }

    var monthlyCost = alignedDevices * hourlyRate * HOURS_PER_MONTH;
    var monthlyTokens = cfg.targetTokSec * SECONDS_PER_MONTH;
    var costPer1M = monthlyCost / (monthlyTokens / 1e6);

    return {
      hw: hw,
      weightGB: weightGB,
      activeWeightGB: activeWeightGB,
      minTp: minTp,
      replicaHbmTotal: replicaHbmTotal,
      freeKvGB: freeKvGB,
      rawTpsPerDevice: rawTpsPerDevice,
      effTpsPerDevice: effTpsPerDevice,
      nodesNeeded: nodesNeeded,
      alignedDevices: alignedDevices,
      prefillNodes: prefillNodes,
      decodeNodes: decodeNodes,
      hourlyRate: hourlyRate,
      monthlyCost: monthlyCost,
      monthlyTokens: monthlyTokens,
      costPer1M: costPer1M
    };
  }

  // Render View 1: Overview
  function renderOverview() {
    var tierObj = OVERVIEW_TIERS[state.overviewTier] || OVERVIEW_TIERS.medium;
    var primaryHw = HARDWARE_CATALOG[state.sku];
    var res = computePlatformSizing(primaryHw, state, false);

    document.getElementById('execAdvVerdictName').textContent = tierObj.name;
    document.getElementById('execAdvVerdictScore').textContent = 'Preferred GPU: ' + primaryHw.name;
    document.getElementById('execAdvVerdictContext').textContent = tierObj.contextDesc;

    if (state.overviewLens === 'serving') {
      var devWord = primaryHw.id === 'tpu7x' ? 'Devices' : 'GPUs';
      document.getElementById('ovKpi1Label').textContent = 'Serving Pool';
      document.getElementById('ovKpi1Value').textContent = fmtInt(res.alignedDevices) + ' ' + devWord + ' (' + res.nodesNeeded + ' Nodes)';
      document.getElementById('ovKpi1Sub').textContent =
        res.nodesNeeded + '× ' + primaryHw.machineType + ' (' + (res.prefillNodes * 8) + ' prefill + ' + (res.decodeNodes * 8) + ' decode) • ' +
        fmtInt(res.effTpsPerDevice) + ' eff. tok/s/GPU';

      document.getElementById('ovKpi2Label').textContent = 'Monthly Cost';
      document.getElementById('ovKpi2Value').textContent = fmtMoneyK(res.monthlyCost) + ' / mo';
      document.getElementById('ovKpi2Sub').textContent =
        state.pricingBasis.toUpperCase() + ' ($' + res.hourlyRate.toFixed(2) + '/GPU-hr • ' + fmtMoneyK(res.monthlyCost * 12) + '/yr)';

      document.getElementById('ovKpi3Label').textContent = 'Unit Economics';
      document.getElementById('ovKpi3Value').textContent = '$' + res.costPer1M.toFixed(2) + ' / 1M tok';
      document.getElementById('ovKpi3Sub').textContent =
        'Per 1M tokens • ' + (res.monthlyTokens / 1e9).toFixed(1) + 'B tokens/month at target load';
    } else if (state.overviewLens === 'posttrain') {
      document.getElementById('ovKpi1Label').textContent = 'Fine-Tuning Footprint';
      document.getElementById('ovKpi1Value').textContent = tierObj.postTrain.gpus;
      document.getElementById('ovKpi1Sub').textContent = tierObj.postTrain.sub;

      document.getElementById('ovKpi2Label').textContent = 'Campaign Duration';
      document.getElementById('ovKpi2Value').textContent = tierObj.postTrain.duration;
      document.getElementById('ovKpi2Sub').textContent = 'Includes checkpointing & eval passes';

      document.getElementById('ovKpi3Label').textContent = 'Campaign Cost';
      document.getElementById('ovKpi3Value').textContent = tierObj.postTrain.cost;
      document.getElementById('ovKpi3Sub').textContent = 'At 3-yr CUD reference rate';
    } else {
      document.getElementById('ovKpi1Label').textContent = 'Pre-Training Cluster';
      document.getElementById('ovKpi1Value').textContent = tierObj.preTrain.gpus;
      document.getElementById('ovKpi1Sub').textContent = tierObj.preTrain.sub;

      document.getElementById('ovKpi2Label').textContent = 'Training Duration';
      document.getElementById('ovKpi2Value').textContent = tierObj.preTrain.duration;
      document.getElementById('ovKpi2Sub').textContent = 'Sustained 45% MFU over RoCEv2 fabric';

      document.getElementById('ovKpi3Label').textContent = 'Monthly Cluster Spend';
      document.getElementById('ovKpi3Value').textContent = tierObj.preTrain.cost;
      document.getElementById('ovKpi3Sub').textContent = '3-yr CUD reference rate';
    }

    // Update Regional Advisory & Live SKU Matrix in View 1
    var regInfo = getRegionInfo(state.region);
    var regTitle = document.getElementById('ovRegionAdvisoryTitle');
    var regBody = document.getElementById('ovRegionAdvisoryBody');
    var skuCountBadge = document.getElementById('ovRegionSkuCountBadge');
    var zonePillsBox = document.getElementById('ovRegionZonePills');
    var mismatchBox = document.getElementById('ovRegionMismatchBox');
    var mismatchText = document.getElementById('ovRegionMismatchText');
    var switchBtn = document.getElementById('btnOvSwitchAvailableGpu');

    if (regTitle) {
      regTitle.textContent = regInfo.label + ' — Verified Accelerator Availability';
    }
    if (regBody) {
      regBody.textContent = regInfo.advisory + (regInfo.otherAccels && regInfo.otherAccels !== 'None' ? ' (Other accelerators in region: ' + regInfo.otherAccels + '.)' : '');
    }

    var allCatalogOrder = ['b200', 'h200', 'h100', 'g4', 'l4', 'tpu7x'];
    var availCount = 0;
    if (zonePillsBox) {
      zonePillsBox.replaceChildren();
      allCatalogOrder.forEach(function (k) {
        var hwObj = HARDWARE_CATALOG[k];
        var zones = getRegionSkuZones(state.region, k);
        var isAvail = zones.length > 0;
        if (isAvail) availCount++;
        var zText = state.region === 'global'
          ? 'Global'
          : (isAvail ? ('zone' + (zones.length > 1 ? 's ' : ' ') + zones.join(',')) : 'Not deployed');
        var pill = createEl(
          'button',
          isAvail
            ? 'px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border transition cursor-pointer ' +
              (k === state.sku ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs' : 'bg-[#e6f4ea] text-[#137333] border-[#ceead6] hover:border-[#137333]')
            : 'px-2.5 py-1 rounded-md text-[11px] font-mono bg-white text-[#5f6368] border border-[#dadce0] opacity-75',
          (isAvail ? '✓ ' : '✗ ') + hwObj.id.toUpperCase() + ' (' + zText + ')'
        );
        pill.type = 'button';
        pill.title = isAvail ? ('Click to size with ' + hwObj.name + ' in ' + state.region) : (hwObj.name + ' is not deployed in ' + state.region);
        if (isAvail) {
          pill.addEventListener('click', function () {
            state.sku = k;
            state.customRate = HARDWARE_CATALOG[k].pricing[state.pricingBasis];
            syncControlsFromState();
            renderOverview();
            renderCockpit();
          });
        }
        zonePillsBox.appendChild(pill);
      });
    }

    if (skuCountBadge) {
      if (state.region === 'global') {
        skuCountBadge.textContent = 'All 6 Catalog SKUs (Global)';
        skuCountBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]';
      } else if (availCount > 0) {
        skuCountBadge.textContent = availCount + ' / 6 Catalog SKUs in ' + state.region;
        skuCountBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#e8f0fe] text-[#174ea6] border border-[#d2e3fc]';
      } else {
        skuCountBadge.textContent = '0 / 6 Catalog SKUs in ' + state.region;
        skuCountBadge.className = 'px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]';
      }
    }

    var primaryZones = getRegionSkuZones(state.region, state.sku);
    if (mismatchBox && mismatchText && switchBtn) {
      if (state.region !== 'global' && primaryZones.length === 0) {
        mismatchBox.classList.remove('hidden');
        var bestFallback = getBestAvailableSkuInRegion(state.region, ['h200', 'b200', 'g4', 'h100', 'l4', 'tpu7x']);
        if (bestFallback) {
          var fbHw = HARDWARE_CATALOG[bestFallback];
          var fbZones = getRegionSkuZones(state.region, bestFallback);
          mismatchText.textContent =
            primaryHw.name + ' is NOT deployed in ' + state.region + '. Verified available in ' + state.region + ': ' +
            fbHw.name + ' (zone' + (fbZones.length > 1 ? 's ' : ' ') + fbZones.join(', ') + ').';
          switchBtn.textContent = 'Switch to ' + fbHw.shortName + ' (' + state.region + ')';
          switchBtn.onclick = function () {
            state.sku = bestFallback;
            state.customRate = fbHw.pricing[state.pricingBasis];
            syncControlsFromState();
            renderOverview();
            renderCockpit();
          };
        } else {
          mismatchText.textContent =
            'None of the 6 primary LLM catalog SKUs are deployed in ' + state.region + ' (' + regInfo.otherAccels + '). Please select a nearby regional AI hub.';
          switchBtn.textContent = 'Switch Region to us-central1 (All 6 SKUs)';
          switchBtn.onclick = function () {
            state.region = 'us-central1';
            syncControlsFromState();
            renderOverview();
            renderCockpit();
            renderTrainingCockpit();
          };
        }
      } else {
        mismatchBox.classList.add('hidden');
      }
    }

    // Render Multi-Platform Visual Comparison Bars
    var barsContainer = document.getElementById('ovPlatformBarsContainer');
    barsContainer.replaceChildren();
    var order = ['b200', 'h200', 'h100', 'g4', 'tpu7x'];
    var results = order.map(function (k) {
      return computePlatformSizing(HARDWARE_CATALOG[k], state, true);
    });
    var maxCost = 1;
    results.forEach(function (r) {
      if (r.monthlyCost > maxCost) maxCost = r.monthlyCost;
    });

    results.forEach(function (r) {
      var rZones = getRegionSkuZones(state.region, r.hw.id);
      var rAvail = rZones.length > 0;
      var row = createEl('div', 'p-3.5 rounded-lg bg-[#f8f9fa] border border-[#dadce0] space-y-1.5');
      if (r.hw.id === state.sku) {
        row.className = 'p-3.5 rounded-lg bg-[#e8f0fe] border border-[#1a73e8] space-y-1.5';
      }
      var top = createEl('div', 'flex flex-wrap items-center justify-between gap-2 text-xs');
      var left = createEl('div', 'flex flex-wrap items-center gap-2');
      left.appendChild(createEl('span', 'font-bold text-[#202124] text-sm', r.hw.shortName));
      left.appendChild(createEl('span', 'font-mono text-[#5f6368]', r.hw.machineType + ' • TP=' + r.minTp));
      var regBadgeText = state.region === 'global'
        ? '✓ Global'
        : (rAvail ? ('✓ ' + state.region + ' (' + rZones.join(',') + ')') : ('✗ Not in ' + state.region));
      left.appendChild(
        createEl(
          'span',
          rAvail
            ? 'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]'
            : 'px-1.5 py-0.5 rounded text-[10px] font-mono bg-white text-[#c5221f] border border-[#fad2cf]',
          regBadgeText
        )
      );
      if (r.hw.pitchDecks && r.hw.pitchDecks.length > 0) {
        var deckLink = createEl('a', 'px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-[#1a73e8] border border-[#dadce0] hover:bg-[#e8f0fe]', '📊 ' + r.hw.pitchDecks[0].label + ' ↗');
        deckLink.href = r.hw.pitchDecks[0].url;
        deckLink.target = '_blank';
        deckLink.rel = 'noopener noreferrer';
        left.appendChild(deckLink);
      }

      var right = createEl('div', 'font-mono flex items-center gap-3');
      right.appendChild(createEl('span', 'text-[#3c4043]', fmtInt(r.alignedDevices) + ' devs (' + r.nodesNeeded + ' nodes)'));
      right.appendChild(createEl('span', 'font-bold text-[#202124]', fmtMoneyK(r.monthlyCost) + '/mo'));
      right.appendChild(createEl('span', 'px-2 py-0.5 rounded bg-white border border-[#dadce0] font-bold text-[#1a73e8]', '$' + r.costPer1M.toFixed(2) + ' / 1M tok'));

      top.appendChild(left);
      top.appendChild(right);

      var barTrack = createEl('div', 'w-full h-2 bg-white rounded-full overflow-hidden border border-[#dadce0]');
      var barFill = createEl('div', r.hw.id === 'tpu7x' ? 'h-full bg-[#188038]' : 'h-full bg-[#1a73e8]');
      var pct = Math.max(8, Math.round((r.monthlyCost / maxCost) * 100));
      barFill.style.width = pct + '%';
      barTrack.appendChild(barFill);

      row.appendChild(top);
      row.appendChild(barTrack);
      barsContainer.appendChild(row);
    });
  }

  // Multi-Factor Scoring & Decision Engine for View 2: GPU Recommender
  function evaluateGpuRecommendation() {
    var prio = state.recPriority || 'cost';
    var scale = state.recModelScale || '32b-120b';
    var longCtx = !!state.recLongCtx;
    var wk = state.recWorkload || 'inference_online';
    var reg = state.recRegion || 'global';
    var rt = state.recRuntime || 'vllm';

    var scores = { b200: 50, h200: 50, h100: 50, g4: 50, l4: 35 };
    var reasons = { b200: [], h200: [], h100: [], g4: [], l4: [] };

    // 1. Model Scale baseline fit & HBM capacity
    if (scale === '<14b') {
      scores.l4 += 26;
      scores.g4 += 24;
      scores.h100 += 18;
      scores.h200 += 8;
      scores.b200 += 4;
      reasons.l4.push('Right-Sized 24 GB VRAM for <14B Models: Holds 8B FP8 weights (~8 GB) plus 14 GB KV cache on a single GPU (TP=1) with zero multi-GPU communication overhead.');
      reasons.g4.push('High-Concurrency <14B Density: 96 GB GDDR7 per GPU holds 8B weights plus >80 GB KV cache for 4x higher batch concurrency than L4.');
      reasons.h100.push('Sub-5ms Decode Latency on <14B: 3.35 TB/s HBM3 bandwidth delivers 11x faster memory-bound token generation than L4.');
    } else if (scale === '14b-32b') {
      scores.g4 += 26;
      scores.h100 += 22;
      scores.h200 += 22;
      scores.b200 += 16;
      scores.l4 -= 15;
      reasons.g4.push('Single-GPU 32B Fit (96 GB GDDR7): Fits 27B–32B models in FP8 or BF16 on TP=1 with 32–64 GB free VRAM for KV cache at $1.33/GPU-hr.');
      reasons.h200.push('141 GB HBM3e for 32B Serving: Runs 27B–32B models on TP=1 with >105 GB KV cache capacity and 4.8 TB/s bandwidth.');
      reasons.h100.push('80 GB HBM3 Sweet Spot for 14B–32B: Runs 27B–32B FP8 on TP=1 with 3.35 TB/s HBM3 bandwidth and broad regional availability.');
      reasons.b200.push('Maximum 32B Throughput Density: 4,500 TFLOPs FP8 and 8.0 TB/s HBM3e maximize tokens/sec per node for high-QPS 32B deployments.');
    } else if (scale === '32b-120b') {
      scores.b200 += 22;
      scores.h200 += 22;
      scores.g4 += 20;
      scores.h100 += 18;
      scores.l4 -= 45;
      reasons.g4.push('96 GB GDDR7 Fits 70B FP8 on TP=1 or TP=2: Unlike 80 GB GPUs that force TP>=2 on 70B FP8 (~70 GB weights), G4 holds 70B FP8 on 1 GPU (or 192 GB on TP=2) at $1.33/GPU-hr.');
      reasons.b200.push('180 GB HBM3e / GPU (1,440 GB/Node): Serves 70B–120B models at TP=1 or TP=2 with 110–290 GB free HBM3e for massive concurrent KV caches.');
      reasons.h200.push('141 GB HBM3e / GPU (1,128 GB/Node): Fits 70B FP8 on TP=1 (71 GB free KV cache) or 70B BF16 on TP=2 with 4.8 TB/s HBM3e bandwidth.');
      reasons.h100.push('640 GB HBM3 / Node (TP=2 or TP=4): Serves 70B FP8 across 4 replicas per 8-GPU node (160 GB/replica) over 900 GB/s NVLink.');
    } else {
      // >200b Frontier & MoE
      scores.b200 += 30;
      scores.h200 += 28;
      scores.h100 += 12;
      scores.g4 -= 30;
      scores.l4 -= 60;
      reasons.b200.push('Single-Node Frontier MoE Fit (1,440 GB HBM3e): Holds 397B–671B FP8 weights plus large KV cache inside a single 8-GPU NVLink 5 domain (1,800 GB/s).');
      reasons.h200.push('Cost-Efficient Frontier HBM3e Pool (1,128 GB/Node): Fits 397B–671B FP8 weights across 1–2 nodes over 3.2 Tbps RoCEv2 at 32% lower hourly node cost than B200.');
      reasons.h100.push('Multi-Node GPUDirect-TCPXO Scaling: Pairs 2x a3-megagpu-8g nodes (1,280 GB HBM3) when immediate regional deployment is required.');
    }

    // 2. Optimization Priority (Primary differentiator — guarantees distinct winner per priority)
    if (prio === 'cost') {
      if (scale === '<14b') {
        if (!longCtx && wk !== 'pretrain') {
          scores.l4 += 32;
          scores.g4 += 18;
          reasons.l4.unshift('Optimization Priority — Lowest Cost Winner ($0.56/GPU-hr): G2 (L4) delivers the lowest entry cost and best $/1M token economics for <14B models at standard context lengths.');
        } else {
          scores.g4 += 32;
          scores.h100 += 15;
          reasons.g4.unshift('Optimization Priority — Long-Context Cost Winner ($1.33/GPU-hr): 96 GB GDDR7 holds 128K+ KV caches that overflow 24 GB L4 at a fraction of H100/B200 cost.');
        }
      } else if (scale === '14b-32b') {
        if (wk !== 'pretrain') {
          scores.g4 += 32;
          scores.l4 += 10;
          scores.h200 += 12;
          reasons.g4.unshift('Optimization Priority — Lowest Cost Winner ($1.33/GPU-hr 3Y CUD): Delivers the lowest $/GB of VRAM and best tokens-per-dollar for 14B–32B models on Google Cloud.');
        } else {
          scores.h100 += 28;
          scores.h200 += 24;
          reasons.h100.unshift('Optimization Priority — Training Cost Efficiency: Provides NVLink + GPUDirect multi-node scaling at a lower per-hour rate than B200.');
        }
      } else if (scale === '32b-120b') {
        if ((wk === 'inference_online' || wk === 'inference_batch') && !longCtx) {
          scores.g4 += 32;
          scores.h200 += 16;
          scores.b200 += 10;
          reasons.g4.unshift('Optimization Priority — Lowest Unit Cost (~$0.52 / 1M tok): At $1.33/GPU-hr (3Y CUD), G4 96GB cuts $/1M token serving cost by >50% compared to H100/B200 for 70B FP8 workloads.');
        } else {
          scores.h200 += 30;
          scores.b200 += 18;
          reasons.h200.unshift('Optimization Priority — High-HBM Cost Leader ($5.77/GPU-hr): A3 Ultra (H200) provides 141 GB HBM3e/GPU (1,128 GB/node) at a 32% lower hourly rate than A4 (B200).');
        }
      } else {
        // >200b + cost
        scores.h200 += 32;
        scores.b200 += 18;
        reasons.h200.unshift('Optimization Priority — Frontier Model TCO Winner ($5.77/GPU-hr): 1,128 GB HBM3e per node serves 200B–671B models at 32% lower per-node cost than B200.');
      }
    } else if (prio === 'latency') {
      if (scale === '<14b') {
        if (!longCtx) {
          scores.h100 += 34;
          scores.g4 += 16;
          scores.l4 -= 15;
          reasons.h100.unshift('Optimization Priority — Strict Low-Latency Winner: 3.35 TB/s HBM3 and 1,979 TFLOPs FP8 achieve <80ms TTFT and <5ms TPOT on <14B models without over-provisioning 180 GB GPUs.');
        } else {
          scores.h200 += 34;
          scores.b200 += 28;
          reasons.h200.unshift('Optimization Priority — Long-Context Low-Latency Winner: 141 GB HBM3e and 4.8 TB/s bandwidth keep 128K prompts and KV caches in fast HBM3e.');
        }
      } else if (scale === '14b-32b') {
        if (!longCtx) {
          scores.h200 += 32;
          scores.b200 += 24;
          scores.g4 -= 10;
          reasons.h200.unshift('Optimization Priority — Single-GPU HBM3e Latency Winner: 4.8 TB/s HBM3e runs 27B–32B models on TP=1 with <8ms TPOT and zero cross-GPU all-reduce latency.');
        } else {
          scores.b200 += 34;
          scores.h200 += 24;
          reasons.b200.unshift('Optimization Priority — 128K+ TTFT & TPOT Winner: 4,500 TFLOPs FP8 cuts 128K prefill TTFT in half while 8.0 TB/s HBM3e sustains ultra-fast decode.');
        }
      } else {
        // 32b-120b and >200b + latency
        scores.b200 += 35;
        scores.h200 += 20;
        scores.g4 -= 12;
        reasons.b200.unshift('Optimization Priority — Strict Low-Latency Winner (8.0 TB/s HBM3e): Decode TPOT is memory-bandwidth bound; B200 delivers 2.4x faster token generation than H100 and 2.3x faster prefill TTFT (4,500 TF FP8).');
      }
    } else if (prio === 'throughput') {
      if (scale === '<14b') {
        scores.g4 += 32;
        scores.h100 += 20;
        scores.l4 -= 8;
        reasons.g4.unshift('Optimization Priority — High-Batch Throughput Winner: 96 GB GDDR7 (4x L4) + 1,250 TFLOPs FP8 (5.1x L4) maximizes concurrent batch streams per dollar on <14B models.');
      } else if (scale === '14b-32b') {
        scores.b200 += 32;
        scores.h200 += 24;
        reasons.b200.unshift('Optimization Priority — Maximum Compute & Bandwidth Density: 4,500 TFLOPs FP8 and 8.0 TB/s HBM3e per GPU deliver the highest aggregate tokens/sec per 8-GPU node.');
      } else if (scale === '32b-120b') {
        if (wk === 'pretrain') {
          scores.b200 += 34;
          scores.h200 += 22;
          reasons.b200.unshift('Optimization Priority — Maximum Training Throughput: 2,250 TF BF16 / 4,500 TF FP8 per GPU cuts 70B training time by >2.2x vs Hopper.');
        } else {
          scores.h200 += 33;
          scores.b200 += 25;
          reasons.h200.unshift('Optimization Priority — High-Concurrency HBM3e Throughput Winner: 141 GB HBM3e/GPU (1,128 GB/node) at 4.8 TB/s maximizes continuous batch size (71–212 GB KV cache/replica) with superior throughput-per-dollar.');
        }
      } else {
        // >200b + throughput
        scores.b200 += 35;
        scores.h200 += 22;
        reasons.b200.unshift('Optimization Priority — Frontier Throughput Flagship: 36 PFLOPs FP8 and 1,440 GB HBM3e per node deliver 2.3x prefill and 1.7x decode throughput over H200.');
      }
    } else if (prio === 'availability') {
      if (scale === '<14b') {
        scores.l4 += 35;
        scores.g4 += 22;
        reasons.l4.unshift('Optimization Priority — Immediate Global Availability Winner: G2 (L4) has the deepest on-demand and CUD stock across virtually every Google Cloud region worldwide.');
      } else if (scale === '14b-32b' || scale === '32b-120b') {
        if (reg === 'apac_flex' && wk !== 'pretrain') {
          scores.g4 += 34;
          scores.h100 += 26;
          reasons.g4.unshift('Optimization Priority — Immediate APAC Regional Stock: G4 (RTX PRO 6000 96GB) offers immediate multi-zone capacity in APAC hubs without frontier HBM allocation lead times.');
        } else {
          scores.h100 += 35;
          scores.g4 += 22;
          scores.h200 += 12;
          reasons.h100.unshift('Optimization Priority — Broadest Multi-Region HBM Stock: A3 Mega (H100 80GB) is Google Cloud\'s most widely deployed 8-GPU HBM platform across US, EU, and APAC for immediate production launch.');
        }
      } else {
        // >200b + availability
        scores.h100 += 36;
        scores.h200 += 24;
        scores.b200 += 14;
        reasons.h100.unshift('Optimization Priority — Immediate Multi-Node Availability: 2x a3-megagpu-8g nodes (1,280 GB HBM3 over 1.6 Tbps GPUDirect-TCPXO) allow immediate >200B deployment without waiting for A4/A3-Ultra reservations.');
      }
    }

    // 3. Long-Context Tiebreaker (>= 128K tokens)
    if (longCtx) {
      scores.b200 += 14;
      scores.h200 += 16;
      scores.g4 += 4;
      scores.h100 -= 12;
      scores.l4 -= 35;
      reasons.b200.push('Long-Context Tiebreaker (128K+ tok): 180 GB HBM3e per GPU holds massive 128K+ KV caches alongside model weights without context-parallel network bottlenecks.');
      reasons.h200.push('Long-Context Tiebreaker (128K+ tok): 141 GB HBM3e per GPU (1.76x H100) prevents KV cache eviction on 128K-token RAG and agentic prompts.');
    }

    // 4. Workload Nature Modifiers
    if (wk === 'inference_batch') {
      scores.g4 += 10;
      scores.h200 += 6;
      reasons.g4.push('Offline Batch Throughput Leader: High VRAM-per-dollar ($1.33/GPU-hr for 96 GB) maximizes overnight extraction and batch token volume per dollar.');
    } else if (wk === 'posttrain') {
      scores.h200 += 10;
      scores.b200 += 10;
      scores.h100 += 6;
      scores.g4 -= 12;
      scores.l4 -= 25;
      reasons.h200.push('SFT & RLHF Post-Training Fit: 1,128 GB HBM3e/node holds full 70B BF16 weights + gradients + optimizer states on a single 8-GPU node.');
      reasons.b200.push('Accelerated Post-Training & GRPO RL: High FP8 rollout throughput + 2,250 TF BF16 gradient updates on NVLink 5.');
    } else if (wk === 'pretrain') {
      scores.b200 += 16;
      scores.h200 += 12;
      scores.h100 += 10;
      scores.g4 -= 45;
      scores.l4 -= 60;
      reasons.b200.push('Foundation Pre-Training Fabric: 3.2 Tbps RoCEv2 NICs + 1,800 GB/s NVLink 5 scale linearly across multi-node 3D-parallel training clusters.');
      reasons.h200.push('3.2 Tbps RoCEv2 RDMA Fabric: Matches A4 inter-node network bandwidth for large-scale FSDP and Megatron-LM pre-training.');
    }

    // 5. Regional Availability Enforcement & Runtime Modifiers
    var regInfo = getRegionInfo(reg);
    var gpuCandOrder = ['b200', 'h200', 'h100', 'g4', 'l4'];
    var availInReg = [];
    if (reg !== 'global') {
      gpuCandOrder.forEach(function (k) {
        var z = getRegionSkuZones(reg, k);
        if (z.length > 0) availInReg.push(k);
      });
      if (availInReg.length > 0) {
        gpuCandOrder.forEach(function (k) {
          var z = getRegionSkuZones(reg, k);
          if (z.length > 0) {
            scores[k] += 24;
            reasons[k].unshift(
              'Verified Live in ' + reg + ' (zone' + (z.length > 1 ? 's ' : ' ') + z.join(', ') + '): Confirmed active GCE accelerator zones in ' + regInfo.label + '.'
            );
          } else {
            scores[k] -= 65;
            reasons[k].unshift(
              'NOT Deployed in ' + reg + ': ' + HARDWARE_CATALOG[k].shortName + ' has 0 zones in ' + reg + '; requires cross-region routing.'
            );
          }
        });
      }
    }

    if (rt === 'trtllm') {
      scores.b200 += 5;
      scores.g4 += 4;
      reasons.b200.push('TensorRT-LLM / NVIDIA Dynamo Optimized: Native Blackwell FP8/FP4 micro-tensor scaling kernels.');
    } else if (rt === 'sglang') {
      scores.h200 += 5;
      scores.b200 += 4;
      reasons.h200.push('SGLang RadixAttention KV Reuse: 141 GB HBM3e holds deep prefix trees in GPU memory for multi-turn agentic workflows.');
    }

    // Clamp scores to [15, 99] and sort descending
    var candidates = ['b200', 'h200', 'h100', 'g4', 'l4'];
    candidates.forEach(function (k) {
      scores[k] = Math.min(99, Math.max(15, Math.round(scores[k])));
    });
    candidates.sort(function (a, b) {
      return scores[b] - scores[a];
    });

    return {
      primaryKey: candidates[0],
      altKey: candidates[1],
      ranked: candidates.map(function (k) {
        return { key: k, score: scores[k], hw: HARDWARE_CATALOG[k] };
      }),
      reasons: reasons,
      regInfo: regInfo,
      availInReg: availInReg
    };
  }

  // Render View 2: GPU Recommender
  function renderRecommender() {
    var recResult = evaluateGpuRecommendation();
    var primaryKey = recResult.primaryKey;
    var altKey = recResult.altKey;
    var pHw = HARDWARE_CATALOG[primaryKey];
    var aHw = HARDWARE_CATALOG[altKey];
    var regInfo = recResult.regInfo || getRegionInfo(state.recRegion);

    // Update Region Verification Badge & Hint in Question 2
    var regBadge = document.getElementById('recRegionVerifyBadge');
    var regHint = document.getElementById('recRegionGpuListHint');
    if (regBadge) {
      if (state.recRegion === 'global') {
        regBadge.textContent = 'All 6 SKUs Enabled';
        regBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]';
      } else if (recResult.availInReg && recResult.availInReg.length > 0) {
        regBadge.textContent = recResult.availInReg.length + ' GPU SKU(s) Verified in ' + state.recRegion;
        regBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#e8f0fe] text-[#174ea6] border border-[#d2e3fc]';
      } else {
        regBadge.textContent = '0 Modern LLM GPUs in ' + state.recRegion;
        regBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]';
      }
    }
    if (regHint) {
      regHint.textContent = regInfo.advisory;
    }

    // Build a dynamic sizing scenario matching the user's Recommender selections
    var scaleProfile = {
      '<14b': { label: '8B Dense FP8', arch: 'dense', totalParamsB: 8, activeParamsB: 8, tpmMillions: 3.0, trTokensT: 0.5, trNodes: 4 },
      '14b-32b': { label: '27B Dense FP8', arch: 'dense', totalParamsB: 27, activeParamsB: 27, tpmMillions: 4.5, trTokensT: 1.0, trNodes: 8 },
      '32b-120b': { label: '70B Dense FP8', arch: 'dense', totalParamsB: 70, activeParamsB: 70, tpmMillions: 6.0, trTokensT: 2.0, trNodes: 32 },
      '>200b': { label: '397B MoE (17B active) FP8', arch: 'moe', totalParamsB: 397, activeParamsB: 17, tpmMillions: 7.2, trTokensT: 5.0, trNodes: 64 }
    }[state.recModelScale] || { label: '70B Dense FP8', arch: 'dense', totalParamsB: 70, activeParamsB: 70, tpmMillions: 6.0, trTokensT: 2.0, trNodes: 32 };

    var prioLabels = {
      cost: 'Lowest Cost ($/1M tok)',
      latency: 'Strict Low Latency',
      throughput: 'Max Throughput & HBM',
      availability: 'Immediate Regional Stock'
    };
    var wkLabels = {
      inference_online: 'Real-Time Serving',
      inference_batch: 'Offline Batch',
      posttrain: 'Fine-Tuning (SFT/RL)',
      pretrain: 'Pre-Training'
    };

    var criteriaBadge = document.getElementById('recActiveCriteriaBadge');
    if (criteriaBadge) {
      criteriaBadge.textContent =
        (prioLabels[state.recPriority] || 'Cost') +
        ' • ' +
        scaleProfile.label +
        (state.recLongCtx ? ' • 128K Ctx' : ' • 8K Ctx') +
        ' • ' +
        (wkLabels[state.recWorkload] || 'Serving') +
        (state.recRegion !== 'global' ? ' • ' + state.recRegion : '');
    }

    var pZones = getRegionSkuZones(state.recRegion, primaryKey);
    var pZoneLabel = state.recRegion === 'global'
      ? 'Global'
      : (pZones.length > 0 ? (state.recRegion + '-' + pZones.join(', -')) : ('Not in ' + state.recRegion));

    document.getElementById('recPrimaryTitle').textContent = pHw.name;
    document.getElementById('recPrimaryAvailTag').textContent =
      pHw.memPerDeviceGB + ' GB / GPU • ' + pHw.bwTBps.toFixed(2) + ' TB/s • ' + pZoneLabel + ' • Match: ' + recResult.ranked[0].score + '/100';
    document.getElementById('recPrimaryPlainWords').textContent = 'In plain words: ' + pHw.plainWords;

    // Compute dynamic 3-KPI Reference Sizing for the selected scale + workload
    var kpi1Lbl = document.getElementById('recKpi1Label');
    var kpi2Lbl = document.getElementById('recKpi2Label');
    var kpi3Lbl = document.getElementById('recKpi3Label');
    var srcText = document.getElementById('recSizingSourceText');
    var unitSub = document.getElementById('recPrimaryUnitSub');

    if (state.recWorkload === 'pretrain' || state.recWorkload === 'posttrain') {
      var isPost = state.recWorkload === 'posttrain';
      var trainNodes = isPost ? Math.max(1, Math.round(scaleProfile.trNodes / 4)) : scaleProfile.trNodes;
      var trainGpus = trainNodes * pHw.devicesPerNode;
      var tokensT = isPost ? 0.15 : scaleProfile.trTokensT;
      var totalFlops = 6.0 * (scaleProfile.totalParamsB * 1e9) * (tokensT * 1e12);
      var mfu = 0.45;
      var sustainedFlops = trainGpus * (pHw.bf16Tflops * 1e12) * mfu;
      var hours = (totalFlops / sustainedFlops) / 3600.0;
      var days = hours / 24.0;
      var hrRate = pHw.pricing[state.pricingBasis] || pHw.pricing.cud3y;
      var campaignCost = hours * trainGpus * hrRate;

      if (srcText) {
        srcText.textContent =
          scaleProfile.totalParamsB + 'B ' + (isPost ? 'SFT / RL Post-Training (' + (tokensT * 1000) + 'B tok)' : 'Pre-Training (' + tokensT.toFixed(1) + 'T tok)');
      }
      if (kpi1Lbl) kpi1Lbl.textContent = isPost ? 'Fine-Tuning Cluster' : 'Pre-Training Cluster';
      document.getElementById('recPrimaryPool').textContent = fmtInt(trainGpus) + ' GPUs (' + trainNodes + ' Nodes)';
      document.getElementById('recPrimaryPoolSub').textContent = trainNodes + '× ' + pHw.machineType + ' @ 45% MFU';

      if (kpi2Lbl) kpi2Lbl.textContent = 'Est. Training Duration';
      document.getElementById('recPrimaryMonthly').textContent = days < 2 ? Math.max(1, Math.round(hours)) + ' Hours' : days.toFixed(1) + ' Days';
      document.getElementById('recPrimaryMonthlySub').textContent = fmtInt(trainGpus * days) + ' GPU-days total';

      if (kpi3Lbl) kpi3Lbl.textContent = 'Est. Campaign Cost';
      document.getElementById('recPrimaryUnit').textContent = fmtMoneyK(campaignCost);
      if (unitSub) unitSub.textContent = state.pricingBasis.toUpperCase() + ' ($' + hrRate.toFixed(2) + '/GPU-hr)';
    } else {
      var isBatch = state.recWorkload === 'inference_batch';
      var recSimState = {
        sku: primaryKey,
        arch: scaleProfile.arch,
        totalParamsB: scaleProfile.totalParamsB,
        activeParamsB: scaleProfile.activeParamsB,
        precisionBytes: 1,
        tpmMillions: scaleProfile.tpmMillions,
        targetTokSec: Math.round((scaleProfile.tpmMillions * 1e6) / 60.0),
        ctxLen: state.recLongCtx ? 32768 : 2048,
        outLen: state.recLongCtx ? 1024 : 512,
        sizingMethod: 'roofline',
        empiricalTps: 3000,
        utilPct: isBatch ? 92 : 80,
        batchSize: isBatch ? 160 : (state.recPriority === 'latency' ? 48 : 96),
        mfuPct: 50,
        mbuPct: state.recPriority === 'latency' ? 55 : 65,
        pricingBasis: state.pricingBasis,
        customRate: pHw.pricing[state.pricingBasis] || pHw.pricing.cud3y
      };
      var sized = computePlatformSizing(pHw, recSimState, true);

      if (srcText) {
        srcText.textContent =
          scaleProfile.label +
          (state.recLongCtx ? ' (128K Long-Ctx)' : '') +
          ' • ' +
          scaleProfile.tpmMillions.toFixed(1) +
          'M tok/min (' +
          fmtInt(recSimState.targetTokSec) +
          ' tok/s)';
      }
      if (kpi1Lbl) kpi1Lbl.textContent = 'Recommended Pool';
      document.getElementById('recPrimaryPool').textContent =
        fmtInt(sized.alignedDevices) + ' GPUs (' + sized.nodesNeeded + ' Nodes)';
      document.getElementById('recPrimaryPoolSub').textContent =
        'Min TP=' + sized.minTp + ' • ' + fmtInt(sized.effTpsPerDevice) + ' eff. tok/s/GPU';

      if (kpi2Lbl) kpi2Lbl.textContent = 'Est. Monthly Spend';
      document.getElementById('recPrimaryMonthly').textContent = fmtMoneyK(sized.monthlyCost) + ' / mo';
      document.getElementById('recPrimaryMonthlySub').textContent =
        state.pricingBasis.toUpperCase() + ' ($' + sized.hourlyRate.toFixed(2) + '/GPU-hr)';

      if (kpi3Lbl) kpi3Lbl.textContent = 'Cost per 1M Tokens';
      document.getElementById('recPrimaryUnit').textContent = '$' + sized.costPer1M.toFixed(2) + ' / 1M';
      if (unitSub) unitSub.textContent = 'At ' + (sized.monthlyTokens / 1e9).toFixed(1) + 'B tokens/month';
    }

    // Render Live Multi-Candidate Match Scoreboard
    var sbBox = document.getElementById('recScoreboardBox');
    if (sbBox) {
      sbBox.replaceChildren();
      recResult.ranked.slice(0, 4).forEach(function (item, idx) {
        var row = createEl('div', 'flex items-center gap-2.5 text-xs');
        var rankBadge = createEl(
          'span',
          idx === 0
            ? 'w-16 shrink-0 font-bold text-[#1a73e8] font-mono'
            : 'w-16 shrink-0 font-medium text-[#5f6368] font-mono',
          '#' + (idx + 1) + ' ' + item.hw.id.toUpperCase()
        );
        var track = createEl('div', 'flex-1 h-2 bg-white rounded-full overflow-hidden border border-[#dadce0]');
        var fill = createEl('div', idx === 0 ? 'h-full bg-[#1a73e8]' : idx === 1 ? 'h-full bg-[#188038]' : 'h-full bg-[#5f6368]/60');
        fill.style.width = item.score + '%';
        track.appendChild(fill);
        var scoreLbl = createEl(
          'span',
          idx === 0 ? 'w-28 text-right font-mono font-bold text-[#202124]' : 'w-28 text-right font-mono text-[#5f6368]',
          item.score + ' pts ($' + item.hw.pricing.cud3y.toFixed(2) + '/h)'
        );
        row.appendChild(rankBadge);
        row.appendChild(track);
        row.appendChild(scoreLbl);
        sbBox.appendChild(row);
      });
    }

    // Populate Specs Grid
    var specsBox = document.getElementById('recPrimarySpecs');
    specsBox.replaceChildren();
    var specItems = [
      ['Machine Series', pHw.machineType],
      ['Memory / GPU', pHw.memPerDeviceGB + ' GB'],
      ['Memory / Node', fmtInt(pHw.memPerNodeGB) + ' GB (8 GPUs)'],
      ['HBM Bandwidth', pHw.bwTBps.toFixed(2) + ' TB/s / GPU'],
      ['FP8 Compute', fmtInt(pHw.fp8Tflops) + ' TFLOPs / GPU'],
      ['Interconnect', pHw.fabric]
    ];
    specItems.forEach(function (pair) {
      var d = createEl('div', 'p-2 rounded bg-[#f8f9fa] border border-[#dadce0]');
      d.appendChild(createEl('div', 'text-[11px] text-[#5f6368] font-sans', pair[0]));
      d.appendChild(createEl('div', 'font-bold text-[#202124] mt-0.5', pair[1]));
      specsBox.appendChild(d);
    });

    // Populate Official Pitch Decks Box in Recommender Primary Card
    var decksBox = document.getElementById('recPrimaryDecksBox');
    if (decksBox) {
      decksBox.replaceChildren();
      var deckList = (pHw.pitchDecks || []).concat([
        { label: 'go/ai-infra-pitch', title: 'AI Infra Portfolio Deck', url: 'https://goto.google.com/ai-infra-pitch' },
        { label: 'go/which-gpu', title: 'GPU Selection Guide', url: 'https://goto.google.com/which-gpu' }
      ]);
      deckList.forEach(function (dk) {
        var a = createEl(
          'a',
          'px-2.5 py-1 rounded-md bg-white border border-[#1a73e8]/40 text-xs font-mono font-bold text-[#1a73e8] hover:bg-[#1a73e8] hover:text-white transition shadow-2xs',
          '📊 ' + dk.label + ' (' + dk.title + ') ↗'
        );
        a.href = dk.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        decksBox.appendChild(a);
      });
    }

    // Populate Dynamic Context-Specific Rationales
    var ratList = document.getElementById('recPrimaryRationales');
    ratList.replaceChildren();
    var dynamicReasons = (recResult.reasons[primaryKey] || []).concat(pHw.rationales).slice(0, 4);
    dynamicReasons.forEach(function (text) {
      var li = createEl('li', 'flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-lg border border-[#dadce0]');
      li.appendChild(createEl('span', 'text-[#188038] font-bold', '✓'));
      li.appendChild(createEl('span', '', text));
      ratList.appendChild(li);
    });

    // Alternative Card
    var altReason = (recResult.reasons[altKey] && recResult.reasons[altKey][0]) || aHw.plainWords;
    document.getElementById('recAltTitle').textContent = aHw.name + ' (Score: ' + recResult.ranked[1].score + '/100)';
    document.getElementById('recAltDesc').textContent =
      'Runner-up choice (' +
      aHw.memPerDeviceGB +
      ' GB/GPU, ' +
      aHw.bwTBps.toFixed(2) +
      ' TB/s, $' +
      aHw.pricing.cud3y.toFixed(2) +
      '/GPU-hr 3Y CUD): ' +
      altReason;

    // Save current recommendation for "Load into Engineering Cockpit"
    state.lastRecPrimaryKey = primaryKey;
    state.lastRecScaleProfile = scaleProfile;

    // Populate Cheat Card Matrix with Region Zones & Pitch Deck links
    var catBody = document.getElementById('recCatalogTableBody');
    catBody.replaceChildren();
    ['b200', 'h200', 'h100', 'g4', 'l4', 'tpu7x'].forEach(function (k) {
      var h = HARDWARE_CATALOG[k];
      var zList = getRegionSkuZones(state.recRegion, k);
      var isAv = zList.length > 0;
      var tr = createEl('tr', k === primaryKey ? 'bg-[#e8f0fe]' : '');
      var tdName = createEl('td', 'py-2 pr-2 font-sans font-bold text-[#202124]');
      tdName.textContent = h.shortName + ' (' + h.machineType + ')';
      tr.appendChild(tdName);
      tr.appendChild(createEl('td', 'py-2 px-2 text-right', h.memPerDeviceGB + ' GB'));
      tr.appendChild(createEl('td', 'py-2 px-2 text-right', fmtInt(h.memPerNodeGB) + ' GB'));
      tr.appendChild(createEl('td', 'py-2 px-2 text-right', h.bwTBps.toFixed(2) + ' TB/s'));
      tr.appendChild(createEl('td', 'py-2 px-2 text-right', fmtInt(h.fp8Tflops) + ' TF'));
      tr.appendChild(createEl('td', 'py-2 px-2 text-right font-bold text-[#1a73e8]', '$' + h.pricing.cud3y.toFixed(2)));

      var tdZone = createEl(
        'td',
        'py-2 px-2 text-right font-mono ' + (isAv ? 'text-[#137333] font-bold' : 'text-[#c5221f]'),
        state.recRegion === 'global' ? 'Global' : (isAv ? ('✓ ' + zList.join(',')) : '✗ None')
      );
      tr.appendChild(tdZone);

      var tdDeck = createEl('td', 'py-2 pl-2 text-right');
      if (h.pitchDecks && h.pitchDecks.length > 0) {
        var dLink = createEl('a', 'text-[#1a73e8] font-bold hover:underline', h.pitchDecks[0].label + ' ↗');
        dLink.href = h.pitchDecks[0].url;
        dLink.target = '_blank';
        dLink.rel = 'noopener noreferrer';
        tdDeck.appendChild(dLink);
      }
      tr.appendChild(tdDeck);
      catBody.appendChild(tr);
    });
  }

  // Render View 3: Engineering Cockpit (Inference & Training)
  function renderCockpit() {
    var primaryHw = HARDWARE_CATALOG[state.sku];
    var res = computePlatformSizing(primaryHw, state, false);

    // Update Region Status Badge & Pitch Deck Link in Card 1
    var infRegBadge = document.getElementById('infGpuRegionStatusBadge');
    var infDeckLink = document.getElementById('infGpuPitchDeckLink');
    var infZones = getRegionSkuZones(state.region, state.sku);
    if (infRegBadge) {
      if (state.region === 'global') {
        infRegBadge.textContent = '✓ Global (All Regions)';
        infRegBadge.className = 'px-2 py-0.5 rounded font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]';
      } else if (infZones.length > 0) {
        infRegBadge.textContent = '✓ Verified in ' + state.region + ' (zone' + (infZones.length > 1 ? 's ' : ' ') + infZones.join(', ') + ')';
        infRegBadge.className = 'px-2 py-0.5 rounded font-mono font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]';
      } else {
        var altSku = getBestAvailableSkuInRegion(state.region);
        var altText = altSku ? ('Available: ' + HARDWARE_CATALOG[altSku].shortName) : 'No LLM GPUs in region';
        infRegBadge.textContent = '⚠ Not in ' + state.region + ' (' + altText + ')';
        infRegBadge.className = 'px-2 py-0.5 rounded font-mono font-bold bg-[#fef7e0] text-[#b06000] border border-[#fde293]';
      }
    }
    if (infDeckLink && primaryHw.pitchDecks && primaryHw.pitchDecks.length > 0) {
      infDeckLink.textContent = '📊 ' + primaryHw.pitchDecks[0].label + ' ↗';
      infDeckLink.href = primaryHw.pitchDecks[0].url;
    }

    // Update QPS & Traffic Converter Summary
    var qpsInput = document.getElementById('inpPeakQps');
    if (qpsInput && document.activeElement !== qpsInput) {
      qpsInput.value = state.peakQps >= 100 ? Math.round(state.peakQps) : Number(state.peakQps.toFixed(2));
    }
    var qpsSum = document.getElementById('qpsConversionSummary');
    if (qpsSum) {
      var prefillTokSec = Math.round(state.peakQps * state.ctxLen);
      var decodeTokSec = Math.round(state.peakQps * state.outLen);
      var totalTokSec = prefillTokSec + decodeTokSec;
      if (state.qpsBasis === 'decode') {
        qpsSum.textContent =
          'Formula: ' + Number(state.peakQps.toFixed(2)) + ' QPS × ' + fmtInt(state.outLen) + ' output tok/req = ' +
          fmtInt(state.targetTokSec) + ' decode tok/s (' + state.tpmMillions.toFixed(2) + 'M tok/min) • ' +
          'Prefill ingress: ' + fmtInt(prefillTokSec) + ' input tok/s (@ ' + fmtInt(state.ctxLen) + ' ctx)';
      } else {
        qpsSum.textContent =
          'Formula: ' + Number(state.peakQps.toFixed(2)) + ' QPS × (' + fmtInt(state.ctxLen) + ' in + ' + fmtInt(state.outLen) + ' out = ' +
          fmtInt(state.ctxLen + state.outLen) + ' tok/req) = ' + fmtInt(totalTokSec) + ' total tok/s (' + state.tpmMillions.toFixed(2) + 'M tok/min)';
      }
    }

    // Update Input Labels
    document.getElementById('infTotalParamsDisplay').textContent = state.totalParamsB + ' Billion';
    document.getElementById('infActiveParamsDisplay').textContent = state.activeParamsB + ' Billion';
    document.getElementById('infSlaSummaryBadge').textContent =
      Number(state.peakQps.toFixed(1)) + ' QPS • ' + fmtInt(state.targetTokSec) + ' tok/s (' + state.tpmMillions.toFixed(1) + 'M/min)';
    document.getElementById('lblEmpiricalTps').textContent = fmtInt(state.empiricalTps) + ' tok/s/GPU';
    document.getElementById('lblUtilPct').textContent = state.utilPct + '%';
    document.getElementById('lblBatchSize').textContent = 'B = ' + state.batchSize;
    document.getElementById('infPrefillMfuDisplay').textContent = state.mfuPct + '%';
    document.getElementById('infDecodeMbuDisplay').textContent = state.mbuPct + '%';

    // Update 4 Top Inference KPIs
    document.getElementById('infKpiTotalGpus').textContent = fmtInt(res.alignedDevices) + ' GPUs';
    document.getElementById('infKpiTotalNodes').textContent = res.nodesNeeded + ' Nodes (8 GPUs/node)';
    document.getElementById('infKpiTotalCost').textContent = fmtMoneyK(res.monthlyCost) + ' / mo';

    document.getElementById('infKpiPrefillGpus').textContent = (res.prefillNodes * 8) + ' GPUs';
    document.getElementById('infKpiPrefillNodes').textContent = res.prefillNodes + ' Nodes • Compute Bound';
    document.getElementById('infKpiPrefillSub').textContent = 'Prompt: ' + fmtInt(state.ctxLen) + ' tok';

    document.getElementById('infKpiDecodeGpus').textContent = (res.decodeNodes * 8) + ' GPUs';
    document.getElementById('infKpiDecodeNodes').textContent = res.decodeNodes + ' Nodes • HBM BW Bound';
    document.getElementById('infKpiDecodeSub').textContent = fmtInt(res.effTpsPerDevice) + ' eff. tok/s/GPU';

    document.getElementById('infKpiUnitCost').textContent = '$' + res.costPer1M.toFixed(2);
    document.getElementById('infKpiThroughputRate').textContent = (res.monthlyTokens / 1e9).toFixed(1) + 'B tok/mo';

    // Update Disaggregated & Memory Bar
    document.getElementById('infReplicaTpBadge').textContent =
      'TP=' + res.minTp + ' • ' + fmtInt(res.replicaHbmTotal) + ' GB HBM / Replica';
    document.getElementById('infHbmSummaryText').textContent =
      res.weightGB.toFixed(1) + ' GB Weights / ' + res.replicaHbmTotal.toFixed(0) + ' GB Total';

    var wPct = Math.min(82, Math.max(8, Math.round((res.weightGB / res.replicaHbmTotal) * 100)));
    var kvPct = Math.max(6, 88 - wPct);
    document.getElementById('infBarWeights').style.width = wPct + '%';
    document.getElementById('infBarKv').style.width = kvPct + '%';
    document.getElementById('infBarReserve').style.width = (100 - wPct - kvPct) + '%';

    var estKvTokensK = Math.round((res.freeKvGB * 1024) / (0.16 * (state.activeParamsB / 70.0) * state.precisionBytes) / 1000);
    document.getElementById('infLegendWeights').textContent = 'Model Weights: ' + res.weightGB.toFixed(1) + ' GB';
    document.getElementById('infLegendKv').textContent =
      'Available KV Cache: ' + res.freeKvGB.toFixed(1) + ' GB (~' + fmtInt(estKvTokensK) + 'K tokens)';

    document.getElementById('infArchFlopsPerTok').textContent = (2 * state.activeParamsB) + ' GFLOPs/tok';
    document.getElementById('infArchPeakFlops').textContent =
      fmtInt(state.precisionBytes === 1 ? primaryHw.fp8Tflops : primaryHw.bf16Tflops) + ' TFLOPs/GPU';
    document.getElementById('infArchPrefillPool').textContent =
      (res.prefillNodes * 8) + ' GPUs (' + res.prefillNodes + ' Nodes)';

    document.getElementById('infArchHbmBw').textContent =
      primaryHw.bwTBps.toFixed(2) + ' TB/s @ ' + state.mbuPct + '% MBU';
    document.getElementById('infArchEffTps').textContent =
      fmtInt(res.effTpsPerDevice) + ' tok/s/GPU (' + fmtInt(res.rawTpsPerDevice) + ' raw)';
    document.getElementById('infArchDecodePool').textContent =
      (res.decodeNodes * 8) + ' GPUs (' + res.decodeNodes + ' Nodes)';

    // Render Cross-Platform Table
    var compBody = document.getElementById('cockpitCompTableBody');
    compBody.replaceChildren();
    ['b200', 'h200', 'h100', 'g4', 'tpu7x', 'l4'].forEach(function (k) {
      var hw = HARDWARE_CATALOG[k];
      var r = computePlatformSizing(hw, state, true);
      var kZones = getRegionSkuZones(state.region, k);
      var kAvail = kZones.length > 0;
      var tr = createEl('tr', k === state.sku ? 'bg-[#e8f0fe]' : '');
      var tdPlat = createEl('td', 'py-2.5 px-3 font-sans');
      tdPlat.appendChild(createEl('div', 'font-bold text-[#202124]', hw.shortName));
      var subRow = createEl('div', 'flex flex-wrap items-center gap-1.5 mt-0.5');
      subRow.appendChild(createEl('span', 'text-xs font-mono text-[#5f6368]', hw.machineType));
      subRow.appendChild(
        createEl(
          'span',
          'px-1.5 py-0.2 rounded text-[10px] font-mono ' + (kAvail ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#fce8e6] text-[#c5221f]'),
          state.region === 'global' ? 'Global' : (kAvail ? ('✓ ' + kZones.join(',')) : '✗ None')
        )
      );
      if (hw.pitchDecks && hw.pitchDecks.length > 0) {
        var dl = createEl('a', 'text-[10px] font-mono font-bold text-[#1a73e8] hover:underline', hw.pitchDecks[0].label + ' ↗');
        dl.href = hw.pitchDecks[0].url;
        dl.target = '_blank';
        dl.rel = 'noopener noreferrer';
        subRow.appendChild(dl);
      }
      tdPlat.appendChild(subRow);
      tr.appendChild(tdPlat);

      tr.appendChild(createEl('td', 'py-2.5 px-2 text-right', 'TP=' + r.minTp));
      tr.appendChild(createEl('td', 'py-2.5 px-2 text-right', fmtInt(r.effTpsPerDevice) + ' (' + fmtInt(r.rawTpsPerDevice) + ')'));
      tr.appendChild(createEl('td', 'py-2.5 px-2 text-right font-bold text-[#1a73e8]', fmtInt(r.alignedDevices) + ' (' + r.nodesNeeded + 'n)'));
      tr.appendChild(createEl('td', 'py-2.5 px-2 text-right', hw.memPerDeviceGB + 'G (' + fmtInt(hw.memPerNodeGB) + 'G)'));
      tr.appendChild(createEl('td', 'py-2.5 px-2 text-right', fmtMoneyK(r.monthlyCost)));
      tr.appendChild(createEl('td', 'py-2.5 px-3 text-right font-bold text-[#188038]', '$' + r.costPer1M.toFixed(2)));
      compBody.appendChild(tr);
    });

    // Update Executive Pitch Deck Modal values
    document.getElementById('deckSlide1Title').textContent =
      primaryHw.name + ' — ' + state.totalParamsB + 'B ' + (state.arch === 'moe' ? 'MoE' : 'Dense') + ' Sizing';
    document.getElementById('deckSlide1Fleet').textContent =
      fmtInt(res.alignedDevices) + ' GPUs (' + res.nodesNeeded + ' Nodes)';
    document.getElementById('deckSlide1Cost').textContent = fmtMoneyK(res.monthlyCost) + ' / mo';
    document.getElementById('deckSlide1Unit').textContent = '$' + res.costPer1M.toFixed(2) + ' / 1M tok';
  }

  // Render Training Cockpit
  function renderTrainingCockpit() {
    var hw = HARDWARE_CATALOG[state.trGpu] || HARDWARE_CATALOG.b200;
    var gpus = state.trNodes * hw.devicesPerNode;
    var totalFlops = 6.0 * (state.trParamsB * 1e9) * (state.trTokensT * 1e12);
    var sustainedFlopsSec = gpus * (hw.bf16Tflops * 1e12) * (state.trMfu / 100.0);
    var totalHours = (totalFlops / sustainedFlopsSec) / 3600.0;
    var totalDays = totalHours / 24.0;
    var totalCost = totalHours * gpus * hw.pricing.cud3y;

    document.getElementById('trSpecCompute').textContent = fmtInt(hw.bf16Tflops) + ' TF';
    document.getElementById('trSpecComputeSub').textContent = 'BF16 (' + fmtInt(hw.fp8Tflops) + ' FP8)';
    document.getElementById('trSpecHbm').textContent = hw.memPerDeviceGB + ' GB';
    document.getElementById('trSpecHbmSub').textContent = fmtInt(hw.memPerNodeGB) + ' GB / Node';

    document.getElementById('trNodesBadge').textContent = state.trNodes + ' Nodes (' + fmtInt(gpus) + ' GPUs)';
    document.getElementById('trMfuBadge').textContent = state.trMfu + '%';

    document.getElementById('trKpiGpus').textContent = fmtInt(gpus) + ' GPUs';
    document.getElementById('trKpiNodes').textContent = state.trNodes + ' Nodes (8 GPUs/node)';
    document.getElementById('trKpiDays').textContent = totalDays.toFixed(1) + ' Days';
    document.getElementById('trKpiHours').textContent = Math.round(totalHours) + ' Hours @ ' + state.trMfu + '% MFU';
    document.getElementById('trKpiFlops').textContent = (totalFlops / 1e21).toFixed(2) + ' ZFLOPs';
    document.getElementById('trKpiGpuDays').textContent = fmtInt(gpus * totalDays) + ' GPU-Days';
    document.getElementById('trKpiCost').textContent = fmtMoneyK(totalCost);
    document.getElementById('trKpiRateSub').textContent = 'At $' + hw.pricing.cud3y.toFixed(2) + '/GPU-hr (3Y CUD)';

    var clusterHbmGB = gpus * hw.memPerDeviceGB;
    var zeroStateGB = state.trParamsB * 16; // 16 bytes/param for BF16 weights + grads + FP32 AdamW
    var allocPct = Math.min(85, Math.max(3, (zeroStateGB / clusterHbmGB) * 100));
    var freePerGpu = Math.max(8, hw.memPerDeviceGB - (zeroStateGB / gpus) - 12);

    document.getElementById('trMemPercentBadge').textContent = allocPct.toFixed(1) + '% Cluster HBM Allocated';
    document.getElementById('trClusterHbmTotal').textContent = (clusterHbmGB / 1024).toFixed(2) + ' TB';
    document.getElementById('trZeroStateTotal').textContent = fmtInt(zeroStateGB) + ' GB';
    document.getElementById('trFreeHbmPerGpu').textContent = freePerGpu.toFixed(1) + ' GB / GPU';

    var tfCode = [
      'resource "google_container_node_pool" "gpu_training_pool" {',
      '  name       = "' + hw.id + '-training-pool"',
      '  location   = "' + state.region + '"',
      '  cluster    = google_container_cluster.ai_cluster.name',
      '  node_count = ' + state.trNodes,
      '',
      '  node_config {',
      '    machine_type = "' + hw.machineType.split(' ')[0] + '"',
      '    gvnic { enabled = true }',
      '    reservation_affinity {',
      '      consume_reservation_type = "SPECIFIC_RESERVATION"',
      '    }',
      '  }',
      '}'
    ].join('\n');
    document.getElementById('trTerraformPre').textContent = tfCode;
  }

  function applyPreset(presetKey) {
    var p = WORKLOAD_PRESETS[presetKey];
    if (!p) return;
    state.activePreset = presetKey;
    state.sku = p.sku;
    state.arch = p.arch;
    state.totalParamsB = p.totalParamsB;
    state.activeParamsB = p.activeParamsB;
    state.precisionBytes = p.precisionBytes;
    state.tpmMillions = p.tpmMillions;
    state.targetTokSec = Math.round((p.tpmMillions * 1e6) / 60.0);
    state.ctxLen = p.ctxLen;
    state.outLen = p.outLen;
    state.trafficDriver = 'tpm';
    syncQpsFromTargetTokSec();
    state.sizingMethod = p.sizingMethod;
    state.empiricalTps = p.empiricalTps;
    state.utilPct = p.utilPct;
    state.batchSize = p.batchSize;
    state.mfuPct = p.mfuPct;
    state.mbuPct = p.mbuPct;
    state.customRate = HARDWARE_CATALOG[p.sku].pricing[state.pricingBasis] || HARDWARE_CATALOG[p.sku].pricing.cud3y;

    syncControlsFromState();
    renderOverview();
    renderRecommender();
    renderCockpit();
  }

  function syncControlsFromState() {
    document.getElementById('infGpuSelect').value = state.sku;
    var ovRegSel = document.getElementById('ovRegionSelect');
    if (ovRegSel) ovRegSel.value = state.region;
    var infRegSel = document.getElementById('infRegionSelect');
    if (infRegSel) infRegSel.value = state.region;
    var recRegSel = document.getElementById('recSelectRegion');
    if (recRegSel) recRegSel.value = state.recRegion;

    document.getElementById('infSliderTotalParams').value = state.totalParamsB;
    document.getElementById('infSliderActiveParams').value = state.activeParamsB;
    var qpsEl = document.getElementById('inpPeakQps');
    if (qpsEl && document.activeElement !== qpsEl) {
      qpsEl.value = state.peakQps >= 100 ? Math.round(state.peakQps) : Number(state.peakQps.toFixed(2));
    }
    var btnQpsDec = document.getElementById('btnQpsBasisDecode');
    var btnQpsTot = document.getElementById('btnQpsBasisTotal');
    if (btnQpsDec && btnQpsTot) {
      if (state.qpsBasis === 'decode') {
        btnQpsDec.className = 'px-2 py-0.5 rounded bg-[#e8f0fe] text-[#174ea6] border border-[#1a73e8] font-bold transition';
        btnQpsTot.className = 'px-2 py-0.5 rounded bg-white text-[#5f6368] border border-[#dadce0] hover:border-[#1a73e8] transition';
      } else {
        btnQpsTot.className = 'px-2 py-0.5 rounded bg-[#e8f0fe] text-[#174ea6] border border-[#1a73e8] font-bold transition';
        btnQpsDec.className = 'px-2 py-0.5 rounded bg-white text-[#5f6368] border border-[#dadce0] hover:border-[#1a73e8] transition';
      }
    }
    document.getElementById('inpTpmMillions').value = Number(state.tpmMillions.toFixed(2));
    document.getElementById('inpTargetTokSec').value = state.targetTokSec;
    document.getElementById('infInputContextLen').value = state.ctxLen;
    document.getElementById('infInputOutputLen').value = state.outLen;
    document.getElementById('inpEmpiricalTps').value = state.empiricalTps;
    document.getElementById('inpUtilPct').value = state.utilPct;
    document.getElementById('infSliderPrefillMfu').value = state.mfuPct;
    document.getElementById('infSliderDecodeMbu').value = state.mbuPct;
    document.getElementById('inpCustomRate').value = state.customRate;

    // Dense vs MoE buttons
    var btnDense = document.getElementById('btnInfDense');
    var btnMoe = document.getElementById('btnInfMoe');
    if (state.arch === 'dense') {
      btnDense.className = 'py-2 px-3 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs';
      btnMoe.className = 'py-2 px-3 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-white text-[#5f6368] border border-[#dadce0] hover:text-[#202124] hover:border-[#1a73e8]';
    } else {
      btnMoe.className = 'py-2 px-3 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs';
      btnDense.className = 'py-2 px-3 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-white text-[#5f6368] border border-[#dadce0] hover:text-[#202124] hover:border-[#1a73e8]';
    }

    // Precision buttons
    var btnFp8 = document.getElementById('btnInfPrecFp8');
    var btnBf16 = document.getElementById('btnInfPrecBf16');
    if (state.precisionBytes === 1) {
      btnFp8.className = 'py-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs';
      btnBf16.className = 'py-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-white text-[#5f6368] border border-[#dadce0] hover:text-[#202124] hover:border-[#1a73e8]';
    } else {
      btnBf16.className = 'py-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs';
      btnFp8.className = 'py-2 rounded-lg text-sm font-bold transition flex flex-col items-center justify-center bg-white text-[#5f6368] border border-[#dadce0] hover:text-[#202124] hover:border-[#1a73e8]';
    }

    // Sizing Method toggle
    var btnEmp = document.getElementById('btnMethodEmpirical');
    var btnRoof = document.getElementById('btnMethodRoofline');
    var empBox = document.getElementById('empControlsBox');
    var roofBox = document.getElementById('rooflineControlsBox');
    if (state.sizingMethod === 'empirical') {
      btnEmp.className = 'py-2 px-2.5 rounded-lg text-xs font-bold transition bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs';
      btnRoof.className = 'py-2 px-2.5 rounded-lg text-xs font-bold transition bg-white text-[#5f6368] border border-[#dadce0] hover:text-[#202124] hover:border-[#1a73e8]';
      empBox.classList.remove('hidden');
      roofBox.classList.add('hidden');
    } else {
      btnRoof.className = 'py-2 px-2.5 rounded-lg text-xs font-bold transition bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs';
      btnEmp.className = 'py-2 px-2.5 rounded-lg text-xs font-bold transition bg-white text-[#5f6368] border border-[#dadce0] hover:text-[#202124] hover:border-[#1a73e8]';
      empBox.classList.add('hidden');
      roofBox.classList.remove('hidden');
    }

    // Preset pill highlights
    document.querySelectorAll('.preset-btn').forEach(function (btn) {
      if (btn.getAttribute('data-preset') === state.activePreset) {
        btn.className = 'preset-btn px-3 py-1 rounded-md text-xs font-bold border border-[#1a73e8] bg-[#e8f0fe] text-[#202124] transition';
      } else {
        btn.className = 'preset-btn px-3 py-1 rounded-md text-xs font-medium border border-[#dadce0] bg-white text-[#3c4043] hover:border-[#1a73e8] transition';
      }
    });
  }

  function switchPersonaView(view) {
    state.activeView = view;
    var views = {
      overview: document.getElementById('overviewViewContainer'),
      recommender: document.getElementById('recommenderViewContainer'),
      cockpit: document.getElementById('cockpitViewContainer')
    };
    var btns = {
      overview: document.getElementById('personaBtnOverview'),
      recommender: document.getElementById('personaBtnRecommender'),
      cockpit: document.getElementById('personaBtnCockpit')
    };
    Object.keys(views).forEach(function (k) {
      if (k === view) {
        views[k].classList.remove('hidden');
        btns[k].className = 'flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium transition bg-[#1a73e8] text-white shadow-xs';
      } else {
        views[k].classList.add('hidden');
        btns[k].className = 'flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-medium transition text-[#5f6368] hover:text-[#202124]';
      }
    });
  }

  function syncThemeButtonLabel() {
    var isDark = document.documentElement.classList.contains('dark');
    var sun = document.getElementById('themeIconSun');
    var moon = document.getElementById('themeIconMoon');
    var lbl = document.getElementById('themeToggleLabel');
    if (isDark) {
      sun.classList.remove('hidden');
      moon.classList.add('hidden');
      lbl.textContent = 'Light';
    } else {
      sun.classList.add('hidden');
      moon.classList.remove('hidden');
      lbl.textContent = 'Dark';
    }
  }

  function initEvents() {
    // Persona View Switcher
    ['personaBtnOverview', 'personaBtnRecommender', 'personaBtnCockpit'].forEach(function (id) {
      var btn = document.getElementById(id);
      btn.addEventListener('click', function () {
        switchPersonaView(btn.getAttribute('data-view'));
      });
    });

    document.getElementById('btnOverviewToCockpit').addEventListener('click', function () {
      switchPersonaView('cockpit');
    });

    // Dark / Light Theme Toggle
    document.getElementById('themeToggleBtn').addEventListener('click', function () {
      var html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
        try { localStorage.setItem('gpu_sizing_theme', 'light'); } catch (e) {}
      } else {
        html.classList.remove('light');
        html.classList.add('dark');
        try { localStorage.setItem('gpu_sizing_theme', 'dark'); } catch (e) {}
      }
      syncThemeButtonLabel();
    });

    // Modals
    var deckModal = document.getElementById('executivePitchDeckModal');
    document.getElementById('btnOpenDeckModal').addEventListener('click', function () {
      deckModal.classList.remove('hidden');
    });
    document.getElementById('btnCloseDeckModal').addEventListener('click', function () {
      deckModal.classList.add('hidden');
    });
    deckModal.addEventListener('click', function (e) {
      if (e.target === deckModal) deckModal.classList.add('hidden');
    });

    var cheatModal = document.getElementById('infDiscoveryModal');
    document.getElementById('btnOpenCheatSheet').addEventListener('click', function () {
      cheatModal.classList.remove('hidden');
    });
    document.getElementById('btnCloseCheatSheet').addEventListener('click', function () {
      cheatModal.classList.add('hidden');
    });
    cheatModal.addEventListener('click', function (e) {
      if (e.target === cheatModal) cheatModal.classList.add('hidden');
    });

    // Overview Use-Case Tier Cards
    document.querySelectorAll('.tier-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var tier = card.getAttribute('data-tier');
        state.overviewTier = tier;
        document.querySelectorAll('.tier-card').forEach(function (c) {
          var isAct = c.getAttribute('data-tier') === tier;
          c.className = isAct
            ? 'tier-card group relative hover:z-30 p-5 rounded-lg border-2 text-left transition flex flex-col justify-between bg-[#e8f0fe] border-[#1a73e8] shadow-xs cursor-pointer'
            : 'tier-card group relative hover:z-30 p-5 rounded-lg border text-left transition flex flex-col justify-between bg-white border-[#dadce0] hover:border-[#1a73e8] shadow-xs cursor-pointer';
          var dot = c.querySelector('.tier-active-dot');
          if (dot) dot.classList.toggle('hidden', !isAct);
        });
        if (tier === 'frontier') {
          state.overviewLens = 'pretrain';
        } else {
          state.overviewLens = 'serving';
        }
        applyPreset(OVERVIEW_TIERS[tier].presetKey);
      });
    });

    // Overview Workload Lens Switcher
    document.querySelectorAll('[data-lens]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.overviewLens = btn.getAttribute('data-lens');
        document.querySelectorAll('[data-lens]').forEach(function (b) {
          var act = b.getAttribute('data-lens') === state.overviewLens;
          b.setAttribute('aria-pressed', act ? 'true' : 'false');
          b.className = act
            ? 'gcp-segmented-btn px-4 py-1.5 font-bold rounded-md bg-[#e8f0fe] text-[#174ea6] border border-[#1a73e8] shadow-xs transition cursor-pointer'
            : 'gcp-segmented-btn px-4 py-1.5 font-medium rounded-md bg-white text-[#3c4043] border border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#1a73e8] transition cursor-pointer';
        });
        renderOverview();
      });
    });

    // Overview Pricing Basis Switcher
    document.querySelectorAll('[data-pricing]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.pricingBasis = btn.getAttribute('data-pricing');
        state.customRate = HARDWARE_CATALOG[state.sku].pricing[state.pricingBasis];
        document.getElementById('inpCustomRate').value = state.customRate;
        document.querySelectorAll('[data-pricing]').forEach(function (b) {
          var act = b.getAttribute('data-pricing') === state.pricingBasis;
          b.setAttribute('aria-pressed', act ? 'true' : 'false');
          b.className = act
            ? 'gcp-segmented-btn px-3 py-1 rounded-md font-bold bg-[#e8f0fe] text-[#174ea6] border border-[#1a73e8] shadow-xs transition cursor-pointer'
            : 'gcp-segmented-btn px-3 py-1 rounded-md font-medium bg-white text-[#3c4043] border border-[#dadce0] hover:border-[#1a73e8] transition cursor-pointer';
        });
        renderOverview();
        renderRecommender();
        renderCockpit();
      });
    });

    document.getElementById('ovRegionSelect').addEventListener('change', function (e) {
      state.region = e.target.value;
      var infReg = document.getElementById('infRegionSelect');
      if (infReg) infReg.value = state.region;
      renderOverview();
      renderCockpit();
      renderTrainingCockpit();
    });

    var infRegSelect = document.getElementById('infRegionSelect');
    if (infRegSelect) {
      infRegSelect.addEventListener('change', function (e) {
        state.region = e.target.value;
        var ovReg = document.getElementById('ovRegionSelect');
        if (ovReg) ovReg.value = state.region;
        renderOverview();
        renderCockpit();
        renderTrainingCockpit();
      });
    }

    // Recommender Controls
    document.getElementById('recModeBtnBusiness').addEventListener('click', function () {
      state.recSubMode = 'business';
      document.getElementById('recTechOnlyBox').classList.add('hidden');
      document.getElementById('recQuestionCountBadge').textContent = '3';
      document.getElementById('recModeBtnBusiness').className = 'px-3.5 py-1.5 rounded-md font-bold transition bg-white text-[#1a73e8] shadow-xs border border-[#dadce0]';
      document.getElementById('recModeBtnTech').className = 'px-3.5 py-1.5 rounded-md font-semibold transition text-[#5f6368] hover:text-[#202124]';
    });

    document.getElementById('recModeBtnTech').addEventListener('click', function () {
      state.recSubMode = 'tech';
      document.getElementById('recTechOnlyBox').classList.remove('hidden');
      document.getElementById('recQuestionCountBadge').textContent = '5';
      document.getElementById('recModeBtnTech').className = 'px-3.5 py-1.5 rounded-md font-bold transition bg-white text-[#1a73e8] shadow-xs border border-[#dadce0]';
      document.getElementById('recModeBtnBusiness').className = 'px-3.5 py-1.5 rounded-md font-semibold transition text-[#5f6368] hover:text-[#202124]';
    });

    function syncRecommenderUI() {
      document.querySelectorAll('.rec-prio-btn').forEach(function (b) {
        var act = b.getAttribute('data-rec-prio') === state.recPriority;
        b.className = act
          ? 'rec-prio-btn p-2.5 rounded-lg border text-left transition flex items-center justify-between bg-[#e8f0fe] border-[#1a73e8] text-[#202124] font-semibold text-sm'
          : 'rec-prio-btn p-2.5 rounded-lg border text-left transition flex items-center justify-between bg-white border-[#dadce0] text-[#3c4043] hover:border-[#1a73e8] text-sm';
        var chk = b.querySelector('span:last-child');
        if (chk) chk.classList.toggle('hidden', !act);
      });

      document.querySelectorAll('.rec-scale-btn').forEach(function (b) {
        var act = b.getAttribute('data-rec-scale') === state.recModelScale;
        b.className = act
          ? 'rec-scale-btn p-2.5 rounded-lg border text-left transition bg-[#e8f0fe] border-[#1a73e8] text-[#202124] font-semibold text-sm'
          : 'rec-scale-btn p-2.5 rounded-lg border text-left transition bg-white border-[#dadce0] text-[#3c4043] hover:border-[#1a73e8] text-sm';
      });

      var badge = document.getElementById('recBadgeCtxTiebreaker');
      if (badge) {
        badge.textContent = state.recLongCtx ? 'On (128K+)' : 'Off (8K)';
        badge.className = state.recLongCtx
          ? 'px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#e8f0fe] text-[#1a73e8] border border-[#1a73e8]'
          : 'px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-white text-[#5f6368] border border-[#dadce0]';
      }

      document.querySelectorAll('.rec-wk-btn').forEach(function (b) {
        var act = b.getAttribute('data-rec-wk') === state.recWorkload;
        b.className = act
          ? 'rec-wk-btn p-3 rounded-lg border text-left transition flex items-center justify-between bg-[#e8f0fe] border-[#1a73e8] text-[#202124] font-semibold'
          : 'rec-wk-btn p-3 rounded-lg border text-left transition flex items-center justify-between bg-white border-[#dadce0] text-[#3c4043] hover:border-[#1a73e8]';
        var chk = b.querySelector('span:last-child');
        if (chk) chk.classList.toggle('hidden', !act);
      });

      var recRegSel = document.getElementById('recSelectRegion');
      if (recRegSel) recRegSel.value = state.recRegion;
    }

    document.getElementById('btnResetRecommender').addEventListener('click', function () {
      state.recPriority = 'cost';
      state.recModelScale = '32b-120b';
      state.recLongCtx = false;
      state.recWorkload = 'inference_online';
      state.recRegion = 'global';
      state.recRuntime = 'vllm';
      syncRecommenderUI();
      renderRecommender();
    });

    document.querySelectorAll('.rec-prio-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.recPriority = btn.getAttribute('data-rec-prio');
        syncRecommenderUI();
        renderRecommender();
      });
    });

    document.querySelectorAll('.rec-scale-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.recModelScale = btn.getAttribute('data-rec-scale');
        syncRecommenderUI();
        renderRecommender();
      });
    });

    document.getElementById('recBtnCtxTiebreaker').addEventListener('click', function () {
      state.recLongCtx = !state.recLongCtx;
      syncRecommenderUI();
      renderRecommender();
    });

    document.querySelectorAll('.rec-wk-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.recWorkload = btn.getAttribute('data-rec-wk');
        syncRecommenderUI();
        renderRecommender();
      });
    });

    document.getElementById('recSelectRegion').addEventListener('change', function (e) {
      state.recRegion = e.target.value;
      renderRecommender();
    });

    var rtSel = document.getElementById('recSelectRuntime');
    if (rtSel) {
      rtSel.addEventListener('change', function (e) {
        state.recRuntime = e.target.value;
        renderRecommender();
      });
    }

    var btnRecToCockpit = document.getElementById('btnRecToCockpit');
    if (btnRecToCockpit) {
      btnRecToCockpit.addEventListener('click', function () {
        var targetKey = state.lastRecPrimaryKey || 'b200';
        var prof = state.lastRecScaleProfile || { arch: 'dense', totalParamsB: 70, activeParamsB: 70, tpmMillions: 6.0, trTokensT: 2.0, trNodes: 32 };
        if (state.recRegion && state.recRegion !== 'global') {
          state.region = state.recRegion;
        }
        if (state.recWorkload === 'pretrain' || state.recWorkload === 'posttrain') {
          state.trGpu = HARDWARE_CATALOG[targetKey] && targetKey !== 'l4' ? targetKey : 'b200';
          state.trParamsB = prof.totalParamsB;
          state.trTokensT = state.recWorkload === 'posttrain' ? 0.15 : prof.trTokensT;
          state.trNodes = state.recWorkload === 'posttrain' ? Math.max(1, Math.round(prof.trNodes / 4)) : prof.trNodes;
          document.getElementById('trInputParamsB').value = state.trParamsB;
          document.getElementById('trInputTokensT').value = state.trTokensT;
          document.getElementById('trSliderNodes').value = state.trNodes;
          syncControlsFromState();
          renderOverview();
          renderTrainingCockpit();
          switchPersonaView('cockpit');
          document.getElementById('modeBtnTraining').click();
        } else {
          state.sku = targetKey;
          state.arch = prof.arch;
          state.totalParamsB = prof.totalParamsB;
          state.activeParamsB = prof.activeParamsB;
          state.tpmMillions = prof.tpmMillions;
          state.targetTokSec = Math.round((prof.tpmMillions * 1e6) / 60.0);
          state.ctxLen = state.recLongCtx ? 32768 : 2048;
          state.trafficDriver = 'tpm';
          syncQpsFromTargetTokSec();
          state.sizingMethod = 'roofline';
          state.customRate = HARDWARE_CATALOG[targetKey].pricing[state.pricingBasis] || HARDWARE_CATALOG[targetKey].pricing.cud3y;
          syncControlsFromState();
          renderOverview();
          renderCockpit();
          switchPersonaView('cockpit');
          document.getElementById('modeBtnInference').click();
        }
      });
    }

    // Cockpit Domain Switcher (Inference vs Training)
    document.getElementById('modeBtnInference').addEventListener('click', function () {
      document.getElementById('inferenceViewContainer').classList.remove('hidden');
      document.getElementById('trainingViewContainer').classList.add('hidden');
      document.getElementById('modeBtnInference').className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-bold transition bg-[#e8f0fe] text-[#202124] shadow-xs border border-[#1a73e8]';
      document.getElementById('modeBtnTraining').className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-bold transition bg-white text-[#5f6368] hover:text-[#202124] border border-[#dadce0] hover:border-[#1a73e8]';
    });

    document.getElementById('modeBtnTraining').addEventListener('click', function () {
      document.getElementById('inferenceViewContainer').classList.add('hidden');
      document.getElementById('trainingViewContainer').classList.remove('hidden');
      document.getElementById('modeBtnTraining').className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-bold transition bg-[#e8f0fe] text-[#202124] shadow-xs border border-[#1a73e8]';
      document.getElementById('modeBtnInference').className = 'flex items-center space-x-2 px-4 py-1.5 rounded-lg text-sm font-bold transition bg-white text-[#5f6368] hover:text-[#202124] border border-[#dadce0] hover:border-[#1a73e8]';
    });

    // Cockpit Preset Buttons
    document.querySelectorAll('.preset-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyPreset(btn.getAttribute('data-preset'));
      });
    });

    // Cockpit Inference Controls
    document.getElementById('infGpuSelect').addEventListener('change', function (e) {
      state.sku = e.target.value;
      state.customRate = HARDWARE_CATALOG[state.sku].pricing[state.pricingBasis];
      syncControlsFromState();
      renderOverview();
      renderCockpit();
    });

    document.getElementById('btnInfDense').addEventListener('click', function () {
      state.arch = 'dense';
      state.activeParamsB = state.totalParamsB;
      syncControlsFromState();
      renderCockpit();
    });

    document.getElementById('btnInfMoe').addEventListener('click', function () {
      state.arch = 'moe';
      state.activeParamsB = Math.max(8, Math.round(state.totalParamsB * 0.1));
      syncControlsFromState();
      renderCockpit();
    });

    document.getElementById('infSliderTotalParams').addEventListener('input', function (e) {
      state.totalParamsB = parseInt(e.target.value, 10) || 70;
      if (state.arch === 'dense') {
        state.activeParamsB = state.totalParamsB;
        document.getElementById('infSliderActiveParams').value = state.activeParamsB;
      }
      renderCockpit();
    });

    document.getElementById('infSliderActiveParams').addEventListener('input', function (e) {
      state.activeParamsB = parseInt(e.target.value, 10) || 70;
      renderCockpit();
    });

    document.getElementById('btnInfPrecFp8').addEventListener('click', function () {
      state.precisionBytes = 1;
      syncControlsFromState();
      renderCockpit();
    });

    document.getElementById('btnInfPrecBf16').addEventListener('click', function () {
      state.precisionBytes = 2;
      syncControlsFromState();
      renderCockpit();
    });

    // Bi-Directional Peak QPS <-> Tokens/Min <-> Aggregate Tok/s Listeners
    var qpsInputEl = document.getElementById('inpPeakQps');
    if (qpsInputEl) {
      qpsInputEl.addEventListener('input', function (e) {
        state.peakQps = Math.max(0.1, parseFloat(e.target.value) || 10);
        state.trafficDriver = 'qps';
        syncTrafficFromQps();
        document.getElementById('inpTpmMillions').value = state.tpmMillions.toFixed(2);
        document.getElementById('inpTargetTokSec').value = state.targetTokSec;
        renderOverview();
        renderCockpit();
      });
    }

    var btnQpsDecode = document.getElementById('btnQpsBasisDecode');
    var btnQpsTotal = document.getElementById('btnQpsBasisTotal');
    if (btnQpsDecode && btnQpsTotal) {
      btnQpsDecode.addEventListener('click', function () {
        state.qpsBasis = 'decode';
        state.trafficDriver = 'qps';
        syncTrafficFromQps();
        syncControlsFromState();
        renderOverview();
        renderCockpit();
      });
      btnQpsTotal.addEventListener('click', function () {
        state.qpsBasis = 'total';
        state.trafficDriver = 'qps';
        syncTrafficFromQps();
        syncControlsFromState();
        renderOverview();
        renderCockpit();
      });
    }

    document.getElementById('inpTpmMillions').addEventListener('input', function (e) {
      state.tpmMillions = Math.max(0.05, parseFloat(e.target.value) || 6.0);
      state.targetTokSec = Math.round((state.tpmMillions * 1e6) / 60.0);
      state.trafficDriver = 'tpm';
      syncQpsFromTargetTokSec();
      document.getElementById('inpTargetTokSec').value = state.targetTokSec;
      var qpsEl = document.getElementById('inpPeakQps');
      if (qpsEl) qpsEl.value = state.peakQps >= 100 ? Math.round(state.peakQps) : Number(state.peakQps.toFixed(2));
      renderOverview();
      renderCockpit();
    });

    document.getElementById('inpTargetTokSec').addEventListener('input', function (e) {
      state.targetTokSec = Math.max(50, parseInt(e.target.value, 10) || 100000);
      state.tpmMillions = (state.targetTokSec * 60.0) / 1e6;
      state.trafficDriver = 'toksec';
      syncQpsFromTargetTokSec();
      document.getElementById('inpTpmMillions').value = state.tpmMillions.toFixed(2);
      var qpsEl = document.getElementById('inpPeakQps');
      if (qpsEl) qpsEl.value = state.peakQps >= 100 ? Math.round(state.peakQps) : Number(state.peakQps.toFixed(2));
      renderOverview();
      renderCockpit();
    });

    document.getElementById('infInputContextLen').addEventListener('input', function (e) {
      state.ctxLen = Math.max(128, parseInt(e.target.value, 10) || 2048);
      if (state.trafficDriver === 'qps') {
        syncTrafficFromQps();
        document.getElementById('inpTpmMillions').value = state.tpmMillions.toFixed(2);
        document.getElementById('inpTargetTokSec').value = state.targetTokSec;
      } else {
        syncQpsFromTargetTokSec();
      }
      renderOverview();
      renderCockpit();
    });

    document.getElementById('infInputOutputLen').addEventListener('input', function (e) {
      state.outLen = Math.max(32, parseInt(e.target.value, 10) || 512);
      if (state.trafficDriver === 'qps') {
        syncTrafficFromQps();
        document.getElementById('inpTpmMillions').value = state.tpmMillions.toFixed(2);
        document.getElementById('inpTargetTokSec').value = state.targetTokSec;
      } else {
        syncQpsFromTargetTokSec();
      }
      renderOverview();
      renderCockpit();
    });

    document.getElementById('btnMethodEmpirical').addEventListener('click', function () {
      state.sizingMethod = 'empirical';
      syncControlsFromState();
      renderOverview();
      renderCockpit();
    });

    document.getElementById('btnMethodRoofline').addEventListener('click', function () {
      state.sizingMethod = 'roofline';
      syncControlsFromState();
      renderOverview();
      renderCockpit();
    });

    document.getElementById('inpEmpiricalTps').addEventListener('input', function (e) {
      state.empiricalTps = parseInt(e.target.value, 10) || 3000;
      renderOverview();
      renderCockpit();
    });

    document.querySelectorAll('.emp-tps-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.empiricalTps = parseInt(btn.getAttribute('data-emp-tps'), 10) || 3000;
        document.getElementById('inpEmpiricalTps').value = state.empiricalTps;
        document.querySelectorAll('.emp-tps-btn').forEach(function (b) {
          var act = parseInt(b.getAttribute('data-emp-tps'), 10) === state.empiricalTps;
          b.className = act
            ? 'emp-tps-btn py-1.5 rounded border border-[#1a73e8] bg-[#e8f0fe] text-[#202124] font-bold'
            : 'emp-tps-btn py-1.5 rounded border border-[#dadce0] bg-white text-[#3c4043] hover:border-[#1a73e8]';
        });
        renderOverview();
        renderCockpit();
      });
    });

    document.getElementById('inpUtilPct').addEventListener('input', function (e) {
      state.utilPct = parseInt(e.target.value, 10) || 80;
      renderOverview();
      renderCockpit();
    });

    document.querySelectorAll('.batch-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.batchSize = parseInt(btn.getAttribute('data-batch'), 10) || 96;
        document.querySelectorAll('.batch-btn').forEach(function (b) {
          var act = parseInt(b.getAttribute('data-batch'), 10) === state.batchSize;
          b.className = act
            ? 'batch-btn py-1.5 rounded-lg border border-[#1a73e8] bg-[#e8f0fe] text-[#202124] font-bold'
            : 'batch-btn py-1.5 rounded-lg border border-[#dadce0] bg-white text-[#5f6368] hover:border-[#1a73e8]';
        });
        renderOverview();
        renderCockpit();
      });
    });

    document.getElementById('infSliderPrefillMfu').addEventListener('input', function (e) {
      state.mfuPct = parseInt(e.target.value, 10) || 50;
      renderCockpit();
    });

    document.getElementById('infSliderDecodeMbu').addEventListener('input', function (e) {
      state.mbuPct = parseInt(e.target.value, 10) || 65;
      renderOverview();
      renderCockpit();
    });

    document.getElementById('inpCustomRate').addEventListener('input', function (e) {
      var val = parseFloat(e.target.value);
      if (!isNaN(val) && val > 0) {
        state.customRate = val;
        renderOverview();
        renderCockpit();
      }
    });

    document.querySelectorAll('.rate-pill-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var r = parseFloat(btn.getAttribute('data-rate'));
        if (!isNaN(r)) {
          state.customRate = r;
          document.getElementById('inpCustomRate').value = r;
          renderOverview();
          renderCockpit();
        }
      });
    });

    // Training Cockpit Events
    document.querySelectorAll('.tr-gpu-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.trGpu = btn.getAttribute('data-tr-gpu');
        document.querySelectorAll('.tr-gpu-btn').forEach(function (b) {
          var act = b.getAttribute('data-tr-gpu') === state.trGpu;
          b.className = act
            ? 'tr-gpu-btn py-2 px-2 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center bg-[#e8f0fe] text-[#202124] border border-[#1a73e8] shadow-xs'
            : 'tr-gpu-btn py-2 px-2 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center bg-white text-[#5f6368] border border-[#dadce0] hover:border-[#1a73e8]';
        });
        renderTrainingCockpit();
      });
    });

    document.getElementById('trInputParamsB').addEventListener('input', function (e) {
      state.trParamsB = Math.max(1, parseFloat(e.target.value) || 70);
      renderTrainingCockpit();
    });

    document.getElementById('trInputTokensT').addEventListener('input', function (e) {
      state.trTokensT = Math.max(0.01, parseFloat(e.target.value) || 2.0);
      renderTrainingCockpit();
    });

    document.getElementById('trSliderNodes').addEventListener('input', function (e) {
      state.trNodes = Math.max(1, parseInt(e.target.value, 10) || 32);
      renderTrainingCockpit();
    });

    document.getElementById('trSliderMfu').addEventListener('input', function (e) {
      state.trMfu = Math.max(15, parseInt(e.target.value, 10) || 45);
      renderTrainingCockpit();
    });

    document.getElementById('btnCopyTerraform').addEventListener('click', function () {
      var code = document.getElementById('trTerraformPre').textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
        var btn = document.getElementById('btnCopyTerraform');
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy Terraform'; }, 1500);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    populateRegionSelects();
    syncQpsFromTargetTokSec();
    syncThemeButtonLabel();
    initEvents();
    syncControlsFromState();
    renderOverview();
    renderRecommender();
    renderCockpit();
    renderTrainingCockpit();
  });
})();
