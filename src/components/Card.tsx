import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="border border-gray-700 rounded-md p-4 bg-gray-900">
      {children}
    </div>
  );
};

export default Card;
