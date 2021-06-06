// import 'twin.macro';
import styledImport from '@emotion/styled';
import { CSSProp, css as cssImport } from '@emotion/core';

declare module 'twin.macro' {
  // The styled and css imports
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

export type {} from '@emotion/styled';

// declare module 'react' {
//   // The css prop
//   interface HTMLAttributes<T> extends DOMAttributes<T> {
//     css?: CSSProp;
//   }
//   // The inline svg css prop
//   interface SVGProps<T> extends SVGProps<SVGSVGElement> {
//     css?: CSSProp;
//   }
// }
