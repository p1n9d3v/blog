import { cx } from 'class-variance-authority';
import { MegaMenu, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import React from 'react';

function Header() {
    return (
        <header>
            <MegaMenu>
                <NavbarBrand>
                    <span className="text-3xl font-bold uppercase">p1n9</span>
                </NavbarBrand>
                <NavbarToggle />
                <NavbarCollapse>
                    <NavbarLink href="#">Home</NavbarLink>
                    <NavbarLink href="#">Posts</NavbarLink>
                    <NavbarLink href="#">About</NavbarLink>
                </NavbarCollapse>
            </MegaMenu>
        </header>
    );
}

export default Header;
