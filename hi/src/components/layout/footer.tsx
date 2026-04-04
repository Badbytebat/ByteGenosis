
"use client";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-background/40 py-8 px-6 text-center text-sm text-muted-foreground backdrop-blur-md">
      <div className="flex items-center justify-center gap-2">
        Built by Ritesh. All rights reserved. &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
