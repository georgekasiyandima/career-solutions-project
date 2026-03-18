import Providers from '../src/components/providers/Providers';
import '../src/assets/styles/global.css';

export const metadata = {
  title: 'Career Solutions',
  description: 'Empowering your career journey with job opportunities and career services.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Montserrat:wght@500;700&family=Tangerine:wght@700&family=Playfair+Display:ital,wght@1,700&family=Lora:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

