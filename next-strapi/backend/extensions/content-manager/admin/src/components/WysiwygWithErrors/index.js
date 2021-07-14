import React from 'react';
import PropTypes from 'prop-types';
import  CKEditor  from './CKEditor/index';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
// import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert/imageinsertui';
const Wrapper = styled.div`
  .ck-editor__main {
    min-height: 200px;
    marin-bottom: 1rem;
    > div {
      min-height: 200px;
    }
  }
`;

const Editor = ({ onChange, name, value }) => {
  return (
    <Wrapper>
      <CKEditor onChange={onChange} name={name} value={value} />
    </Wrapper>
  );
};

Editor.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Editor;