import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import EditorType from 'ckeditor5-custom-build/build/ckeditor';
import styled from 'styled-components';
import MyCustomUploadAdapterPlugin from './MyCustomUploadAdapterPlugin';
// import markdown from "markdown";
const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    > div {
      min-height: 200px;
    }
  }
`;

const configuration = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'underline',
    'strikethrough',
    'highlight',
    '|',
    'bulletedList',
    'numberedList',
    'listStyle',
    'autLink',
    '|',
    'indent',
    'outdent',
    'alignment',
    '|',
    // 'code',
    'fontsize',
    'fontfamily',
    'fontcolor',
    'fontBackgroundColor',
    'pageBreak',
    '|',
    'insertTable',
    'insertImage',
    'imageToolbar',
    '|',
    'undo',
    'redo',
    'horizontalLine',
    'findAndReplace',
    'wordCount',
    'blockQuote',
    'htmlEmbed',
    'tableCellProperties',
    'tabkeProperties',
    'code',
  ],
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:side',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'imageTextAlternative',
    ],

    // The default value.
    styles: [
      'full',
      'side',
      'alignLeft',
      'alignCenter',
      'alignRight',
    ]
  },
  extraPlugins: [MyCustomUploadAdapterPlugin],
};

const Editor = ({ onChange, name, value }) => {
  const [initData, setInitData] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      setInitData(value)
    }
  }, [isReady])

  return (
    <Wrapper>
      {
        <CKEditor
          config={configuration || []}
          editor={EditorType}
          data={initData || ''}
          onReady={() => {
            setIsReady(true);
          }}

          onChange={(event, editor) => {
            const data = editor.getData();
            onChange({ target: { name, value: data } });
          }} />
      }
    </Wrapper>
  );
};

export default Editor;