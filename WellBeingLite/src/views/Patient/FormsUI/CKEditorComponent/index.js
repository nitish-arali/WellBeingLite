// MyCKEditor.js
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorComponent = ({ data, onChange, readOnly }) => (
  <CKEditor
    editor={ClassicEditor}
    data={data}
    onChange={(event, editor) => {
      const updatedData = editor.getData();
      onChange(updatedData);
    }}
    disabled={readOnly}
  />
);

export default CKEditorComponent;
