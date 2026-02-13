
import { Lesson, Badge, ProgrammingPath } from './types';

export const PATHS: ProgrammingPath[] = [
  { 
    id: 'block_coding', 
    titleKey: 'block_coding', 
    descriptionKey: 'block_coding_desc', 
    icon: '🧩',
    color: 'bg-blue-500',
    isAvailable: true 
  },
  { 
    id: 'python', 
    titleKey: 'python', 
    descriptionKey: 'python_desc', 
    icon: '🐍',
    color: 'bg-yellow-500',
    isAvailable: true
  },
  { 
    id: 'javascript', 
    titleKey: 'javascript', 
    descriptionKey: 'javascript_desc', 
    icon: '📜',
    color: 'bg-red-500',
    isAvailable: true
  },
  { 
    id: 'lua', 
    titleKey: 'lua', 
    descriptionKey: 'lua_desc', 
    icon: '🎮',
    color: 'bg-indigo-500',
    isAvailable: true
  },
  {
    id: 'web_dev',
    titleKey: 'web_dev',
    descriptionKey: 'web_dev_desc',
    icon: '🌐',
    color: 'bg-pink-500',
    isAvailable: true
  },
  { 
    id: 'c_plus_plus', 
    titleKey: 'c_plus_plus', 
    descriptionKey: 'c_plus_plus_desc', 
    icon: '🐉',
    color: 'bg-gray-700',
    isAvailable: true
  },
  { 
    id: 'c_sharp', 
    titleKey: 'c_sharp', 
    descriptionKey: 'c_sharp_desc', 
    icon: '♯',
    color: 'bg-purple-600',
    isAvailable: true
  },
  { 
    id: 'java', 
    titleKey: 'java', 
    descriptionKey: 'java_desc', 
    icon: '☕',
    color: 'bg-orange-600',
    isAvailable: true
  },
  { 
    id: 'kotlin', 
    titleKey: 'kotlin', 
    descriptionKey: 'kotlin_desc', 
    icon: '🤖',
    color: 'bg-blue-700',
    isAvailable: true
  },
  { 
    id: 'swift', 
    titleKey: 'swift', 
    descriptionKey: 'swift_desc', 
    icon: '🐦',
    color: 'bg-red-600',
    isAvailable: true
  },
  { 
    id: 'go', 
    titleKey: 'go', 
    descriptionKey: 'go_desc', 
    icon: '🐹',
    color: 'bg-cyan-500',
    isAvailable: true
  },
  { 
    id: 'rust', 
    titleKey: 'rust', 
    descriptionKey: 'rust_desc', 
    icon: '🦀',
    color: 'bg-orange-800',
    isAvailable: true
  },
  { 
    id: 'php', 
    titleKey: 'php', 
    descriptionKey: 'php_desc', 
    icon: '🐘',
    color: 'bg-indigo-400',
    isAvailable: true
  },
  { 
    id: 'ruby', 
    titleKey: 'ruby', 
    descriptionKey: 'ruby_desc', 
    icon: '💎',
    color: 'bg-red-700',
    isAvailable: true
  },
  { 
    id: 'typescript', 
    titleKey: 'typescript', 
    descriptionKey: 'typescript_desc', 
    icon: '🔷',
    color: 'bg-blue-600',
    isAvailable: true
  },
  { 
    id: 'sql', 
    titleKey: 'sql', 
    descriptionKey: 'sql_desc', 
    icon: '🗃️',
    color: 'bg-gray-500',
    isAvailable: true
  },
  { 
    id: 'r', 
    titleKey: 'r', 
    descriptionKey: 'r_desc', 
    icon: '📊',
    color: 'bg-sky-600',
    isAvailable: true
  },
  { 
    id: 'dart', 
    titleKey: 'dart', 
    descriptionKey: 'dart_desc', 
    icon: '🎯',
    color: 'bg-teal-500',
    isAvailable: true
  },
  { 
    id: 'scala', 
    titleKey: 'scala', 
    descriptionKey: 'scala_desc', 
    icon: '🪜',
    color: 'bg-red-800',
    isAvailable: true
  },
];

export const LESSONS_BY_PATH: { [key: string]: Lesson[] } = {
  block_coding: [
    { id: 1, level: 1, titleKey: 'sequences', icon: '➡️', xp: 15, color: 'bg-green-400', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'loops', icon: '🔄', xp: 20, color: 'bg-blue-400', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'events', icon: '⚡️', xp: 20, color: 'bg-purple-400', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'maze_game', icon: '🗺️', xp: 50, color: 'bg-orange-400', type: 'project' },
  ],
  python: [
    { id: 1, level: 1, titleKey: 'python_vars_numbers', icon: '🔢', xp: 15, color: 'bg-green-500', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'python_loops', icon: '🔄', xp: 20, color: 'bg-blue-500', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'python_conditionals', icon: '🤔', xp: 25, color: 'bg-purple-500', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'python_functions', icon: '⚙️', xp: 30, color: 'bg-teal-500', type: 'lesson' },
    { id: 5, level: 5, titleKey: 'python_quiz_game', icon: '❓', xp: 50, color: 'bg-orange-500', type: 'project' },
  ],
  javascript: [
    { id: 1, level: 1, titleKey: 'js_vars_alerts', icon: '🔔', xp: 15, color: 'bg-green-600', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'js_dom', icon: '📄', xp: 25, color: 'bg-blue-600', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'js_loops_conditionals', icon: '🔀', xp: 25, color: 'bg-purple-600', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'js_functions_events', icon: '🖱️', xp: 30, color: 'bg-teal-600', type: 'lesson' },
    { id: 5, level: 5, titleKey: 'js_interactive_story', icon: '📖', xp: 50, color: 'bg-orange-600', type: 'project' },
  ],
  lua: [
    { id: 1, level: 1, titleKey: 'lua_intro', icon: '👋', xp: 15, color: 'bg-green-700', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'lua_logic', icon: '🧠', xp: 20, color: 'bg-blue-700', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'lua_functions', icon: '🛠️', xp: 25, color: 'bg-purple-700', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'lua_tables', icon: '📋', xp: 30, color: 'bg-teal-700', type: 'lesson' },
    { id: 5, level: 5, titleKey: 'lua_text_adventure', icon: '🗺️', xp: 50, color: 'bg-orange-700', type: 'project' },
  ],
  web_dev: [
    { id: 1, level: 1, titleKey: 'web_html_basics', icon: '<h1>', xp: 15, color: 'bg-green-800', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'web_images_links', icon: '🔗', xp: 20, color: 'bg-blue-800', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'web_css_intro', icon: '🎨', xp: 25, color: 'bg-purple-800', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'web_css_layout', icon: '📰', xp: 30, color: 'bg-teal-800', type: 'lesson' },
    { id: 5, level: 5, titleKey: 'web_animal_page', icon: '🦁', xp: 50, color: 'bg-orange-800', type: 'project' },
  ],
  c_plus_plus: [
    { id: 1, level: 1, titleKey: 'cpp_pointers', icon: '👉', xp: 20, color: 'bg-gray-600', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'cpp_classes', icon: '🏛️', xp: 25, color: 'bg-gray-700', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'cpp_stl', icon: '📚', xp: 30, color: 'bg-gray-800', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'cpp_calculator', icon: '🧮', xp: 50, color: 'bg-gray-900', type: 'project' },
  ],
  c_sharp: [
    { id: 1, level: 1, titleKey: 'csharp_dotnet', icon: '🌐', xp: 20, color: 'bg-purple-500', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'csharp_linq', icon: '🔍', xp: 25, color: 'bg-purple-600', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'csharp_async', icon: '⏳', xp: 30, color: 'bg-purple-700', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'csharp_todo_app', icon: '✅', xp: 50, color: 'bg-purple-800', type: 'project' },
  ],
  java: [
    { id: 1, level: 1, titleKey: 'java_jvm', icon: '⚙️', xp: 20, color: 'bg-orange-500', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'java_oop', icon: '🤝', xp: 25, color: 'bg-orange-600', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'java_collections', icon: '🗂️', xp: 30, color: 'bg-orange-700', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'java_bank_account', icon: '🏦', xp: 50, color: 'bg-orange-800', type: 'project' },
  ],
  kotlin: [
    { id: 1, level: 1, titleKey: 'kotlin_null_safety', icon: '🛡️', xp: 20, color: 'bg-blue-600', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'kotlin_coroutines', icon: '🏃', xp: 25, color: 'bg-blue-700', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'kotlin_data_classes', icon: '📦', xp: 30, color: 'bg-blue-800', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'kotlin_button_clicker', icon: '🖱️', xp: 50, color: 'bg-blue-900', type: 'project' },
  ],
  swift: [
    { id: 1, level: 1, titleKey: 'swift_optionals', icon: '❓', xp: 20, color: 'bg-red-500', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'swift_swiftui', icon: '🎨', xp: 25, color: 'bg-red-600', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'swift_closures', icon: '➡️', xp: 30, color: 'bg-red-700', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'swift_tip_calculator', icon: '💰', xp: 50, color: 'bg-red-800', type: 'project' },
  ],
  go: [
    { id: 1, level: 1, titleKey: 'go_goroutines', icon: '👯', xp: 20, color: 'bg-cyan-400', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'go_channels', icon: '📡', xp: 25, color: 'bg-cyan-500', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'go_structs', icon: '🧱', xp: 30, color: 'bg-cyan-600', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'go_web_scraper', icon: '🕷️', xp: 50, color: 'bg-cyan-700', type: 'project' },
  ],
  rust: [
    { id: 1, level: 1, titleKey: 'rust_ownership', icon: '🤝', xp: 20, color: 'bg-orange-700', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'rust_enums', icon: '📜', xp: 25, color: 'bg-orange-800', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'rust_lifetimes', icon: '⏳', xp: 30, color: 'bg-orange-900', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'rust_word_counter', icon: '📊', xp: 50, color: 'bg-yellow-900', type: 'project' },
  ],
  php: [
    { id: 1, level: 1, titleKey: 'php_server_basics', icon: '🌐', xp: 20, color: 'bg-indigo-300', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'php_arrays', icon: '📚', xp: 25, color: 'bg-indigo-400', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'php_forms', icon: '📝', xp: 30, color: 'bg-indigo-500', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'php_contact_form', icon: '📨', xp: 50, color: 'bg-indigo-600', type: 'project' },
  ],
  ruby: [
    { id: 1, level: 1, titleKey: 'ruby_blocks', icon: '🧱', xp: 20, color: 'bg-red-600', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'ruby_gems', icon: '💎', xp: 25, color: 'bg-red-700', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'ruby_metaprogramming', icon: '✨', xp: 30, color: 'bg-red-800', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'ruby_blog_generator', icon: '📰', xp: 50, color: 'bg-red-900', type: 'project' },
  ],
  typescript: [
    { id: 1, level: 1, titleKey: 'ts_types', icon: '📝', xp: 20, color: 'bg-blue-500', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'ts_interfaces', icon: '📜', xp: 25, color: 'bg-blue-600', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'ts_generics', icon: '📦', xp: 30, color: 'bg-blue-700', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'ts_todo_list', icon: '✅', xp: 50, color: 'bg-blue-800', type: 'project' },
  ],
  sql: [
    { id: 1, level: 1, titleKey: 'sql_select', icon: 'SELECT', xp: 20, color: 'bg-gray-400', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'sql_where', icon: 'WHERE', xp: 25, color: 'bg-gray-500', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'sql_joins', icon: 'JOIN', xp: 30, color: 'bg-gray-600', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'sql_query_db', icon: '❓', xp: 50, color: 'bg-gray-700', type: 'project' },
  ],
  r: [
    { id: 1, level: 1, titleKey: 'r_data_frames', icon: '📋', xp: 20, color: 'bg-sky-500', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'r_vectors', icon: '➡️', xp: 25, color: 'bg-sky-600', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'r_plotting', icon: '📈', xp: 30, color: 'bg-sky-700', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'r_analyze_data', icon: '🔬', xp: 50, color: 'bg-sky-800', type: 'project' },
  ],
  dart: [
    { id: 1, level: 1, titleKey: 'dart_futures', icon: '⏳', xp: 20, color: 'bg-teal-400', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'dart_widgets', icon: '📱', xp: 25, color: 'bg-teal-500', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'dart_state', icon: '🔄', xp: 30, color: 'bg-teal-600', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'dart_counter_app', icon: '🔢', xp: 50, color: 'bg-teal-700', type: 'project' },
  ],
  scala: [
    { id: 1, level: 1, titleKey: 'scala_fp', icon: 'λ', xp: 20, color: 'bg-red-700', type: 'lesson' },
    { id: 2, level: 2, titleKey: 'scala_case_classes', icon: '📦', xp: 25, color: 'bg-red-800', type: 'lesson' },
    { id: 3, level: 3, titleKey: 'scala_futures', icon: '🚀', xp: 30, color: 'bg-red-900', type: 'lesson' },
    { id: 4, level: 4, titleKey: 'scala_data_transformer', icon: '✨', xp: 50, color: 'bg-rose-900', type: 'project' },
  ],
};

export const BADGES_BY_PATH: { [key: string]: Badge[] } = {
    block_coding: [
        { id: 'bc_badge1', lessonId: 1, icon: '🔗', titleKey: 'sequences_badge' },
        { id: 'bc_badge2', lessonId: 2, icon: '🔄', titleKey: 'loop_master_badge' },
        { id: 'bc_badge3', lessonId: 3, icon: '⚡️', titleKey: 'event_expert_badge' },
        { id: 'bc_badge4', lessonId: 4, icon: '🏆', titleKey: 'maze_master_badge' },
    ],
    python: [
        { id: 'py_badge1', lessonId: 1, icon: '🔢', titleKey: 'number_ninja_badge' },
        { id: 'py_badge2', lessonId: 2, icon: '🔄', titleKey: 'python_looper_badge' },
        { id: 'py_badge3', lessonId: 4, icon: '⚙️', titleKey: 'function_fanatic_badge' },
        { id: 'py_badge4', lessonId: 5, icon: '🏆', titleKey: 'quiz_whiz_badge' },
    ],
    javascript: [
        { id: 'js_badge1', lessonId: 1, icon: '🔔', titleKey: 'alerter_badge' },
        { id: 'js_badge2', lessonId: 2, icon: '📄', titleKey: 'dom_dynamo_badge' },
        { id: 'js_badge3', lessonId: 4, icon: '🖱️', titleKey: 'event_handler_badge' },
        { id: 'js_badge4', lessonId: 5, icon: '🏆', titleKey: 'story_spinner_badge' },
    ],
    lua: [
        { id: 'lua_badge1', lessonId: 1, icon: '👋', titleKey: 'lua_printer_badge' },
        { id: 'lua_badge2', lessonId: 2, icon: '🧠', titleKey: 'lua_logic_badge' },
        { id: 'lua_badge3', lessonId: 3, icon: '🛠️', titleKey: 'lua_function_badge' },
        { id: 'lua_badge4', lessonId: 5, icon: '🏆', titleKey: 'lua_adventure_badge' },
    ],
    web_dev: [
        { id: 'web_badge1', lessonId: 1, icon: '<h1>', titleKey: 'web_tagger_badge' },
        { id: 'web_badge2', lessonId: 2, icon: '🔗', titleKey: 'web_linker_badge' },
        { id: 'web_badge3', lessonId: 3, icon: '🎨', titleKey: 'web_styler_badge' },
        { id: 'web_badge4', lessonId: 5, icon: '🏆', titleKey: 'web_builder_badge' },
    ],
    c_plus_plus: [
        { id: 'cpp_badge1', lessonId: 1, icon: '👉', titleKey: 'cpp_badge_pointer' },
        { id: 'cpp_badge2', lessonId: 2, icon: '🏛️', titleKey: 'cpp_badge_oop' },
        { id: 'cpp_badge3', lessonId: 3, icon: '📚', titleKey: 'cpp_badge_stl' },
        { id: 'cpp_badge4', lessonId: 4, icon: '🏆', titleKey: 'cpp_badge_calculator' },
    ],
    c_sharp: [
        { id: 'csharp_badge1', lessonId: 1, icon: '🌐', titleKey: 'csharp_badge_dotnet' },
        { id: 'csharp_badge2', lessonId: 2, icon: '🔍', titleKey: 'csharp_badge_linq' },
        { id: 'csharp_badge3', lessonId: 3, icon: '⏳', titleKey: 'csharp_badge_async' },
        { id: 'csharp_badge4', lessonId: 4, icon: '🏆', titleKey: 'csharp_badge_taskmaster' },
    ],
    java: [
        { id: 'java_badge1', lessonId: 1, icon: '⚙️', titleKey: 'java_badge_jvm' },
        { id: 'java_badge2', lessonId: 2, icon: '🤝', titleKey: 'java_badge_oop' },
        { id: 'java_badge3', lessonId: 3, icon: '🗂️', titleKey: 'java_badge_collections' },
        { id: 'java_badge4', lessonId: 4, icon: '🏆', titleKey: 'java_badge_banker' },
    ],
    kotlin: [
        { id: 'kotlin_badge1', lessonId: 1, icon: '🛡️', titleKey: 'kotlin_badge_null' },
        { id: 'kotlin_badge2', lessonId: 2, icon: '🏃', titleKey: 'kotlin_badge_coroutines' },
        { id: 'kotlin_badge3', lessonId: 3, icon: '📦', titleKey: 'kotlin_badge_data' },
        { id: 'kotlin_badge4', lessonId: 4, icon: '🏆', titleKey: 'kotlin_badge_apprentice' },
    ],
    swift: [
        { id: 'swift_badge1', lessonId: 1, icon: '❓', titleKey: 'swift_badge_optionals' },
        { id: 'swift_badge2', lessonId: 2, icon: '🎨', titleKey: 'swift_badge_swiftui' },
        { id: 'swift_badge3', lessonId: 3, icon: '➡️', titleKey: 'swift_badge_closures' },
        { id: 'swift_badge4', lessonId: 4, icon: '🏆', titleKey: 'swift_badge_tiptop' },
    ],
    go: [
        { id: 'go_badge1', lessonId: 1, icon: '👯', titleKey: 'go_badge_gogetter' },
        { id: 'go_badge2', lessonId: 2, icon: '📡', titleKey: 'go_badge_channel' },
        { id: 'go_badge3', lessonId: 3, icon: '🧱', titleKey: 'go_badge_struct' },
        { id: 'go_badge4', lessonId: 4, icon: '🏆', titleKey: 'go_badge_weaver' },
    ],
    rust: [
        { id: 'rust_badge1', lessonId: 1, icon: '🤝', titleKey: 'rust_badge_ownership' },
        { id: 'rust_badge2', lessonId: 2, icon: '📜', titleKey: 'rust_badge_pattern' },
        { id: 'rust_badge3', lessonId: 3, icon: '⏳', titleKey: 'rust_badge_lifetime' },
        { id: 'rust_badge4', lessonId: 4, icon: '🏆', titleKey: 'rust_badge_cli' },
    ],
    php: [
        { id: 'php_badge1', lessonId: 1, icon: '🌐', titleKey: 'php_badge_server' },
        { id: 'php_badge2', lessonId: 2, icon: '📚', titleKey: 'php_badge_array' },
        { id: 'php_badge3', lessonId: 3, icon: '📝', titleKey: 'php_badge_form' },
        { id: 'php_badge4', lessonId: 4, icon: '🏆', titleKey: 'php_badge_contact' },
    ],
    ruby: [
        { id: 'ruby_badge1', lessonId: 1, icon: '🧱', titleKey: 'ruby_badge_block' },
        { id: 'ruby_badge2', lessonId: 2, icon: '💎', titleKey: 'ruby_badge_gem' },
        { id: 'ruby_badge3', lessonId: 3, icon: '✨', titleKey: 'ruby_badge_meta' },
        { id: 'ruby_badge4', lessonId: 4, icon: '🏆', titleKey: 'ruby_badge_blogger' },
    ],
    typescript: [
        { id: 'ts_badge1', lessonId: 1, icon: '📝', titleKey: 'ts_badge_type' },
        { id: 'ts_badge2', lessonId: 2, icon: '📜', titleKey: 'ts_badge_interface' },
        { id: 'ts_badge3', lessonId: 3, icon: '📦', titleKey: 'ts_badge_generic' },
        { id: 'ts_badge4', lessonId: 4, icon: '🏆', titleKey: 'ts_badge_scripter' },
    ],
    sql: [
        { id: 'sql_badge1', lessonId: 1, icon: '⭐', titleKey: 'sql_badge_select' },
        { id: 'sql_badge2', lessonId: 2, icon: '🎯', titleKey: 'sql_badge_where' },
        { id: 'sql_badge3', lessonId: 3, icon: '🔗', titleKey: 'sql_badge_join' },
        { id: 'sql_badge4', lessonId: 4, icon: '🏆', titleKey: 'sql_badge_query' },
    ],
    r: [
        { id: 'r_badge1', lessonId: 1, icon: '📋', titleKey: 'r_badge_dataframe' },
        { id: 'r_badge2', lessonId: 2, icon: '➡️', titleKey: 'r_badge_vector' },
        { id: 'r_badge3', lessonId: 3, icon: '📈', titleKey: 'r_badge_plot' },
        { id: 'r_badge4', lessonId: 4, icon: '🏆', titleKey: 'r_badge_analyst' },
    ],
    dart: [
        { id: 'dart_badge1', lessonId: 1, icon: '⏳', titleKey: 'dart_badge_future' },
        { id: 'dart_badge2', lessonId: 2, icon: '📱', titleKey: 'dart_badge_widget' },
        { id: 'dart_badge3', lessonId: 3, icon: '🔄', titleKey: 'dart_badge_state' },
        { id: 'dart_badge4', lessonId: 4, icon: '🏆', titleKey: 'dart_badge_flutter' },
    ],
    scala: [
        { id: 'scala_badge1', lessonId: 1, icon: 'λ', titleKey: 'scala_badge_fp' },
        { id: 'scala_badge2', lessonId: 2, icon: '📦', titleKey: 'scala_badge_case' },
        { id: 'scala_badge3', lessonId: 3, icon: '🚀', titleKey: 'scala_badge_future' },
        { id: 'scala_badge4', lessonId: 4, icon: '🏆', titleKey: 'scala_badge_transformer' },
    ],
};
