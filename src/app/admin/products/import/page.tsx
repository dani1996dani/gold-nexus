'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Upload, File as FileIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function ImportPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadResults, setUploadResults] = useState<{name: string, status: string, message?: string}[]>([]);

    // CSV State
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [isCsvUploading, setIsCsvUploading] = useState(false);
    const [csvReport, setCsvReport] = useState<{success: number, failed: number, errors: string[]} | null>(null);

    const onDropImages = (acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    };

    const onDropCsv = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setCsvFile(acceptedFiles[0]);
            setCsvReport(null);
        }
    };

    const { getRootProps: getImgRootProps, getInputProps: getImgInputProps, isDragActive: isImgDragActive } = useDropzone({
        onDrop: onDropImages,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] }
    });

    const { getRootProps: getCsvRootProps, getInputProps: getCsvInputProps, isDragActive: isCsvDragActive } = useDropzone({
        onDrop: onDropCsv,
        accept: { 'text/csv': ['.csv'] },
        maxFiles: 1,
    });
    
    const handleUploadImages = async () => {
        if (files.length === 0) return;
        setUploading(true);
        setUploadResults([]);
        
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        
        try {
            const res = await fetch('/api/admin/products/upload-images', {
                method: 'POST',
                body: formData,
            });
            
            if (!res.ok) throw new Error('Upload failed');
            
            const data = await res.json();
            setUploadResults(data.results);
            setFiles([]); // Clear queue on success
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleCsvUpload = async () => {
        if (!csvFile) return;
        setIsCsvUploading(true);
        setCsvReport(null);

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const res = await fetch('/api/admin/products/import-csv', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('CSV Import failed');

            const data = await res.json();
            setCsvReport(data);
            if (data.failed === 0) {
                setCsvFile(null);
            }
        } catch (err) {
            console.error(err);
             // Handle generic error
        } finally {
            setIsCsvUploading(false);
        }
    };
    
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const downloadTemplate = () => {
        const headers = ['sku', 'name', 'description', 'price', 'weight', 'karat', 'category', 'vendorName', 'stockStatus'];
        const examples = [
            ['EXAMPLE-BAR-001', '1kg Gold Bar Example', 'Fine gold bar 99.99% purity', '65000.00', '1 kg', '24K', 'BAR', 'PAMP Suisse', 'IN_STOCK'],
            ['EXAMPLE-COIN-002', '1oz Gold Coin Example', 'Beautiful gold coin', '2100.50', '1 oz', '22K', 'COIN', 'Royal Mint', 'IN_STOCK'],
            ['EXAMPLE-JWLR-003', 'Gold Necklace Example', 'Elegant 18K necklace', '1500.00', '15 g', '18K', 'JEWELRY', 'Gold Nexus', 'OUT_OF_STOCK']
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + examples.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div>
                <Link href="/admin/products">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                    </Button>
                </Link>
            </div>
            
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Bulk Import</h1>
                <p className="text-muted-foreground">Upload product images and data in bulk.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Step 1: Upload Product Images</CardTitle>
                    <CardDescription>
                        Upload images for your products. <br/>
                        <strong>Important:</strong> Name your image files exactly as the Product SKU (e.g., if SKU is "GOLD-1KG", name the file "GOLD-1KG.jpg").
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div
                        {...getImgRootProps()}
                        className={`flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 transition-colors ${
                          isImgDragActive ? 'border-primary bg-primary/10' : 'bg-neutral-50 hover:bg-neutral-100'
                        }`}
                      >
                        <input {...getImgInputProps()} />
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <Upload className="mb-3 h-10 w-10 text-neutral-400" />
                          <p className="mb-1 text-sm text-neutral-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-neutral-500">JPG, PNG, WEBP</p>
                        </div>
                      </div>
                      
                      {files.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{files.length} files selected</h3>
                                <Button variant="ghost" size="sm" onClick={() => setFiles([])} disabled={uploading}>Clear all</Button>
                            </div>
                            <div className="max-h-60 overflow-y-auto rounded border p-2">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between py-1 text-sm">
                                        <div className="flex items-center truncate">
                                            <FileIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <span className="truncate max-w-[300px]">{file.name}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)} disabled={uploading}>
                                            <XCircle className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleUploadImages} disabled={uploading} className="w-full">
                                {uploading ? 'Uploading...' : 'Upload Images'}
                            </Button>
                        </div>
                      )}
                      
                      {uploadResults.length > 0 && (
                          <div className="mt-6 space-y-2">
                              <h3 className="font-medium">Upload Results</h3>
                              <div className="max-h-60 overflow-y-auto rounded border p-2 text-sm">
                                  {uploadResults.map((res, i) => (
                                      <div key={i} className="flex items-center gap-2 py-1">
                                          {res.status === 'success' ? (
                                              <CheckCircle className="h-4 w-4 text-green-500" />
                                          ) : (
                                              <AlertCircle className="h-4 w-4 text-red-500" />
                                          )}
                                          <span className={res.status === 'error' ? 'text-red-600' : ''}>
                                              {res.name}: {res.status} {res.message && `(${res.message})`}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Step 2: Upload Product Data (CSV)</CardTitle>
                            <CardDescription>
                                Upload a CSV file with your product details. SKUs must match the uploaded images.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={downloadTemplate}>
                            Download CSV Template
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div
                        {...getCsvRootProps()}
                        className={`flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 transition-colors ${
                            isCsvDragActive ? 'border-primary bg-primary/10' : 'bg-neutral-50 hover:bg-neutral-100'
                        }`}
                    >
                        <input {...getCsvInputProps()} />
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                            <FileIcon className="mb-3 h-10 w-10 text-neutral-400" />
                            <p className="mb-1 text-sm text-neutral-600">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-neutral-500">CSV only</p>
                        </div>
                    </div>

                    {csvFile && (
                        <div className="space-y-2">
                             <div className="flex items-center justify-between py-2 border rounded px-3">
                                <div className="flex items-center truncate">
                                    <FileIcon className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="font-medium">{csvFile.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCsvFile(null)} disabled={isCsvUploading}>
                                    <XCircle className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                </Button>
                            </div>
                            <Button onClick={handleCsvUpload} disabled={isCsvUploading} className="w-full">
                                {isCsvUploading ? 'Importing CSV...' : 'Import Products'}
                            </Button>
                        </div>
                    )}

                    {csvReport && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded border border-green-200 text-center">
                                    <p className="text-2xl font-bold text-green-700">{csvReport.success}</p>
                                    <p className="text-sm text-green-800">Successful</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded border border-red-200 text-center">
                                    <p className="text-2xl font-bold text-red-700">{csvReport.failed}</p>
                                    <p className="text-sm text-red-800">Failed</p>
                                </div>
                            </div>
                            
                            {csvReport.errors.length > 0 && (
                                <div className="rounded border bg-red-50 p-4">
                                    <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1 max-h-60 overflow-y-auto">
                                        {csvReport.errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
