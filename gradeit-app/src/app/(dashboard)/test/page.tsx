'use client'
import Editor from '@monaco-editor/react';
export default function TestPage() {

  return <Editor
    height="90vh"
    defaultLanguage="python"
    defaultValue="print('Hello, world!')"
  />
}