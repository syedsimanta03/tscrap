import React from 'react';

// Mock for using jest with svgr https://github.com/gregberge/svgr/issues/83#issuecomment-575038115

// eslint-disable-next-line
const SvgrMock = React.forwardRef((props, ref) => <span ref={ref} {...props} />);

export const ReactComponent = SvgrMock;
export default SvgrMock;
