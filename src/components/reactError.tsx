import type { JSX } from 'astro/jsx-runtime';

export default function errorOccurred(message: string): JSX.Element {
    return <select><option value="">{message}</option></select>;
}