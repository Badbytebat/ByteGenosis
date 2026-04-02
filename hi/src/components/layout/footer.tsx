
"use client";

const Footer = () => {
  return (
    <footer className="bg-background py-8 px-6 text-center text-muted-foreground text-sm border-t">
      <div className="flex items-center justify-center gap-2">
        Built by Ritesh. All rights reserved. &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
