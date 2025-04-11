import React, { useState, useRef } from 'react';
import { Upload, Button, Typography } from 'antd';
import { UploadOutlined, DownloadOutlined, UndoOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ImageRepair from './components/ImageRepair';
import './App.css';

const { Title, Text } = Typography;

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [repairedImage, setRepairedImage] = useState<string>('');
  const [dividerPosition, setDividerPosition] = useState<number>(50);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          setOriginalImage(e.target?.result as string);
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRepairComplete = (repairedImage: string) => {
    setRepairedImage(repairedImage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const percentage = (x / containerRect.width) * 100;
    
    const newPosition = Math.max(0, Math.min(100, percentage));
    setDividerPosition(newPosition);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = repairedImage;
    link.download = 'repaired-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <header className="header">
        <Title level={2}>AI Photo Restoration</Title>
        <Text type="secondary">
          Restore old photos, repair damaged areas, and enhance image quality using AI technology
        </Text>
        <div className="header-features">
          <Text>
            <CheckCircleOutlined /> High-quality restoration
          </Text>
          <Text>
            <CheckCircleOutlined /> Face enhancement
          </Text>
          <Text>
            <CheckCircleOutlined /> Color correction
          </Text>
        </div>
      </header>

      <div className="main-content">
        <div className="content-wrapper">
          {!originalImage ? (
            <div className="upload-section">
              <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                accept="image/*"
                multiple={false}
              >
                <div className="upload-placeholder">
                  <UploadOutlined className="upload-icon" />
                  <Text type="secondary">Click or drag an image here</Text>
                  <Text type="secondary" className="upload-hint">
                    Supports JPG, PNG formats, max size 5MB
                  </Text>
                </div>
              </Upload>
            </div>
          ) : (
            <div className="image-comparison">
              <div className="image-card">
                <div className="image-label left">After</div>
                <div className="image-label right">Before</div>
                <div 
                  className="image-container"
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                >
                  {repairedImage ? (
                    <>
                      <div className="image-wrapper">
                        <img
                          src={repairedImage}
                          alt="repaired"
                          className="preview-image"
                        />
                      </div>
                      <div 
                        className="image-wrapper"
                        style={{ clipPath: `inset(0 0 0 ${dividerPosition}%)` }}
                      >
                        <img
                          src={originalImage}
                          alt="original"
                          className="preview-image"
                        />
                      </div>
                      <div 
                        className="divider"
                        style={{ left: `${dividerPosition}%` }}
                      >
                        <div className="divider-handle" />
                      </div>
                    </>
                  ) : (
                    <div className="repair-container">
                      <ImageRepair
                        imageUrl={originalImage}
                        onRepairComplete={handleRepairComplete}
                        autoStart={true}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="action-buttons-container">
                <div className="restart-button">
                  <Button 
                    icon={<UndoOutlined />}
                    onClick={() => {
                      setOriginalImage('');
                      setRepairedImage('');
                      setImageSize(null);
                    }}
                  >
                    Restart
                  </Button>
                </div>
                {repairedImage && (
                  <div className="download-button">
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleDownload}
                    >
                      Download Restored Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <Text type="secondary">
          2025 AI Photo Restoration. All rights reserved.
        </Text>
        <div className="footer-links">
          <Button type="link">About</Button>
          <Button type="link">Privacy</Button>
          <Button type="link">Terms</Button>
        </div>
      </footer>
    </div>
  );
};

export default App;
