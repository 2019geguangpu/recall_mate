"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { VoiceRecord, VoiceRecordStatus } from "@/lib/types/voice-record";
import "@/lib/types/speech-recognition";

interface VoiceRecorderProps {
  onRecordComplete?: (record: VoiceRecord) => void;
  onTranscript?: (text: string) => void;
}

export function VoiceRecorder({ onRecordComplete, onTranscript }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<VoiceRecordStatus>("completed");
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string>("");
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const isRecordingRef = useRef<boolean>(false);

  // 检查浏览器是否支持 SpeechRecognition API
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError("您的浏览器不支持语音识别功能。请使用 Chrome、Edge 或 Safari 14.1+ 浏览器。");
    }
  }, []);

  useEffect(() => {
    return () => {
      // 清理资源
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!isSupported) {
      alert("您的浏览器不支持语音识别功能");
      return;
    }

    try {
      // 初始化 SpeechRecognition
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // 配置识别参数
      recognition.continuous = true; // 持续识别
      recognition.interimResults = true; // 返回临时结果
      recognition.lang = "zh-CN"; // 设置为中文

      // 开始录音（可选，用于保存音频）
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const record: VoiceRecord = {
          id: `voice-${Date.now()}`,
          type: "note",
          status: "completed",
          audioUrl,
          duration,
          transcript: finalTranscriptRef.current,
          confidence: 0.9, // SpeechRecognition 会提供置信度
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (onRecordComplete) {
          onRecordComplete(record);
        }
        if (onTranscript && finalTranscriptRef.current) {
          onTranscript(finalTranscriptRef.current);
        }
      };

      // 语音识别事件处理
      recognition.onstart = () => {
        isRecordingRef.current = true;
        setIsRecording(true);
        setStatus("recording");
        setDuration(0);
        setTranscript("");
        setInterimTranscript("");
        finalTranscriptRef.current = "";
        setError("");
        mediaRecorder.start();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript;
          setTranscript(finalTranscriptRef.current);
          setInterimTranscript("");
        } else {
          setInterimTranscript(interimTranscript);
        }

        // 实时回调
        if (onTranscript && finalTranscript) {
          onTranscript(finalTranscriptRef.current);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setError(`识别错误: ${event.error}`);
        if (event.error === "no-speech") {
          // 没有检测到语音，可以继续等待
          return;
        }
        stopRecording();
      };

      recognition.onend = () => {
        // 如果还在录音状态，自动重启（实现连续识别）
        if (isRecordingRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // 如果启动失败，停止录音
            stopRecording();
          }
        }
      };

      // 开始识别
      recognition.start();
      setStatus("recording");

      // 计时器
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("无法访问麦克风，请检查权限设置");
      alert("无法访问麦克风，请检查权限设置");
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setStatus("completed");
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold">语音记录</h3>
        
        {/* 录音状态显示 */}
        <div className="flex flex-col items-center gap-2">
          {isRecording && (
            <div className="flex items-center gap-2 text-destructive">
              <span className="h-3 w-3 animate-pulse rounded-full bg-destructive"></span>
              <span className="text-sm font-medium">录音中...</span>
            </div>
          )}
          {status === "processing" && (
            <div className="flex items-center gap-2 text-secondary-600">
              <span className="text-sm font-medium">处理中...</span>
            </div>
          )}
          {duration > 0 && (
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatDuration(duration)}
            </div>
          )}
        </div>

        {/* 录音按钮 */}
        <div className="flex gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <span className="text-xl">🎤</span>
              <span>开始录音</span>
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              size="lg"
              className="gap-2"
            >
              <span className="text-xl">⏹</span>
              <span>停止录音</span>
            </Button>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mt-4 w-full rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* 浏览器支持提示 */}
        {!isSupported && (
          <div className="mt-4 w-full rounded-md border border-secondary-400 bg-secondary-50 p-4">
            <p className="text-sm text-secondary-800">
              ⚠️ 您的浏览器不支持语音识别功能
            </p>
            <p className="mt-1 text-xs text-secondary-700">
              请使用 Chrome、Edge 或 Safari 14.1+ 浏览器以获得最佳体验
            </p>
          </div>
        )}

        {/* 转录结果显示 */}
        {(transcript || interimTranscript) && (
          <div className="mt-4 w-full rounded-md border border-border bg-muted p-4">
            <p className="text-sm text-muted-foreground">转录结果：</p>
            {transcript && (
              <p className="mt-2 text-foreground">{transcript}</p>
            )}
            {interimTranscript && (
              <p className="mt-2 text-muted-foreground italic">
                {interimTranscript}
                <span className="ml-1 animate-pulse">|</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

