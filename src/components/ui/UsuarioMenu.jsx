import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";

const MenuContent = styled(DropdownMenu.Content)`
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 4px 0;
    min-width: 120px;
`;

const MenuItem = styled(DropdownMenu.Item)`
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
        background: #f5f5f5;
    }
`;

export function UsuarioMenu() {
    return (
        <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
            <button style={{ cursor: "pointer" }}>⋮</button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <MenuContent side="bottom" align="end">
            <MenuItem onSelect={() => console.log("Editar")}>Editar</MenuItem>
            <MenuItem onSelect={() => console.log("Eliminar")}>Eliminar</MenuItem>
            </MenuContent>
        </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
