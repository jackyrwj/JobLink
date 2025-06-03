import { forwardRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>((props, ref) => {
  const { style, className, src, alt, width, height, ...rest } = props;
  
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      ref={ref}
      className={className}
      style={{
        ...style,
        maxWidth: '100%',
        height: 'auto',
      }}
      loading="eager"
      {...rest}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 