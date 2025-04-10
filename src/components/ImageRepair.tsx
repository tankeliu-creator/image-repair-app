import React, { useEffect, useState } from 'react';
import { Button, Progress } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import './ImageRepair.css';

interface ImageRepairProps {
  imageUrl: string;
  onRepairComplete: (repairedImage: string) => void;
  autoStart?: boolean;
}

const ImageRepair: React.FC<ImageRepairProps> = ({ imageUrl, onRepairComplete, autoStart = false }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isRepairing, setIsRepairing] = useState<boolean>(false);

  useEffect(() => {
    if (autoStart) {
      startRepair();
    }
  }, [autoStart]);

  const startRepair = () => {
    setIsRepairing(true);
    setProgress(0);

    // Simulate repair progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRepairing(false);
          // Simulate repair completion, should actually call repair API
          onRepairComplete(imageUrl);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  return (
    <div className="repair-content">
      {isRepairing ? (
        <div className="progress-container">
          <Progress 
            type="circle" 
            percent={progress} 
            format={(percent) => `${percent}%`}
          />
          <div className="progress-text">Repairing image...</div>
        </div>
      ) : (
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          size="large"
          onClick={startRepair}
        >
          Start Repair
        </Button>
      )}
    </div>
  );
};

export default ImageRepair; 