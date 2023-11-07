import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";

export interface ListLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function ListLayout({ children, title }: ListLayoutProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">{title}</h1>
        <Button
          asChild
          className="px-4 py-1 bg-gray-800 text-white rounded-lg flex items-center gap-x-2 text-sm"
          type="button"
        >
          <Link to="create">
            <span>Create</span>
            <LuPlus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      {children}
    </div>
  );
}
