import { MegaMenu, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import React from 'react';

function Header() {
    return (
        <MegaMenu>
            <NavbarBrand>
                <span className="text-3xl font-bold uppercase">p1n9</span>
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse>
                <NavbarLink href="#">Home</NavbarLink>
                <NavbarLink href="#">About</NavbarLink>
            </NavbarCollapse>
        </MegaMenu>
    );
}

export default Header;
