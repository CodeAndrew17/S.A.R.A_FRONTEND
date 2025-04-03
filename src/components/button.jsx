import React from 'react';
import Button from './button_style';

const CustomButton = ({ children, icon:Icon,  onClick, bgColor, hoverColor, width, height }) => {
  return (
    <Button $bgColor={bgColor} $hoverColor={hoverColor} width={width} height={height} onClick={onClick}>
      {Icon && <Icon />}
      {children}
    </Button>
  );
};

export default CustomButton;