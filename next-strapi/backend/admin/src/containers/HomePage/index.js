import React, { memo } from 'react';
import { Block, Container } from './components';
import { auth, LoadingIndicatorPage } from 'strapi-helper-plugin';

const HomePage = ({ global: { plugins }, history: { push } }) => {

  const name = auth?.getUserInfo();

  return (
    <>
      <Container className="container-fluid">
        <div className="row">
          <div className="col-12">
            <Block>Hi {name?.firstname}!</Block>
          </div>
        </div>
      </Container>
    </>
  );
};

export default memo(HomePage);