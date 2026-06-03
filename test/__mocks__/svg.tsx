import React from "react";

const SvgrMock = React.forwardRef<
  HTMLSpanElement,
  React.PropsWithChildren<{ className?: string; onClick?: () => void }>
>((props, ref) => <span ref={ref} {...props} />);
SvgrMock.displayName = "SvgMock";

export default SvgrMock;
export const ReactComponent = SvgrMock;
