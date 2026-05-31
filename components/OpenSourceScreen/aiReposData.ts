import { Brain, Bot, MessageSquare, Image, Code2, Eye, Sparkles } from 'lucide-react';

export interface RepoData {
  id: number;
  slug: string;
  name: string;
  full_name: string;
  description: string;
  description_ar?: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  category: string;
  icon: any;
  topics: string[];
  article: {
    title: string;
    readTime: string;
    date: string;
    sections: { heading: string; content: string }[];
  };
  article_ar?: {
    title: string;
    readTime: string;
    date: string;
    sections: { heading: string; content: string }[];
  };
  owner: { avatar_url: string };
}

export const AI_REPOS_DATA: RepoData[] = [
  {
    id: 1, slug: 'transformers', name: 'transformers', full_name: 'huggingface/transformers',
    description: 'State-of-the-art ML for PyTorch, TensorFlow, and JAX. Thousands of pretrained models.',
    stargazers_count: 138000, forks_count: 27700, language: 'Python',
    html_url: 'https://github.com/huggingface/transformers',
    category: 'NLP & Models', icon: Brain, topics: ['nlp', 'deep-learning', 'transformers'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/25720743?v=4' },
    article: { title: 'Hugging Face Transformers: The Swiss Army Knife of AI', readTime: '6 min read', date: 'May 2026', sections: [
      { heading: 'What is Transformers?', content: 'Hugging Face Transformers is the most popular open-source library for working with state-of-the-art machine learning models. It provides thousands of pretrained models for tasks across NLP, Computer Vision, Audio, and Multimodal applications.\n\nWhether you want to classify text, generate images, transcribe speech, or build a chatbot, Transformers has a model ready to go — often requiring just a few lines of code.' },
      { heading: 'How to Use It', content: 'Install it with: pip install transformers\n\nThen run your first pipeline in 3 lines:\nfrom transformers import pipeline\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love open source!")\n\nIt supports 30+ tasks out of the box: text classification, named entity recognition, question answering, translation, summarization, image classification, object detection, speech recognition, and more. Just change the pipeline name.' },
      { heading: 'Why Developers Love It', content: 'The library supports PyTorch, TensorFlow, and JAX. The Hugging Face Hub hosts over 400,000 models — find one for almost any task. Fine-tuning is simple with the Trainer API. Built-in tokenizers are optimized in Rust for blazing speed. ONNX export for production. Quantization for running on edge devices.\n\nThe documentation is excellent and the community is one of the most active in open source.' },
      { heading: 'Real-World Projects You Can Build', content: 'Sentiment analysis dashboard for social media monitoring. Chatbot powered by conversational models. Automatic document summarizer. Multi-language translator. Image captioning system. Voice-to-text transcription app. Resume parser using NER. Code completion assistant using CodeBERT.' },
    ]}
  },
  {
    id: 2, slug: 'langchain', name: 'langchain', full_name: 'langchain-ai/langchain',
    description: 'Build context-aware reasoning applications powered by language models.',
    stargazers_count: 98000, forks_count: 15800, language: 'Python',
    html_url: 'https://github.com/langchain-ai/langchain',
    category: 'LLM Framework', icon: MessageSquare, topics: ['llm', 'agents', 'rag'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/126733545?v=4' },
    article: { title: 'LangChain: Build Powerful LLM Applications', readTime: '7 min read', date: 'May 2026', sections: [
      { heading: 'What is LangChain?', content: 'LangChain is the leading framework for developing applications powered by large language models. It provides a standard interface for chains, agents, and retrieval-augmented generation (RAG).\n\nThink of it as the Express.js of AI development — it gives you building blocks to go from idea to production quickly.' },
      { heading: 'How to Use It', content: 'Install: pip install langchain langchain-openai\n\nBuild a simple Q&A chain:\nfrom langchain_openai import ChatOpenAI\nfrom langchain.prompts import ChatPromptTemplate\nllm = ChatOpenAI(model="gpt-4")\nprompt = ChatPromptTemplate.from_template("Explain {topic} simply")\nchain = prompt | llm\nresult = chain.invoke({"topic": "quantum computing"})\n\nFor RAG, add a vector store and retriever to ground responses in your own data.' },
      { heading: 'Core Concepts', content: 'Chains compose multiple LLM calls into a workflow. Agents let LLMs decide which tools to use. RAG connects your LLM to external knowledge bases. Memory modules maintain context across conversations. Output parsers structure LLM responses into usable formats.\n\nLangChain integrates with 70+ LLM providers, 50+ vector stores, and dozens of tools.' },
      { heading: 'Projects You Can Build', content: 'Customer support bot that knows your docs. Research assistant that searches and cites sources. Code review tool for your codebase. SQL query agent for data analysis. Document Q&A for legal or medical docs. Personal knowledge base assistant.' },
    ]}
  },
  {
    id: 3, slug: 'ollama', name: 'ollama', full_name: 'ollama/ollama',
    description: 'Get up and running with Llama 3, Mistral, Gemma, and other LLMs locally.',
    stargazers_count: 105000, forks_count: 8200, language: 'Go',
    html_url: 'https://github.com/ollama/ollama',
    category: 'Local LLMs', icon: Bot, topics: ['llm', 'local-ai', 'inference'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/151674099?v=4' },
    article: { title: 'Ollama: Run AI Models on Your Own Machine', readTime: '5 min read', date: 'May 2026', sections: [
      { heading: 'What is Ollama?', content: 'Ollama makes it dead simple to run large language models locally. No cloud, no API keys, no data leaving your device. Download, run, and chat with state-of-the-art AI.\n\nSupports Llama 3, Mistral, Gemma, Code Llama, and dozens more — all optimized for consumer hardware.' },
      { heading: 'How to Use It', content: 'Install from ollama.com (one-click installer for Mac/Linux/Windows).\n\nRun a model:\nollama run llama3\n\nThat is it. It downloads the model and starts a chat. Use the REST API for apps:\ncurl http://localhost:11434/api/generate -d \'{"model":"llama3","prompt":"Hello"}\'\n\nThe API is OpenAI-compatible, so existing code works with minimal changes.' },
      { heading: 'Why Run Models Locally?', content: 'Privacy — your data never leaves your machine. Zero API costs and no rate limits. Works offline. Full control over the model. Perfect for prototyping and building without cloud costs.\n\nCreate custom models with Modelfiles — set system prompts, temperature, and other parameters.' },
      { heading: 'Projects You Can Build', content: 'Private coding assistant. Offline chatbot for sensitive data. Local document search. Writing assistant that respects your privacy. Custom AI for specific domains using fine-tuned models.' },
    ]}
  },
  {
    id: 4, slug: 'stable-diffusion-webui', name: 'stable-diffusion-webui', full_name: 'AUTOMATIC1111/stable-diffusion-webui',
    description: 'Stable Diffusion web UI for generating AI art with powerful models.',
    stargazers_count: 145000, forks_count: 27000, language: 'Python',
    html_url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    category: 'Image Generation', icon: Image, topics: ['stable-diffusion', 'ai-art', 'generative-ai'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/33378412?v=4' },
    article: { title: 'Stable Diffusion WebUI: Create Stunning AI Art', readTime: '6 min read', date: 'May 2026', sections: [
      { heading: 'What is It?', content: 'AUTOMATIC1111\'s Stable Diffusion WebUI is the most popular open-source interface for AI image generation. It puts the full power of Stable Diffusion behind an intuitive browser-based UI.\n\nFrom photorealistic portraits to anime art to architectural designs — generate virtually any image you can describe.' },
      { heading: 'How to Use It', content: 'Clone the repo: git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui\nRun: ./webui.sh (handles all dependencies automatically)\nOpen http://localhost:7860 in your browser.\n\nType a prompt like "a cyberpunk city at sunset, neon lights, rain reflections" and hit Generate. Adjust steps, CFG scale, and sampler for different results. Use negative prompts to exclude unwanted elements.' },
      { heading: 'Key Features', content: 'Text-to-image and image-to-image generation. Inpainting to edit specific parts. Outpainting to extend images. ControlNet for pose and composition control. Upscaling and face restoration. Batch processing. Prompt weighting. Hundreds of community extensions.' },
      { heading: 'Projects You Can Build', content: 'Custom avatar generator. Product mockup creator. Game asset pipeline. Social media content generator. Concept art tool for game dev. Pattern and texture generator. Comic book page creator.' },
    ]}
  },
  {
    id: 5, slug: 'open-interpreter', name: 'open-interpreter', full_name: 'OpenInterpreter/open-interpreter',
    description: 'A natural language interface for computers — like ChatGPT Code Interpreter but open source.',
    stargazers_count: 57000, forks_count: 4900, language: 'Python',
    html_url: 'https://github.com/OpenInterpreter/open-interpreter',
    category: 'AI Agents', icon: Code2, topics: ['code-interpreter', 'agent', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/146641368?v=4' },
    article: { title: 'Open Interpreter: Your AI Computer Assistant', readTime: '5 min read', date: 'May 2026', sections: [
      { heading: 'What is It?', content: 'Open Interpreter lets you control your computer using natural language. It runs code (Python, JavaScript, Shell) locally to accomplish tasks.\n\nThink ChatGPT Code Interpreter but local — no file limits, internet access, and full system permissions.' },
      { heading: 'How to Use It', content: 'Install: pip install open-interpreter\nRun: interpreter\n\nThen just type what you want:\n"Create a bar chart of sales data from sales.csv"\n"Find all PDFs over 10MB and compress them"\n"Set up a Flask API with user authentication"\n\nIt writes and runs the code, showing you each step. You approve before execution.' },
      { heading: 'What Can It Do?', content: 'Create and edit photos, videos, PDFs. Browse the web for research. Plot, clean, and analyze datasets. Manage files and run scripts. Build applications from conversation. Install packages and configure tools. The limit is what code can do on your machine.' },
      { heading: 'Projects You Can Build', content: 'Automated report generator. Data pipeline that cleans and visualizes CSVs. Batch file processor. Web scraper with natural language queries. System administration assistant.' },
    ]}
  },
  {
    id: 6, slug: 'comfyui', name: 'ComfyUI', full_name: 'comfyanonymous/ComfyUI',
    description: 'The most powerful modular diffusion model GUI. Design complex AI workflows visually.',
    stargazers_count: 67000, forks_count: 7100, language: 'Python',
    html_url: 'https://github.com/comfyanonymous/ComfyUI',
    category: 'Image Generation', icon: Image, topics: ['comfyui', 'workflow', 'diffusion'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/121283862?v=4' },
    article: { title: 'ComfyUI: Visual AI Workflows for Pros', readTime: '5 min read', date: 'May 2026', sections: [
      { heading: 'What is ComfyUI?', content: 'ComfyUI is a node-based visual interface for Stable Diffusion. Instead of clicking buttons, you build workflows by connecting nodes — giving unparalleled control and reproducibility.\n\nEvery workflow can be saved, shared, and modified. It is the professional choice for AI image generation.' },
      { heading: 'How to Use It', content: 'Clone: git clone https://github.com/comfyanonymous/ComfyUI\nInstall deps: pip install -r requirements.txt\nRun: python main.py\n\nOpen the browser UI, then drag and connect nodes: Load Checkpoint → KSampler → VAE Decode → Save Image. Adjust prompts and parameters per node. Save workflows as JSON to share or reuse.' },
      { heading: 'Why Nodes?', content: 'Visualize exactly what happens at each generation step. Fork workflows to A/B test samplers. Only re-executes changed parts — iterating is near-instant. Supports all major model formats. Much faster and more memory-efficient than alternatives.' },
      { heading: 'Projects You Can Build', content: 'Consistent character generation pipeline. Automated style transfer system. Video generation workflow. Logo design automation. Batch product photo enhancement. Texture generation for 3D assets.' },
    ]}
  },
  {
    id: 7, slug: 'whisper', name: 'whisper', full_name: 'openai/whisper',
    description: 'Robust speech recognition via large-scale weak supervision. 99 languages.',
    stargazers_count: 74000, forks_count: 8700, language: 'Python',
    html_url: 'https://github.com/openai/whisper',
    category: 'Speech & Audio', icon: Eye, topics: ['speech-recognition', 'transcription', 'audio'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/14957082?v=4' },
    article: { title: 'OpenAI Whisper: Speech Recognition That Works', readTime: '5 min read', date: 'May 2026', sections: [
      { heading: 'What is Whisper?', content: 'Whisper is OpenAI\'s open-source speech recognition model achieving near-human accuracy across 99 languages. Trained on 680,000 hours of audio, it handles accents, noise, and technical jargon remarkably well.\n\nRuns entirely on your machine — perfect for privacy-sensitive applications.' },
      { heading: 'How to Use It', content: 'Install: pip install openai-whisper\n\nTranscribe an audio file:\nimport whisper\nmodel = whisper.load_model("base")\nresult = model.transcribe("audio.mp3")\nprint(result["text"])\n\nFor CLI: whisper audio.mp3 --model base --language en\n\nChoose from tiny/base/small/medium/large models based on speed vs accuracy needs.' },
      { heading: 'Capabilities', content: 'Multilingual recognition in 99 languages. Speech-to-English translation. Language detection. Timestamp generation for subtitles. Handles multiple speakers, background music, and noise gracefully. All models run offline on consumer hardware.' },
      { heading: 'Projects You Can Build', content: 'Podcast transcription service. Real-time captioning tool. Meeting notes automation. Voice-controlled application. Accessibility tool for hearing-impaired. Video subtitle generator. Audio content search engine.' },
    ]}
  },
  {
    id: 8, slug: 'autogpt', name: 'AutoGPT', full_name: 'Significant-Gravitas/AutoGPT',
    description: 'Build, test, and delegate autonomous AI agents.',
    stargazers_count: 170000, forks_count: 44000, language: 'Python',
    html_url: 'https://github.com/Significant-Gravitas/AutoGPT',
    category: 'AI Agents', icon: Sparkles, topics: ['autogpt', 'autonomous-agents', 'gpt-4'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/130738209?v=4' },
    article: { title: 'AutoGPT: Autonomous AI Agents', readTime: '6 min read', date: 'May 2026', sections: [
      { heading: 'What is AutoGPT?', content: 'AutoGPT pioneered autonomous AI agents — systems that break down goals into tasks, execute them, and iterate without constant guidance. Give it a goal, it figures out the steps.\n\nIt showed LLMs could be more than chatbots — they could browse the web, write code, manage files, and call APIs autonomously.' },
      { heading: 'How to Use It', content: 'Clone: git clone https://github.com/Significant-Gravitas/AutoGPT\nSetup: cp .env.template .env (add your API keys)\nRun: docker compose up\n\nAccess the frontend, create an agent, and give it a goal like "Research the top 5 competitors in the AI coding assistant space and create a comparison report." Watch it work.' },
      { heading: 'How It Works', content: 'AutoGPT uses a think → plan → act → reflect loop. It receives a goal, breaks it into sub-tasks, executes each using tools (web, code, files, APIs), evaluates results, and adjusts. Each action is logged for transparency.\n\nThe Forge framework lets you build custom agents. The Benchmark suite tests agent performance on standardized tasks.' },
      { heading: 'Projects You Can Build', content: 'Market research agent. Content creation and curation bot. Automated code review pipeline. Data collection and analysis workflow. Personal assistant for scheduling and emails. Competitive analysis tool.' },
    ]}
  },
  {
    id: 9, slug: 'llama-cpp', name: 'llama.cpp', full_name: 'ggerganov/llama.cpp',
    description: 'LLM inference in C/C++. Run large language models on consumer hardware.',
    stargazers_count: 72000, forks_count: 10400, language: 'C++',
    html_url: 'https://github.com/ggerganov/llama.cpp',
    category: 'Local LLMs', icon: Bot, topics: ['llama', 'inference', 'cpp'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/1991296?v=4' },
    article: { title: 'llama.cpp: The Engine Behind Local AI', readTime: '6 min read', date: 'May 2026', sections: [
      { heading: 'What is llama.cpp?', content: 'llama.cpp is a high-performance C/C++ implementation for LLM inference. It is the backbone of Ollama, LM Studio, and most local AI tools.\n\nCreated by Georgi Gerganov, it makes running Llama, Mistral, and Phi on laptops and even phones possible.' },
      { heading: 'How to Use It', content: 'Build from source:\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp && make\n\nDownload a GGUF model from Hugging Face, then run:\n./main -m model.gguf -p "Explain quantum computing" -n 256\n\nFor a chat interface: ./main -m model.gguf --interactive --chat-template llama3\nFor a server: ./server -m model.gguf --port 8080 (OpenAI-compatible API)' },
      { heading: 'Quantization Magic', content: 'The killer feature is quantization — reducing 16-bit to 4-bit integers. This shrinks models 4x while keeping 95%+ quality. A 70B model needing 140GB runs in under 40GB with Q4.\n\nMultiple methods (Q4_0, Q4_K_M, Q5_K_M, Q8_0) let you tune the speed/quality tradeoff. Runs on x86, ARM, Apple Silicon, CUDA, ROCm, and even WebAssembly.' },
      { heading: 'Projects You Can Build', content: 'Build your own Ollama-like tool. Embed AI in desktop apps without cloud. Create a local coding copilot. Run AI on Raspberry Pi or mobile. Build privacy-first AI products. Integrate LLMs into C/C++ applications directly.' },
    ]}
  },
];
