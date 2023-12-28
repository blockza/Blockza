import logger from '@/lib/logger';
import dynamic from 'next/dynamic';
import React, { useState, useRef, useMemo, useEffect } from 'react';
// import JoditEditor from 'jodit-react';
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface JoditConfig {
  readonly?: boolean;
  placeholder?: string;
  // Add other Jodit configuration options here
}
const Texteditor: React.FC<{
  placeholder?: string;
  onChangefn: any;
  initialValue: string;
  value: string;
}> = ({ placeholder, onChangefn, initialValue, value }) => {
  const [content, setContent] = useState<any>('');
  //  editor
  const config: JoditConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || 'Start typing...',
      // Add other Jodit configuration options here
    }),
    [placeholder]
  );

  const editor = useRef<any>(null);
  useEffect(() => {
    // setContent(initialValue);
  }, [initialValue]);
  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent) => onChangefn(newContent)}
      // onChange={(e) => {
      //   onChangefn(e);
      // }}
      // tabIndex={3}
    />
  );
};
export default Texteditor;
