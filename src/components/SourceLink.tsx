import React from "react";

interface SourceLinkProps {
  href: string;
  source: string;
}

const SourceLink = ({ href, source }: SourceLinkProps) => {
  return (
    <div className="mt-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-400 inline-block underline"
      >
        From {source}
      </a>
    </div>
  );
};

export default SourceLink;
