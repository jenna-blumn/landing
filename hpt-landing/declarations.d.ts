declare module '*.png' {
  const value: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default value;
}

declare module '*.jpg' {
  const value: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default value;
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
