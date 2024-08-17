import Image from 'next/image';
import { Button } from 'flowbite-react';

export default function Home() {
    return (
        <main className="container">
            <Image src="Avatar.svg" alt="Avatar" width={500} height={500} />
            <Button>Click me</Button>
        </main>
    );
}
