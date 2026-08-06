import { Brain, Bot, MessageSquare, Image, Code2, Eye } from 'lucide-react';

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
    description_ar: 'تعلم آلي متقدم لـ PyTorch و TensorFlow و JAX. آلاف النماذج المدربة مسبقاً.',
    stargazers_count: 138000, forks_count: 27700, language: 'Python',
    html_url: 'https://github.com/huggingface/transformers',
    category: 'NLP & Models', icon: Brain, topics: ['nlp', 'deep-learning', 'transformers'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/25720743?v=4' },
    article: { title: 'Hugging Face Transformers: The Swiss Army Knife of AI', readTime: '6 min read', date: 'May', sections: [
      { heading: 'What is Transformers?', content: 'Hugging Face Transformers is the most popular open-source library for working with state-of-the-art machine learning models. It provides thousands of pretrained models for tasks across NLP, Computer Vision, Audio, and Multimodal applications.\n\nWhether you want to classify text, generate images, transcribe speech, or build a chatbot, Transformers has a model ready to go — often requiring just a few lines of code.' },
      { heading: 'How to Use It', content: 'Install it with: pip install transformers\n\nThen run your first pipeline in 3 lines:\nfrom transformers import pipeline\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love open source!")\n\nIt supports 30+ tasks out of the box: text classification, named entity recognition, question answering, translation, summarization, image classification, object detection, speech recognition, and more. Just change the pipeline name.' },
      { heading: 'Why Developers Love It', content: 'The library supports PyTorch, TensorFlow, and JAX. The Hugging Face Hub hosts over 400,000 models — find one for almost any task. Fine-tuning is simple with the Trainer API. Built-in tokenizers are optimized in Rust for blazing speed. ONNX export for production. Quantization for running on edge devices.\n\nThe documentation is excellent and the community is one of the most active in open source.' },
      { heading: 'Real-World Projects You Can Build', content: 'Sentiment analysis dashboard for social media monitoring. Chatbot powered by conversational models. Automatic document summarizer. Multi-language translator. Image captioning system. Voice-to-text transcription app. Resume parser using NER. Code completion assistant using CodeBERT.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: Hugging Face Transformers', readTime: '٦ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو Transformers؟', content: 'Hugging Face Transformers هي المكتبة الأكثر شعبية مفتوحة المصدر للعمل مع نماذج التعلم الآلي المتقدمة. توفر آلاف النماذج المدربة مسبقاً لمهام معالجة اللغات الطبيعية والرؤية الحاسوبية والصوت والتطبيقات متعددة الوسائط.\n\nسواء كنت تريد تصنيف النصوص أو توليد الصور أو تحويل الكلام لنص أو بناء روبوت محادثة، لدى Transformers نموذج جاهز — غالباً بأسطر قليلة من الكود.' },
      { heading: 'كيفية الاستخدام', content: 'ثبّتها بـ: pip install transformers\n\nثم شغّل أول خط أنابيب في ٣ أسطر:\nfrom transformers import pipeline\nclassifier = pipeline("sentiment-analysis")\nresult = classifier("I love open source!")\n\nتدعم أكثر من ٣٠ مهمة: تصنيف النصوص، التعرف على الكيانات، الإجابة على الأسئلة، الترجمة، التلخيص، تصنيف الصور، اكتشاف الأشياء، والتعرف على الكلام.' },
      { heading: 'لماذا يحبها المطورون', content: 'تدعم PyTorch و TensorFlow و JAX. يستضيف Hugging Face Hub أكثر من ٤٠٠,٠٠٠ نموذج. الضبط الدقيق بسيط مع Trainer API. المحللات النصية محسّنة بلغة Rust للسرعة الفائقة. تصدير ONNX للإنتاج. تقليل الحجم للتشغيل على الأجهزة الطرفية.\n\nالتوثيق ممتاز والمجتمع من أكثر المجتمعات نشاطاً في المصدر المفتوح.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'لوحة تحليل المشاعر لمراقبة وسائل التواصل. روبوت محادثة مدعوم بنماذج المحادثة. ملخص مستندات تلقائي. مترجم متعدد اللغات. نظام وصف الصور. تطبيق تحويل الصوت لنص. محلل السير الذاتية. مساعد إكمال الكود.' },
    ]}
  },
  {
    id: 2, slug: 'langchain', name: 'langchain', full_name: 'langchain-ai/langchain',
    description: 'Build context-aware reasoning applications powered by language models.',
    description_ar: 'بناء تطبيقات استدلال واعية للسياق مدعومة بنماذج اللغة.',
    stargazers_count: 98000, forks_count: 15800, language: 'Python',
    html_url: 'https://github.com/langchain-ai/langchain',
    category: 'LLM Framework', icon: MessageSquare, topics: ['llm', 'agents', 'rag'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/126733545?v=4' },
    article: { title: 'LangChain: Build Powerful LLM Applications', readTime: '7 min read', date: 'May', sections: [
      { heading: 'What is LangChain?', content: 'LangChain is the leading framework for developing applications powered by large language models. It provides a standard interface for chains, agents, and retrieval-augmented generation (RAG).\n\nThink of it as the Express.js of AI development — it gives you building blocks to go from idea to production quickly.' },
      { heading: 'How to Use It', content: 'Install: pip install langchain langchain-openai\n\nBuild a simple Q&A chain:\nfrom langchain_openai import ChatOpenAI\nfrom langchain.prompts import ChatPromptTemplate\nllm = ChatOpenAI(model="gpt-4")\nprompt = ChatPromptTemplate.from_template("Explain {topic} simply")\nchain = prompt | llm\nresult = chain.invoke({"topic": "quantum computing"})\n\nFor RAG, add a vector store and retriever to ground responses in your own data.' },
      { heading: 'Core Concepts', content: 'Chains compose multiple LLM calls into a workflow. Agents let LLMs decide which tools to use. RAG connects your LLM to external knowledge bases. Memory modules maintain context across conversations. Output parsers structure LLM responses into usable formats.\n\nLangChain integrates with 70+ LLM providers, 50+ vector stores, and dozens of tools.' },
      { heading: 'Projects You Can Build', content: 'Customer support bot that knows your docs. Research assistant that searches and cites sources. Code review tool for your codebase. SQL query agent for data analysis. Document Q&A for legal or medical docs. Personal knowledge base assistant.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: LangChain لتطبيقات الذكاء الاصطناعي', readTime: '٧ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو LangChain؟', content: 'LangChain هو الإطار الرائد لتطوير التطبيقات المدعومة بنماذج اللغة الكبيرة. يوفر واجهة موحدة للسلاسل والوكلاء وتوليد النصوص المعزز بالاسترجاع (RAG).\n\nفكر فيه كـ Express.js لتطوير الذكاء الاصطناعي — يعطيك لبنات البناء للانتقال من الفكرة للإنتاج بسرعة.' },
      { heading: 'كيفية الاستخدام', content: 'ثبّت: pip install langchain langchain-openai\n\nابنِ سلسلة أسئلة وأجوبة بسيطة:\nfrom langchain_openai import ChatOpenAI\nllm = ChatOpenAI(model="gpt-4")\n\nلـ RAG، أضف مخزن متجهات ومسترجع لربط الردود ببياناتك الخاصة.' },
      { heading: 'المفاهيم الأساسية', content: 'السلاسل تجمع عدة استدعاءات LLM في سير عمل. الوكلاء يسمحون لـ LLM باختيار الأدوات. RAG يربط LLM بقواعد المعرفة الخارجية. وحدات الذاكرة تحافظ على السياق عبر المحادثات.\n\nLangChain يتكامل مع أكثر من ٧٠ مزود LLM و ٥٠ مخزن متجهات وعشرات الأدوات.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'روبوت دعم عملاء يعرف مستنداتك. مساعد بحث يبحث ويستشهد بالمصادر. أداة مراجعة كود. وكيل استعلام SQL لتحليل البيانات. أسئلة وأجوبة للمستندات القانونية أو الطبية.' },
    ]}
  },
  {
    id: 3, slug: 'ollama', name: 'ollama', full_name: 'ollama/ollama',
    description: 'Get up and running with Llama 3, Mistral, Gemma, and other LLMs locally.',
    description_ar: 'شغّل Llama 3 و Mistral و Gemma ونماذج LLM أخرى محلياً على جهازك.',
    stargazers_count: 105000, forks_count: 8200, language: 'Go',
    html_url: 'https://github.com/ollama/ollama',
    category: 'Local LLMs', icon: Bot, topics: ['llm', 'local-ai', 'inference'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/151674099?v=4' },
    article: { title: 'Ollama: Run AI Models on Your Own Machine', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is Ollama?', content: 'Ollama makes it dead simple to run large language models locally. No cloud, no API keys, no data leaving your device. Download, run, and chat with state-of-the-art AI.\n\nSupports Llama 3, Mistral, Gemma, Code Llama, and dozens more — all optimized for consumer hardware.' },
      { heading: 'How to Use It', content: 'Install from ollama.com (one-click installer for Mac/Linux/Windows).\n\nRun a model:\nollama run llama3\n\nThat is it. It downloads the model and starts a chat. Use the REST API for apps:\ncurl http://localhost:11434/api/generate -d \'{"model":"llama3","prompt":"Hello"}\'\n\nThe API is OpenAI-compatible, so existing code works with minimal changes.' },
      { heading: 'Why Run Models Locally?', content: 'Privacy — your data never leaves your machine. Zero API costs and no rate limits. Works offline. Full control over the model. Perfect for prototyping and building without cloud costs.\n\nCreate custom models with Modelfiles — set system prompts, temperature, and other parameters.' },
      { heading: 'Projects You Can Build', content: 'Private coding assistant. Offline chatbot for sensitive data. Local document search. Writing assistant that respects your privacy. Custom AI for specific domains using fine-tuned models.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: Ollama — شغّل الذكاء الاصطناعي محلياً', readTime: '٥ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو Ollama؟', content: 'Ollama يجعل تشغيل نماذج اللغة الكبيرة محلياً بسيطاً جداً. بدون سحابة، بدون مفاتيح API، بدون خروج بياناتك من جهازك.\n\nيدعم Llama 3 و Mistral و Gemma و Code Llama وعشرات أخرى — كلها محسّنة للأجهزة الشخصية.' },
      { heading: 'كيفية الاستخدام', content: 'ثبّت من ollama.com (مثبّت بنقرة واحدة).\n\nشغّل نموذجاً:\nollama run llama3\n\nهذا كل شيء. يحمّل النموذج ويبدأ المحادثة. استخدم واجهة REST API للتطبيقات. الواجهة متوافقة مع OpenAI.' },
      { heading: 'لماذا تشغيل النماذج محلياً؟', content: 'الخصوصية — بياناتك لا تغادر جهازك أبداً. تكلفة صفر ولا حدود للاستخدام. يعمل بدون إنترنت. تحكم كامل بالنموذج. مثالي للنماذج الأولية والبناء بدون تكاليف السحابة.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'مساعد برمجة خاص. روبوت محادثة للبيانات الحساسة. بحث محلي في المستندات. مساعد كتابة يحترم خصوصيتك. ذكاء اصطناعي مخصص لمجالات محددة.' },
    ]}
  },
  {
    id: 4, slug: 'stable-diffusion-webui', name: 'stable-diffusion-webui', full_name: 'AUTOMATIC1111/stable-diffusion-webui',
    description: 'Stable Diffusion web UI for generating AI art with powerful models.',
    description_ar: 'واجهة ويب لـ Stable Diffusion لتوليد فن الذكاء الاصطناعي بنماذج قوية.',
    stargazers_count: 145000, forks_count: 27000, language: 'Python',
    html_url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    category: 'Image Generation', icon: Image, topics: ['stable-diffusion', 'ai-art', 'generative-ai'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/33378412?v=4' },
    article: { title: 'Stable Diffusion WebUI: Create Stunning AI Art', readTime: '6 min read', date: 'May', sections: [
      { heading: 'What is It?', content: 'AUTOMATIC1111\'s Stable Diffusion WebUI is the most popular open-source interface for AI image generation. It puts the full power of Stable Diffusion behind an intuitive browser-based UI.\n\nFrom photorealistic portraits to anime art to architectural designs — generate virtually any image you can describe.' },
      { heading: 'How to Use It', content: 'Clone the repo: git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui\nRun: ./webui.sh (handles all dependencies automatically)\nOpen http://localhost:7860 in your browser.\n\nType a prompt like "a cyberpunk city at sunset, neon lights, rain reflections" and hit Generate. Adjust steps, CFG scale, and sampler for different results. Use negative prompts to exclude unwanted elements.' },
      { heading: 'Key Features', content: 'Text-to-image and image-to-image generation. Inpainting to edit specific parts. Outpainting to extend images. ControlNet for pose and composition control. Upscaling and face restoration. Batch processing. Prompt weighting. Hundreds of community extensions.' },
      { heading: 'Projects You Can Build', content: 'Custom avatar generator. Product mockup creator. Game asset pipeline. Social media content generator. Concept art tool for game dev. Pattern and texture generator. Comic book page creator.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: Stable Diffusion — إنشاء فن بالذكاء الاصطناعي', readTime: '٦ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو؟', content: 'واجهة Stable Diffusion WebUI هي الواجهة مفتوحة المصدر الأكثر شعبية لتوليد الصور بالذكاء الاصطناعي. تضع القوة الكاملة لـ Stable Diffusion خلف واجهة متصفح بديهية.\n\nمن الصور الواقعية إلى فن الأنمي إلى التصاميم المعمارية — ولّد أي صورة يمكنك وصفها.' },
      { heading: 'كيفية الاستخدام', content: 'انسخ المستودع وشغّله. افتح المتصفح واكتب وصفاً مثل "مدينة سايبربانك عند الغروب" واضغط توليد. عدّل الخطوات والمعاملات للحصول على نتائج مختلفة.' },
      { heading: 'الميزات الرئيسية', content: 'توليد من نص لصورة ومن صورة لصورة. الرسم الداخلي لتعديل أجزاء محددة. توسيع الصور. ControlNet للتحكم بالوضعية والتكوين. تحسين الدقة وترميم الوجوه. المعالجة الجماعية. مئات الإضافات المجتمعية.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'مولّد صور رمزية مخصصة. منشئ نماذج أولية للمنتجات. خط إنتاج أصول الألعاب. مولّد محتوى وسائل التواصل. أداة فن مفاهيمي. مولّد أنماط وقوام.' },
    ]}
  },
  {
    id: 5, slug: 'open-interpreter', name: 'open-interpreter', full_name: 'OpenInterpreter/open-interpreter',
    description: 'A natural language interface for computers — like ChatGPT Code Interpreter but open source.',
    description_ar: 'واجهة لغة طبيعية للحواسيب — مثل ChatGPT Code Interpreter لكن مفتوح المصدر.',
    stargazers_count: 57000, forks_count: 4900, language: 'Python',
    html_url: 'https://github.com/OpenInterpreter/open-interpreter',
    category: 'AI Agents', icon: Code2, topics: ['code-interpreter', 'agent', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/146641368?v=4' },
    article: { title: 'Open Interpreter: Your AI Computer Assistant', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is It?', content: 'Open Interpreter lets you control your computer using natural language. It runs code (Python, JavaScript, Shell) locally to accomplish tasks.\n\nThink ChatGPT Code Interpreter but local — no file limits, internet access, and full system permissions.' },
      { heading: 'How to Use It', content: 'Install: pip install open-interpreter\nRun: interpreter\n\nThen just type what you want:\n"Create a bar chart of sales data from sales.csv"\n"Find all PDFs over 10MB and compress them"\n"Set up a Flask API with user authentication"\n\nIt writes and runs the code, showing you each step. You approve before execution.' },
      { heading: 'What Can It Do?', content: 'Create and edit photos, videos, PDFs. Browse the web for research. Plot, clean, and analyze datasets. Manage files and run scripts. Build applications from conversation. Install packages and configure tools. The limit is what code can do on your machine.' },
      { heading: 'Projects You Can Build', content: 'Automated report generator. Data pipeline that cleans and visualizes CSVs. Batch file processor. Web scraper with natural language queries. System administration assistant.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: Open Interpreter — مساعدك الذكي للحاسوب', readTime: '٥ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو؟', content: 'Open Interpreter يتيح لك التحكم بحاسوبك باستخدام اللغة الطبيعية. يشغّل كود Python و JavaScript و Shell محلياً لإنجاز المهام.\n\nفكر فيه كـ ChatGPT Code Interpreter لكن محلي — بدون حدود للملفات، مع وصول للإنترنت وصلاحيات النظام الكاملة.' },
      { heading: 'كيفية الاستخدام', content: 'ثبّت: pip install open-interpreter\nشغّل: interpreter\n\nثم اكتب ما تريد:\n"أنشئ رسماً بيانياً من بيانات المبيعات"\n"اعثر على كل ملفات PDF أكبر من 10MB واضغطها"\n\nيكتب الكود ويشغّله، يعرض لك كل خطوة. أنت توافق قبل التنفيذ.' },
      { heading: 'ماذا يمكنه فعله؟', content: 'إنشاء وتعديل الصور والفيديو وPDF. تصفح الويب للبحث. رسم وتنظيف وتحليل البيانات. إدارة الملفات وتشغيل السكربتات. بناء التطبيقات من المحادثة.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'مولّد تقارير آلي. خط بيانات ينظف ويعرض CSVs. معالج ملفات جماعي. مستخرج بيانات من الويب. مساعد إدارة النظام.' },
    ]}
  },
  {
    id: 6, slug: 'comfyui', name: 'ComfyUI', full_name: 'comfyanonymous/ComfyUI',
    description: 'The most powerful modular diffusion model GUI. Design complex AI workflows visually.',
    description_ar: 'أقوى واجهة رسومية معيارية لنماذج الانتشار. صمم سير عمل ذكاء اصطناعي معقدة بصرياً.',
    stargazers_count: 67000, forks_count: 7100, language: 'Python',
    html_url: 'https://github.com/comfyanonymous/ComfyUI',
    category: 'Image Generation', icon: Image, topics: ['comfyui', 'workflow', 'diffusion'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/121283862?v=4' },
    article: { title: 'ComfyUI: Visual AI Workflows for Pros', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is ComfyUI?', content: 'ComfyUI is a node-based visual interface for Stable Diffusion. Instead of clicking buttons, you build workflows by connecting nodes — giving unparalleled control and reproducibility.\n\nEvery workflow can be saved, shared, and modified. It is the professional choice for AI image generation.' },
      { heading: 'How to Use It', content: 'Clone: git clone https://github.com/comfyanonymous/ComfyUI\nInstall deps: pip install -r requirements.txt\nRun: python main.py\n\nOpen the browser UI, then drag and connect nodes: Load Checkpoint → KSampler → VAE Decode → Save Image. Adjust prompts and parameters per node. Save workflows as JSON to share or reuse.' },
      { heading: 'Why Nodes?', content: 'Visualize exactly what happens at each generation step. Fork workflows to A/B test samplers. Only re-executes changed parts — iterating is near-instant. Supports all major model formats. Much faster and more memory-efficient than alternatives.' },
      { heading: 'Projects You Can Build', content: 'Consistent character generation pipeline. Automated style transfer system. Video generation workflow. Logo design automation. Batch product photo enhancement. Texture generation for 3D assets.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: ComfyUI — سير عمل الذكاء الاصطناعي البصري', readTime: '٥ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو ComfyUI؟', content: 'ComfyUI هو واجهة بصرية قائمة على العقد لـ Stable Diffusion. بدلاً من النقر على الأزرار، تبني سير العمل بربط العقد — مما يمنح تحكماً وإعادة إنتاج لا مثيل لهما.\n\nكل سير عمل يمكن حفظه ومشاركته وتعديله. إنه الخيار المهني لتوليد الصور بالذكاء الاصطناعي.' },
      { heading: 'كيفية الاستخدام', content: 'انسخ المستودع وثبّت المتطلبات وشغّل python main.py.\n\nافتح واجهة المتصفح، ثم اسحب وربط العقد. احفظ سير العمل كـ JSON للمشاركة أو إعادة الاستخدام.' },
      { heading: 'لماذا العقد؟', content: 'تصور بالضبط ما يحدث في كل خطوة توليد. تفريع سير العمل لاختبار A/B. يعيد تنفيذ الأجزاء المتغيرة فقط. يدعم جميع صيغ النماذج الرئيسية. أسرع وأكفأ في الذاكرة.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'خط إنتاج شخصيات متسقة. نظام نقل أنماط آلي. سير عمل توليد فيديو. أتمتة تصميم الشعارات. تحسين صور المنتجات الجماعي.' },
    ]}
  },
  {
    id: 7, slug: 'whisper', name: 'whisper', full_name: 'openai/whisper',
    description: 'Robust speech recognition via large-scale weak supervision. 99 languages.',
    description_ar: 'التعرف على الكلام بدقة عالية عبر الإشراف الضعيف واسع النطاق. ٩٩ لغة.',
    stargazers_count: 74000, forks_count: 8700, language: 'Python',
    html_url: 'https://github.com/openai/whisper',
    category: 'Speech & Audio', icon: Eye, topics: ['speech-recognition', 'transcription', 'audio'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/14957082?v=4' },
    article: { title: 'OpenAI Whisper: Speech Recognition That Works', readTime: '5 min read', date: 'May', sections: [
      { heading: 'What is Whisper?', content: 'Whisper is OpenAI\'s open-source speech recognition model achieving near-human accuracy across 99 languages. Trained on 680,000 hours of audio, it handles accents, noise, and technical jargon remarkably well.\n\nRuns entirely on your machine — perfect for privacy-sensitive applications.' },
      { heading: 'How to Use It', content: 'Install: pip install openai-whisper\n\nTranscribe an audio file:\nimport whisper\nmodel = whisper.load_model("base")\nresult = model.transcribe("audio.mp3")\nprint(result["text"])\n\nFor CLI: whisper audio.mp3 --model base --language en\n\nChoose from tiny/base/small/medium/large models based on speed vs accuracy needs.' },
      { heading: 'Capabilities', content: 'Multilingual recognition in 99 languages. Speech-to-English translation. Language detection. Timestamp generation for subtitles. Handles multiple speakers, background music, and noise gracefully. All models run offline on consumer hardware.' },
      { heading: 'Projects You Can Build', content: 'Podcast transcription service. Real-time captioning tool. Meeting notes automation. Voice-controlled application. Accessibility tool for hearing-impaired. Video subtitle generator. Audio content search engine.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: Whisper — التعرف على الكلام الذي يعمل فعلاً', readTime: '٥ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو Whisper؟', content: 'Whisper هو نموذج التعرف على الكلام مفتوح المصدر من OpenAI بدقة قريبة من البشر عبر ٩٩ لغة. مدرّب على ٦٨٠,٠٠٠ ساعة صوتية، يتعامل مع اللهجات والضوضاء والمصطلحات التقنية بشكل ممتاز.\n\nيعمل بالكامل على جهازك — مثالي للتطبيقات الحساسة للخصوصية.' },
      { heading: 'كيفية الاستخدام', content: 'ثبّت: pip install openai-whisper\n\nحوّل ملف صوتي لنص:\nimport whisper\nmodel = whisper.load_model("base")\nresult = model.transcribe("audio.mp3")\n\nاختر من نماذج tiny/base/small/medium/large حسب حاجتك للسرعة مقابل الدقة.' },
      { heading: 'القدرات', content: 'التعرف متعدد اللغات في ٩٩ لغة. ترجمة الكلام للإنجليزية. اكتشاف اللغة. توليد طوابع زمنية للترجمة. يتعامل مع متحدثين متعددين وموسيقى خلفية وضوضاء. كل النماذج تعمل بدون إنترنت.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'خدمة تفريغ البودكاست. أداة ترجمة فورية. أتمتة تدوين الاجتماعات. تطبيق يُتحكم به صوتياً. أداة وصول لضعاف السمع. مولّد ترجمات الفيديو. محرك بحث محتوى صوتي.' },
    ]}
  },
  {
    id: 8, slug: 'autogpt', name: 'AutoGPT', full_name: 'Significant-Gravitas/AutoGPT',
    description: 'Build, test, and delegate autonomous AI agents.',
    description_ar: 'بناء واختبار وتفويض وكلاء ذكاء اصطناعي مستقلين.',
    stargazers_count: 170000, forks_count: 44000, language: 'Python',
    html_url: 'https://github.com/Significant-Gravitas/AutoGPT',
    category: 'AI Agents', icon: Bot, topics: ['autogpt', 'autonomous-agents', 'gpt-4'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/130738209?v=4' },
    article: { title: 'AutoGPT: Autonomous AI Agents', readTime: '6 min read', date: 'May', sections: [
      { heading: 'What is AutoGPT?', content: 'AutoGPT pioneered autonomous AI agents — systems that break down goals into tasks, execute them, and iterate without constant guidance. Give it a goal, it figures out the steps.\n\nIt showed LLMs could be more than chatbots — they could browse the web, write code, manage files, and call APIs autonomously.' },
      { heading: 'How to Use It', content: 'Clone: git clone https://github.com/Significant-Gravitas/AutoGPT\nSetup: cp .env.template .env (add your API keys)\nRun: docker compose up\n\nAccess the frontend, create an agent, and give it a goal like "Research the top 5 competitors in the AI coding assistant space and create a comparison report." Watch it work.' },
      { heading: 'How It Works', content: 'AutoGPT uses a think → plan → act → reflect loop. It receives a goal, breaks it into sub-tasks, executes each using tools (web, code, files, APIs), evaluates results, and adjusts. Each action is logged for transparency.\n\nThe Forge framework lets you build custom agents. The Benchmark suite tests agent performance on standardized tasks.' },
      { heading: 'Projects You Can Build', content: 'Market research agent. Content creation and curation bot. Automated code review pipeline. Data collection and analysis workflow. Personal assistant for scheduling and emails. Competitive analysis tool.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: AutoGPT — وكلاء ذكاء اصطناعي مستقلون', readTime: '٦ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو AutoGPT؟', content: 'AutoGPT رائد وكلاء الذكاء الاصطناعي المستقلين — أنظمة تقسّم الأهداف لمهام وتنفذها وتكرر بدون توجيه مستمر. أعطه هدفاً، يكتشف الخطوات بنفسه.\n\nأظهر أن نماذج اللغة يمكن أن تكون أكثر من روبوتات محادثة — يمكنها تصفح الويب وكتابة الكود وإدارة الملفات واستدعاء واجهات برمجة التطبيقات بشكل مستقل.' },
      { heading: 'كيفية الاستخدام', content: 'انسخ المستودع، أضف مفاتيح API، وشغّل بـ Docker.\n\nأنشئ وكيلاً وأعطه هدفاً مثل "ابحث عن أفضل ٥ منافسين في مجال مساعدات البرمجة بالذكاء الاصطناعي وأنشئ تقريراً مقارناً." وراقبه يعمل.' },
      { heading: 'كيف يعمل', content: 'يستخدم AutoGPT حلقة فكّر → خطط → نفّذ → راجع. يستقبل هدفاً، يقسمه لمهام فرعية، ينفذ كل منها باستخدام الأدوات، يقيّم النتائج، ويعدّل. كل إجراء مسجّل للشفافية.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'وكيل بحث السوق. روبوت إنشاء وتنسيق المحتوى. خط مراجعة كود آلي. سير عمل جمع وتحليل البيانات. مساعد شخصي للجدولة والبريد. أداة تحليل المنافسين.' },
    ]}
  },
  {
    id: 9, slug: 'llama-cpp', name: 'llama.cpp', full_name: 'ggerganov/llama.cpp',
    description: 'LLM inference in C/C++. Run large language models on consumer hardware.',
    description_ar: 'استدلال نماذج اللغة الكبيرة بـ C/C++. شغّل النماذج على أجهزة المستهلكين.',
    stargazers_count: 72000, forks_count: 10400, language: 'C++',
    html_url: 'https://github.com/ggerganov/llama.cpp',
    category: 'Local LLMs', icon: Bot, topics: ['llama', 'inference', 'cpp'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/1991296?v=4' },
    article: { title: 'llama.cpp: The Engine Behind Local AI', readTime: '6 min read', date: 'May', sections: [
      { heading: 'What is llama.cpp?', content: 'llama.cpp is a high-performance C/C++ implementation for LLM inference. It is the backbone of Ollama, LM Studio, and most local AI tools.\n\nCreated by Georgi Gerganov, it makes running Llama, Mistral, and Phi on laptops and even phones possible.' },
      { heading: 'How to Use It', content: 'Build from source:\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp && make\n\nDownload a GGUF model from Hugging Face, then run:\n./main -m model.gguf -p "Explain quantum computing" -n 256\n\nFor a chat interface: ./main -m model.gguf --interactive --chat-template llama3\nFor a server: ./server -m model.gguf --port 8080 (OpenAI-compatible API)' },
      { heading: 'Quantization Magic', content: 'The killer feature is quantization — reducing 16-bit to 4-bit integers. This shrinks models 4x while keeping 95%+ quality. A 70B model needing 140GB runs in under 40GB with Q4.\n\nMultiple methods (Q4_0, Q4_K_M, Q5_K_M, Q8_0) let you tune the speed/quality tradeoff. Runs on x86, ARM, Apple Silicon, CUDA, ROCm, and even WebAssembly.' },
      { heading: 'Projects You Can Build', content: 'Build your own Ollama-like tool. Embed AI in desktop apps without cloud. Create a local coding copilot. Run AI on Raspberry Pi or mobile. Build privacy-first AI products. Integrate LLMs into C/C++ applications directly.' },
    ]},
    article_ar: { title: 'دليل المبتدئين: llama.cpp — المحرك وراء الذكاء الاصطناعي المحلي', readTime: '٦ دقائق قراءة', date: 'مايو ٢٠٢٦', sections: [
      { heading: 'ما هو llama.cpp؟', content: 'llama.cpp هو تطبيق عالي الأداء بلغة C/C++ لاستدلال نماذج اللغة الكبيرة. هو العمود الفقري لـ Ollama و LM Studio ومعظم أدوات الذكاء الاصطناعي المحلية.\n\nيجعل تشغيل Llama و Mistral و Phi على الحواسيب المحمولة وحتى الهواتف ممكناً.' },
      { heading: 'كيفية الاستخدام', content: 'ابنِ من المصدر:\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp && make\n\nحمّل نموذج GGUF من Hugging Face ثم شغّل. لواجهة المحادثة أو الخادم، استخدم الأوامر المناسبة مع واجهة متوافقة مع OpenAI.' },
      { heading: 'سحر التكميم', content: 'الميزة القاتلة هي التكميم — تقليل من ١٦ بت إلى ٤ بت. هذا يصغّر النماذج ٤ مرات مع الحفاظ على ٩٥%+ من الجودة. نموذج ٧٠B يحتاج ١٤٠GB يعمل في أقل من ٤٠GB مع Q4.\n\nيعمل على x86 و ARM و Apple Silicon و CUDA و WebAssembly.' },
      { heading: 'مشاريع يمكنك بناؤها', content: 'بناء أداة شبيهة بـ Ollama. دمج الذكاء الاصطناعي في تطبيقات سطح المكتب. إنشاء مساعد برمجة محلي. تشغيل الذكاء الاصطناعي على Raspberry Pi. بناء منتجات تحترم الخصوصية.' },
    ]}
  },
];

