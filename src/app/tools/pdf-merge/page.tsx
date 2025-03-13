"use client";

import { useState, useCallback, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePlus2, FileX, ArrowUpDown, Download, Trash } from "lucide-react";

interface PDFFile {
  name: string;
  size: number;
  data: ArrayBuffer;
}

export default function PDFMergePage() {
  const [pdfFiles, setPDFFiles] = useState<PDFFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    return file.type === "application/pdf";
  };

  const loadFile = async (file: File): Promise<PDFFile | null> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Validate that it's a valid PDF
      await PDFDocument.load(arrayBuffer);

      return {
        name: file.name,
        size: file.size,
        data: arrayBuffer,
      };
    } catch (err) {
      console.error(`Error loading file ${file.name}:`, err);
      setError(`"${file.name}" is not a valid PDF file.`);
      return null;
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);

    if (files.length === 0) return;

    const pdfFiles = files.filter(validateFile);

    if (pdfFiles.length !== files.length) {
      setError("Some files were skipped because they're not PDF files.");
    }

    const loadPromises = pdfFiles.map(loadFile);
    const loadedFiles = await Promise.all(loadPromises);

    setPDFFiles((prevFiles) => [
      ...prevFiles,
      ...loadedFiles.filter((file): file is PDFFile => file !== null),
    ]);
  }, []);

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);

    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(validateFile);

    if (pdfFiles.length !== files.length) {
      setError("Some files were skipped because they're not PDF files.");
    }

    const loadPromises = pdfFiles.map(loadFile);
    const loadedFiles = await Promise.all(loadPromises);

    setPDFFiles((prevFiles) => [
      ...prevFiles,
      ...loadedFiles.filter((file): file is PDFFile => file !== null),
    ]);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setPDFFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === pdfFiles.length - 1)
    ) {
      return;
    }

    setPDFFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newFiles[index], newFiles[targetIndex]] = [
        newFiles[targetIndex],
        newFiles[index],
      ];
      return newFiles;
    });
  };

  const mergePDFs = async () => {
    if (pdfFiles.length === 0) {
      setError("Please add at least one PDF file.");
      return;
    }

    if (pdfFiles.length === 1) {
      setError("Please add at least two PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (const file of pdfFiles) {
        const pdf = await PDFDocument.load(file.data);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      saveAs(blob, "merged-document.pdf");
    } catch (err) {
      console.error("Error merging PDFs:", err);
      setError(
        "An error occurred while merging the PDF files. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setPDFFiles([]);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">PDF Merger</h1>
        <p className="text-muted-foreground">
          Combine multiple PDF files into a single document
        </p>
      </div>

      {/* File Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FilePlus2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Drag & Drop PDF Files Here
        </h3>
        <p className="text-muted-foreground mb-4">
          Or click the button below to select files
        </p>
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          Select PDF Files
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2">
          <FileX className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {pdfFiles.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {pdfFiles.length} {pdfFiles.length === 1 ? "File" : "Files"}{" "}
              Selected
            </h3>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="space-y-3">
            {pdfFiles.map((file, index) => (
              <Card key={`${file.name}-${index}`} className="overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 truncate">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUpDown className="h-4 w-4 rotate-90" />
                      <span className="sr-only">Move up</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveFile(index, "down")}
                      disabled={index === pdfFiles.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowUpDown className="h-4 w-4 -rotate-90" />
                      <span className="sr-only">Move down</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {pdfFiles.length > 0 && (
        <Button
          className="mt-4"
          onClick={mergePDFs}
          disabled={isProcessing || pdfFiles.length < 2}
        >
          <Download className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : "Merge & Download"}
        </Button>
      )}
    </div>
  );
}
