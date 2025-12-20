'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export const FileUploader = ({ onFilesChange, maxFiles = 10 }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);
      if (fileRejections.length > 0) {
        const rejectionError = fileRejections[0].errors[0];
        if (rejectionError.code === 'file-too-large') {
          setError('File is too large. Maximum size is 10MB.');
        } else if (rejectionError.code === 'too-many-files') {
          setError(`You can only upload a maximum of ${maxFiles} files.`);
        } else {
          setError(rejectionError.message);
        }
        return;
      }

      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }

      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);
      onFilesChange(newFiles);
    },
    [files, maxFiles, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: maxFiles,
  });

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter((file) => file !== fileToRemove);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
  }, [files]);

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'bg-neutral-50 hover:bg-neutral-100'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <Upload className="mb-3 h-8 w-8 text-neutral-400" />
          <p className="mb-2 text-sm text-neutral-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-neutral-500">PNG or JPG (max 10MB. Up to {maxFiles} files)</p>
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {files.map((file, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${file.name}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(file)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
