import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save, Eye, EyeOff, Loader2, ArrowLeft, Upload,
  Bold, Italic, Code, Heading2, List, ListOrdered, Link2, Image as ImageIcon, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContentPayload {
  title: string;
  slug?: string;
  type: 'post' | 'announcement' | 'featured';
  status: 'draft' | 'live';
  body: string;
  coverImageUrl: string;
  tags: string[];
}

// ─── API ──────────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchOne = async (id: string) => {
  const res = await fetch(`/api/admin/content/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Not found');
  return res.json();
};

const saveContent = async ({ id, payload }: { id?: string; payload: ContentPayload }) => {
  const url = id ? `/api/admin/content/${id}` : '/api/admin/content';
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Save failed');
  }
  return res.json();
};

const uploadImageApi = async (base64: string): Promise<string> => {
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
};

// ─── Toolbar ──────────────────────────────────────────────────────────────────
const ToolbarButton: React.FC<{
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-md transition-colors ${
      isActive ? 'bg-[#facc15]/20 text-[#facc15]' : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    {children}
  </button>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ContentEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'post' | 'announcement' | 'featured'>('post');
  const [status, setStatus] = useState<'draft' | 'live'>('draft');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [savedId, setSavedId] = useState<string | undefined>(id);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your content here...' }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] focus:outline-none p-4 text-slate-300 leading-relaxed',
      },
    },
  });

  // Load existing content
  const { data: existingContent, isLoading } = useQuery({
    queryKey: ['admin-content-item', id],
    queryFn: () => fetchOne(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (existingContent) {
      setTitle(existingContent.title);
      setType(existingContent.type);
      setStatus(existingContent.status);
      setCoverImageUrl(existingContent.coverImageUrl || '');
      setTags(existingContent.tags || []);
      editor?.commands.setContent(existingContent.body || '');
    }
  }, [existingContent, editor]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: saveContent,
    onSuccess: (data) => {
      setSavedId(data._id);
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
    },
  });

  const getPayload = useCallback((): ContentPayload => ({
    title,
    type,
    status,
    body: editor?.getHTML() || '',
    coverImageUrl,
    tags,
  }), [title, type, status, editor, coverImageUrl, tags]);

  // Auto-save (debounced 3s)
  useEffect(() => {
    if (!title) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await saveMutation.mutateAsync({ id: savedId, payload: getPayload() });
        setAutoSaveMsg('Auto-saved');
        setTimeout(() => setAutoSaveMsg(''), 2500);
      } catch { /* silent */ }
    }, 3000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [title, type, status, coverImageUrl, tags]); // eslint-disable-line

  // Tag handling
  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (cleaned && !tags.includes(cleaned)) setTags([...tags, cleaned]);
    setTagInput('');
  };

  // Cover image upload (converts to base64 then uploads)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const url = await uploadImageApi(reader.result as string);
        setCoverImageUrl(url);
      } catch { alert('Image upload failed. Check Cloudinary config.'); }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!title.trim()) return alert('Title is required');
    saveMutation.mutate({ id: savedId, payload: getPayload() });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-[#facc15] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-black text-white">{id ? 'Edit Post' : 'New Post'}</h1>
          {autoSaveMsg && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-emerald-400 font-mono"
            >
              ✓ {autoSaveMsg}
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-black font-bold text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === 'live' ? 'Publish' : 'Save Draft'}
          </button>
        </div>
      </div>

      {saveMutation.isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {(saveMutation.error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[#0e0e11] border border-slate-800 rounded-xl text-xl font-bold text-white placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40 transition-colors"
          />

          {/* Tiptap Toolbar */}
          {!showPreview && (
            <div className="flex items-center gap-1 px-3 py-2 bg-[#0e0e11] border border-slate-800 rounded-xl flex-wrap">
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} title="Bold">
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} title="Italic">
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive('heading', { level: 2 })} title="Heading">
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} title="Bullet List">
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive('orderedList')} title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor?.chain().focus().toggleCode().run()} isActive={editor?.isActive('code')} title="Inline Code">
                <Code className="w-4 h-4" />
              </ToolbarButton>
              <div className="w-px h-5 bg-slate-800 mx-1" />
              <ToolbarButton
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
                isActive={editor?.isActive('link')}
                title="Link"
              >
                <Link2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  const url = prompt('Image URL:');
                  if (url) editor?.chain().focus().setImage({ src: url }).run();
                }}
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
            </div>
          )}

          {/* Editor / Preview */}
          <div className="bg-[#0e0e11] border border-slate-800 rounded-xl overflow-hidden min-h-[400px]">
            {showPreview ? (
              <div
                className="prose prose-invert max-w-none p-6 text-slate-300"
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '<p class="text-slate-600">Nothing to preview yet.</p>' }}
              />
            ) : (
              <EditorContent editor={editor} />
            )}
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="space-y-4">
          {/* Status & Type */}
          <div className="bg-[#0e0e11] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Publish Settings</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'live')}
                className="w-full px-3 py-2 bg-[#09090b] border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40"
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-semibold">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'post' | 'announcement' | 'featured')}
                className="w-full px-3 py-2 bg-[#09090b] border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40"
              >
                <option value="post">Post</option>
                <option value="announcement">Announcement</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-[#0e0e11] border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Image</h3>
            {coverImageUrl ? (
              <div className="relative group">
                <img src={coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded-lg border border-slate-800" />
                <button
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-600 hover:text-slate-400 hover:border-slate-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span className="text-xs font-semibold">Upload Cover</span>
              </button>
            )}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            {!coverImageUrl && (
              <input
                type="text"
                placeholder="Or paste image URL..."
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#09090b] border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-700 focus:outline-none"
              />
            )}
          </div>

          {/* Tags */}
          <div className="bg-[#0e0e11] border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tags</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 bg-[#09090b] border border-slate-800 rounded-lg text-xs text-slate-300 placeholder-slate-700 focus:outline-none"
              />
              <button onClick={addTag} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors font-bold">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-[11px] font-bold rounded-md"
                >
                  {tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
