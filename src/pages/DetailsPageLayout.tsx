import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";

import { Button } from "~/components/ui/button";

export interface DetailsPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DetailsPageLayout({
  children,
  title,
}: DetailsPageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="justify-self-start"
        >
          <LuArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-medium justify-self-center">{title}</h1>
        <div />
      </div>

      {children}
    </div>
  );
}
