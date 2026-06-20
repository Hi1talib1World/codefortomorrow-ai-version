
import React from 'react';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

/**
 * A friendly empty state component to show when there's no data.
 * Replaces blank space with a visual placeholder.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
    icon = '',
    title,
    description,
    actionLabel,
    onAction,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-page-enter">
            <div className="text-7xl mb-6 drop-shadow-sm">{icon}</div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-200 tracking-tight mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500 max-w-sm mb-6">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-[#2E2FCE] text-white rounded-xl font-bold shadow-md hover:bg-[#2E2FCE] transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
