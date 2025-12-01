import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FiDownload, FiExternalLink, FiFileText } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ResumeViewerModal = ({ isOpen, onClose, resumeUrl, candidateName }) => {
  const [loading, setLoading] = useState(true);

  const getFileExtension = (url) => {
    if (!url) return '';
    const urlWithoutQuery = url.split('?')[0];
    return urlWithoutQuery.split('.').pop().toLowerCase();
  };

  const fileExtension = getFileExtension(resumeUrl);
  const isPDF = fileExtension === 'pdf';
  const isDoc = ['doc', 'docx'].includes(fileExtension);

  const handleDownload = async () => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName?.replace(/\s+/g, '_')}_Resume.${fileExtension}` || `Resume.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download resume');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Resume - ${candidateName || 'Candidate'}`} size="xl">
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-3 pb-4 border-b border-border">
          <Button
            onClick={handleDownload}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <FiDownload />
            Download
          </Button>
          <Button
            onClick={handleOpenInNewTab}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FiExternalLink />
            Open in New Tab
          </Button>
        </div>

        {/* Resume Viewer */}
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '70vh' }}>
          {isPDF ? (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading resume...</p>
                  </div>
                </div>
              )}
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title="Resume Viewer"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  toast.error('Failed to load PDF. Try downloading instead.');
                }}
              />
            </>
          ) : isDoc ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FiFileText size={64} className="text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Word Document</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Word documents cannot be previewed directly in the browser. Please download the file to view it.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <FiDownload />
                  Download Resume
                </Button>
                <Button onClick={handleOpenInNewTab} variant="outline" className="flex items-center gap-2">
                  <FiExternalLink />
                  Open in New Tab
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FiFileText size={64} className="text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Unsupported Format</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                This file format cannot be previewed. Please download the file to view it.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <FiDownload />
                  Download Resume
                </Button>
                <Button onClick={handleOpenInNewTab} variant="outline" className="flex items-center gap-2">
                  <FiExternalLink />
                  Open in New Tab
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* PDF Notice */}
        {isPDF && (
          <div className="text-xs text-muted-foreground text-center">
            <p>If the PDF doesn't display properly, try downloading it or opening in a new tab.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ResumeViewerModal;
