
interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const baseClasses = "rounded-full flex items-center justify-center font-bold bg-indigo-100 text-indigo-700";

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`${sizeClasses[size]} rounded-full object-cover border border-neutral-200 ${className}`}
            />
        );
    }

    return (
        <div className={`${baseClasses} ${sizeClasses[size]} ${className}`}>
            {getInitials(name)}
        </div>
    );
}
