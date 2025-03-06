"use client";

import { useEffect, useRef } from "react";
import { Editor, loader } from "@monaco-editor/react";
import type * as monaco from "monaco-editor";
import { Play, Send } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { LANGUAGE_ID_MAP } from "@/config/constants";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
}

export function CodeEditor({
  code,
  onChange,
  language,
  onRun,
  onSubmit,
  isRunning,
}: CodeEditorProps) {
  // const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  // const monacoEl = useRef(null)

  // useEffect(() => {
  //   if (monacoEl.current) {
  //     loader.init().then((monaco) => {
  //       editorRef.current = monaco.editor.create(monacoEl.current!, {
  //         value: code,
  //         language,
  //         theme: "vs-dark",
  //         minimap: { enabled: false },
  //         fontSize: 14,
  //         fontFamily: "JetBrains Mono, monospace",
  //         automaticLayout: true,
  //         padding: { top: 16 },
  //       })

  //       editorRef.current.onDidChangeModelContent(() => {
  //         onChange(editorRef.current!.getValue())
  //       })
  //     })

  //     return () => editorRef.current?.dispose()
  //   }
  // }, [code, language, onChange])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[#2D2D2D] px-4 py-2">
        <Select defaultValue={language}>
          <SelectTrigger className="w-32 border-[#2D2D2D] bg-transparent text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(LANGUAGE_ID_MAP).map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onRun}
            disabled={isRunning}
            className="gap-1.5 border-[#2D2D2D] bg-transparent text-white hover:bg-[#2D2D2D]"
          >
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isRunning}
            className="gap-1.5 bg-[#7EBF8E] text-white hover:bg-[#6CAF7E]"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>

      <Editor
        height="100%"
        defaultLanguage={language.toLowerCase()}
        defaultValue=""
        onChange={(value) => onChange(value ?? "")} // Ensure value is never undefined
        className="flex-1"
        value={code}
        language={language.toLowerCase()}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
