
"use client";

const Footer = () => {
  return (
    <footer className="py-8 px-6 text-center text-muted-foreground text-sm border-t border-white/10">
      <div className="flex items-center justify-center gap-2">
        Built by Ritesh. All rights reserved. &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default Footer;
