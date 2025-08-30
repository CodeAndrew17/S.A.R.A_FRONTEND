import React from 'react';
import styled from 'styled-components';

const TabsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 1.5rem;
  background-color: #f0f0f0;
  height: 90px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
`;

const TabBtn = styled.button`
  background: none;
    margin-top: 15px;
  border: none;
  font-size: 2.3rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif; 
  padding: .6rem 0;
  cursor: pointer;
  color: ${({ $active }) => ($active ? '#000' : '#777')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : 0)};
    height: 3px;
    background: #1d6e94;
    transition: width .25s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;



export default function TabsContainer({ tabs, activeId, onChange }) {
  return (
    <>
      <TabsBar>
        {tabs.map(t => (
          <TabBtn
            key={t.id}
            $active={t.id === activeId}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </TabBtn>
        ))}
      </TabsBar>


      {tabs.find(t => t.id === activeId)?.element}
    </>
  );
}
