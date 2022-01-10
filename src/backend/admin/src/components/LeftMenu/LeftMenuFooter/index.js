/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import Wrapper, { A } from './Wrapper';

function LeftMenuFooter({ version }) {
  // PROJECT_TYPE is an env variable defined in the webpack config
  // eslint-disable-next-line no-undef
  const projectType = PROJECT_TYPE;

  return (
    <Wrapper>
      <div className="poweredBy">
        {/* <A key="website" href="https://strapi.io" target="_blank" rel="noopener noreferrer">
          Strapi
        </A>
        &nbsp;
        <A
          href={`https://github.com/strapi/strapi/releases/tag/v${version}`}
          key="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          v{version}
        </A>
        &nbsp; */}
        <A href="https://ftech.ai" target="_blank" rel="noopener noreferrer">
          Produced by: Ftech.ai
        </A>
      </div>
    </Wrapper>
  );
}

export default LeftMenuFooter;
