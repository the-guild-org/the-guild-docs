import React, { useEffect, useState, ReactElement } from 'react';
import mermaid from 'mermaid';

/**
 * Assign a unique ID to each mermaid svg as per requirements of `mermaid.render`.
 */
let id = 0;

export const Mermaid = ({ chart }: { chart: string }): ReactElement => {
  // When theme updates, rerender the SVG.
  const [svg, setSVG] = useState('');

  useEffect(() => {
    mermaid.render(`mermaid-svg-${id}`, chart, setSVG);
    id += 1;
  }, [chart]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};
