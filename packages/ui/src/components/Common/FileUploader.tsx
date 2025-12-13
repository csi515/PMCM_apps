import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, X, File, FileText, Image, Film, Music, AlertCircle } from 'lucide-react';


export interface FileData {
    file: File;
    previewUrl?: string;
}

interface FileUploaderProps {
    onFilesSelected: (files: FileData[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    accept?: string; // e.g., "image/*, .pdf"
    className?: string;
    allowMultiple?: boolean;
}

function FileUploader({
    onFilesSelected,
    maxFiles = 5,
    maxSizeMB = 10,
    accept = '*',
    className = '',
    allowMultiple = true,
}: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validateAndProcessFiles = (files: FileList | File[]) => {
        setError(null);
        const validFiles: FileData[] = [];
        const fileArray = Array.from(files);

        if (!allowMultiple && fileArray.length > 1) {
            setError(`파일은 1개만 업로드할 수 있습니다.`);
            return;
        }

        if (fileArray.length > maxFiles) {
            setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
            return;
        }

        for (const file of fileArray) {
            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다: ${file.name}`);
                return;
            }

            const fileData: FileData = { file };
            if (file.type.startsWith('image/')) {
                fileData.previewUrl = URL.createObjectURL(file);
            }
            validFiles.push(fileData);
        }

        onFilesSelected(validFiles);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndProcessFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndProcessFiles(e.target.files);
        }
    };

    return (
        <div className={className}>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                    }
        `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    className="hidden"
                    multiple={allowMultiple}
                    accept={accept}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className={`p-3 rounded-full ${isDragging ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500'}`}>
                        <Upload className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-900">
                            클릭하거나 파일을 여기로 드래그하세요
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                            최대 {maxFiles}개, 파일당 {maxSizeMB}MB 제한 ({allowMultiple ? '다중 선택 가능' : '단일 파일'})
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
}

interface FileListDisplayProps {
    files: FileData[];
    onRemove: (index: number) => void;
    className?: string;
}

export function FileListDisplay({ files, onRemove, className = '' }: FileListDisplayProps) {
    if (files.length === 0) return null;

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <Image className="w-4 h-4 text-purple-500" />;
        if (type.startsWith('video/')) return <Film className="w-4 h-4 text-red-500" />;
        if (type.startsWith('audio/')) return <Music className="w-4 h-4 text-amber-500" />;
        if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-600" />;
        return <File className="w-4 h-4 text-blue-500" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <ul className={`space-y-2 mt-4 ${className}`}>
            {files.map((fileData, index) => (
                <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg group hover:border-primary-200 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {fileData.previewUrl ? (
                            <img
                                src={fileData.previewUrl}
                                alt="preview"
                                className="w-10 h-10 object-cover rounded-md border border-neutral-100"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-md bg-neutral-50 flex items-center justify-center border border-neutral-100">
                                {getFileIcon(fileData.file.type)}
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-neutral-700 truncate max-w-[200px]">
                                {fileData.file.name}
                            </span>
                            <span className="text-xs text-neutral-400">
                                {formatSize(fileData.file.size)}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onRemove(index)}
                        className="p-1.5 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default FileUploader;
