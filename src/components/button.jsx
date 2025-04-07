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
}) => {
  return (
    <Button
      $bgColor={bgColor}
      $hoverColor={hoverColor}
      width={width}
      height={height}
      onClick={onClick}
      style={style}
      className={className}
    >
      {Icon && <Icon />}
      {children}
    </Button>
  );
};

export default CustomButton;
