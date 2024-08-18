import { Footer as FlowFooter, FooterCopyright, FooterLink, FooterLinkGroup } from 'flowbite-react';
import { FaFacebook, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    return (
        <FlowFooter container className="shadown-none shadow-footer z-10 min-h-14 p-4">
            <FooterCopyright href="#" by="p1n9" year={2024} />
            <div>
                <FooterLinkGroup>
                    <FooterLink href="#">
                        <FaGithub className="h-8 w-8" />
                    </FooterLink>
                    <FooterLink href="#">
                        <FaTwitter className="h-8 w-8" />
                    </FooterLink>
                    <FooterLink href="#">
                        <FaFacebook className="h-8 w-8" />
                    </FooterLink>
                </FooterLinkGroup>
            </div>
        </FlowFooter>
    );
}
