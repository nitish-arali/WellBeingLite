// RichTextEditor.jsx

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const RichTextEditor = () => {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      formats: ['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'align', 'list', 'indent', 'link', 'image', 'color'],
      modules: {
        toolbar: [
          [{ header: [1, 2, 3,4,5,6, false] }],
          ['font', 'size', 'bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['list', 'bullet', 'indent'],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    const exportToPDF = async () => {
      try {
        const content = quill.root.innerHTML;

        const canvas = await html2canvas(quill.root, { scale: 2 });

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 277);

        pdf.save('exported_content.pdf');
      } catch (error) {
        console.error('Error exporting to PDF:', error);
      }
    };

    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('export-pdf', exportToPDF);

    return () => {
      // quill.destroy();
    };
  }, []);

  return (
    <div>
      <div id="toolbar">
        <button id="export-pdf-button" onClick={() => quillRef.current.getModule('toolbar').handlers['export-pdf']()}>
          Export to PDF
        </button>
      </div>
      <div ref={quillRef} />
    </div>
  );
};

export default RichTextEditor;
