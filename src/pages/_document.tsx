import { Html, Head, Main, NextScript } from 'next/document';

export default function Document()
{
    return (
        <Html dir='rtl'>
            < Head />
            <body className='bg-gradient-to-bl bg-opacity-80 to-zinc-200 from-white '>
                <Main />
                <NextScript />
            </body>
        </Html >
    );
}