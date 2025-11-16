"use client";

import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";
import { TextInput } from "@/components/text-input/text-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import type { VoiceRecord } from "@/lib/types/voice-record";

type InputMode = "voice" | "text";

interface InputSwitcherProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  onRecordComplete?: (record: VoiceRecord) => void;
  onTranscript?: (text: string) => void;
  isProcessing?: boolean;
}

export function InputSwitcher({
  mode,
  onModeChange,
  onRecordComplete,
  onTranscript,
  isProcessing = false,
}: InputSwitcherProps) {
  return (
    <div className="space-y-4">
      {/* 模式切换 - 使用 Tabs 组件 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">记录输入</h3>
        <Tabs value={mode} onValueChange={(value) => onModeChange(value as InputMode)}>
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="voice" className="flex items-center gap-1.5 cursor-pointer">
              <span>🎤</span>
              <span>语音</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-1.5 cursor-pointer">
              <span>✏️</span>
              <span>文字</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 内容区域 */}
      <div className="rounded-lg border border-border bg-card p-6 relative">
        {/* Loading 遮罩层 */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg z-10">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="md" variant="primary" />
              <p className="text-sm font-medium text-muted-foreground">
                正在处理中...
              </p>
            </div>
          </div>
        )}

        {/* 语音输入模式 */}
        {mode === "voice" && (
          <div className="-m-6">
            <VoiceRecorder
              onRecordComplete={onRecordComplete}
              onTranscript={onTranscript}
            />
          </div>
        )}

        {/* 文字输入模式 */}
        {mode === "text" && (
          <TextInput
            onRecordComplete={onRecordComplete}
            onTranscript={onTranscript}
          />
        )}
      </div>
    </div>
  );
}

