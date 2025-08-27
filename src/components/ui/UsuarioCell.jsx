import * as Popover from "@radix-ui/react-popover";
import styled from "styled-components";

const Username = styled.span`
    cursor: pointer;
    font-weight: 500;
    color: #333;
    &:hover {
        text-decoration: underline dotted;
    }
`;

const PopoverContent = styled(Popover.Content)`
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
`;

export function UsuarioPopover({ usuario }) {
    return (
        <Popover.Root>
        <Popover.Trigger asChild>
            <Username>{usuario.username}</Username>
        </Popover.Trigger>
        <Popover.Portal>
            <PopoverContent side="top" align="start">
            <p>Estado: {usuario.activo ? "Activo" : "Inactivo"}</p>
            <p>Rol: {usuario.rol}</p>
            </PopoverContent>
        </Popover.Portal>
        </Popover.Root>
    );
}
