// CKEditorComponent.js
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';

const CKEditorComponent = ({ onChange }) => {
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
    if (onChange) {
      onChange(data);
    }
  };

  return <CKEditor editor={ClassicEditor} data={editorData} onChange={handleEditorChange} />;
};

export default CKEditorComponent;
