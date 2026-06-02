import React, { useState, useRef } from 'react';
import { User } from '../../types';

interface EditProfileModalProps {
    user: User;
    onSave: (updatedData: Partial<User>) => Promise<void>;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email || '');
    const [bio, setBio] = useState(user.bio || '');
    const [profilePictureUrl, setProfilePictureUrl] = useState(user.profilePictureUrl);
    const [coverPictureUrl, setCoverPictureUrl] = useState(user.coverPictureUrl || '');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePictureUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPictureUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            await onSave({
                name,
                email,
                bio,
                profilePictureUrl,
                coverPictureUrl
            });
        } catch (error) {
            console.error('Failed to save profile details:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[110] p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 transition-colors rounded-3xl p-6 w-full max-w-md animate-pop-in text-slate-800 dark:text-white shadow-2xl relative border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-black uppercase tracking-tight dark:text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cover Picture Banner Section */}
                <div 
                    className="w-full h-28 bg-[#2E2FCE] rounded-2xl relative overflow-hidden mb-4 border border-slate-200 dark:border-slate-750 flex items-center justify-center"
                    style={coverPictureUrl ? { backgroundImage: `url(${coverPictureUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                    {!coverPictureUrl && (
                        <span className="text-[10px] text-white/40 uppercase font-black tracking-widest pointer-events-none select-none">No Cover Image</span>
                    )}
                    <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border border-white/20 transition cursor-pointer"
                    >
                        Change Cover
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={coverInputRef}
                        onChange={handleCoverChange}
                        className="hidden"
                    />
                </div>

                {/* Profile Picture Avatar Section */}
                <div className="flex flex-col items-center mb-6 -mt-14 relative z-10">
                    <div className="relative">
                        <img 
                            src={profilePictureUrl || 'https://ui-avatars.com/api/?name=U&background=random'} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-700" 
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-brand-500 hover:bg-brand-600 text-white rounded-full p-1.5 shadow-md cursor-pointer transition border border-white dark:border-slate-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Text Fields Form */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    <div>
                        <label htmlFor="name" className="block text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 text-sm rounded-xl border-2 border-slate-100 dark:border-slate-750 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors font-bold"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 text-sm rounded-xl border-2 border-slate-100 dark:border-slate-750 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors font-bold"
                        />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mb-1">Bio</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 text-sm rounded-xl border-2 border-slate-100 dark:border-slate-750 bg-transparent dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors font-bold"
                        />
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-white bg-brand-500 hover:bg-brand-600 transition shadow-md shadow-brand-500/20 cursor-pointer"
                    >
                        Save Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
