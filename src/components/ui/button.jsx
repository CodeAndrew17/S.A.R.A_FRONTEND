import React from 'react';
import Button from './button_style';

const CustomButton = ({
  children,
  icon: Icon,
  onClick,
  bgColor,
  hoverColor,
  width,
  height,
  style,
  className,
  disabled
}) => {
  return (
    <Button
      $bgColor={bgColor}
      $hoverColor={hoverColor}
      width={width}
      height={height}
      onClick={!disabled ?onClick : undefined}
      style={{
        ...style,
        cursor: disabled ? 'not-allowed' : 'pointer', 
        opacity: disabled ? 0.6 : 1, 
      }}
      className={className}
      disabled={disabled}
    >
      {Icon && <Icon />}
      {children}
    </Button>
  );
};

export default CustomButton;