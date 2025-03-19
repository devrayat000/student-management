import { makeStyles, Title1, Button } from "@fluentui/react-components";
import { Add16Filled, Add16Regular, bundleIcon } from "@fluentui/react-icons";
import { useNavigate } from "react-router";

export interface ListLayoutProps {
  title: string;
  children: React.ReactNode;
}

// const FluentLink =

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
});

const Add = bundleIcon(Add16Filled, Add16Regular);

export default function ListLayout({ children, title }: ListLayoutProps) {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div>
      <div className={classes.header}>
        <Title1 weight="medium">{title}</Title1>
        <Button
          to="create"
          className="px-4 py-1 bg-gray-800 text-white rounded-lg flex items-center gap-x-2 text-sm"
          icon={<Add />}
          iconPosition="after"
          appearance="primary"
          onClick={() => navigate("create")}
        >
          Create
        </Button>
      </div>
      {children}
    </div>
  );
}
