import { makeStyles, Title1 } from "@fluentui/react-components";

export interface DetailsPageLayoutProps {
  children: React.ReactNode;
  title: string;
}

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
  },
});

export default function DetailsPageLayout({
  children,
  title,
}: DetailsPageLayoutProps) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.header}>
        <Title1 weight="medium">{title}</Title1>
      </div>

      {children}
    </div>
  );
}
